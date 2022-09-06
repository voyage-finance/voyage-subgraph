import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import { Liquidation, Loan, Repayment } from '../../generated/schema';
import { Borrow, Liquidate, Repayment as RepaymentEvent } from '../../generated/Voyage/Voyage';
import {
  getOrInitAsset,
  getOrInitLoan,
  getOrInitRepayment,
  getOrInitReserveById,
  getOrInitReserveConfiguration,
  getOrInitVToken,
} from '../helpers/initializers';
import {
  computeBorrowRateOnNewBorrow,
  computeDepositRate,
  computeJuniorDepositRate,
  computeSeniorDepositRate,
  computeUtilizationRate,
  getJuniorInterest,
  getSeniorInterest,
} from '../helpers/reserve-logic';
import { updateLoanEntity } from '../helpers/updaters';
import { getLoanId, getRepaymentId, getReserveId } from '../utils/id';

export function handleBorrow(event: Borrow): void {
  log.info('---- handling borrow ----', []);
  const reserveId = getReserveId(event.params._collection, event.address.toHexString());
  const reserveConfiguration = getOrInitReserveConfiguration(reserveId);

  const loan = getOrInitLoan(event.params._vault, reserveId, event.params._loanId, event);
  const collateral = getOrInitAsset(
    event.params._collection,
    event.params._tokenId,
    event.params._vault.toHexString(),
    loan.id,
  );
  collateral.isUnderLien = true;
  collateral.isLiquidated = false;
  collateral.save();
  loan.collateral = collateral.id;

  const nper = reserveConfiguration.loanTenure.div(reserveConfiguration.loanInterval);
  loan.apr = event.params._apr;
  loan.epoch = reserveConfiguration.loanInterval;
  loan.term = reserveConfiguration.loanTenure;
  loan.nper = nper;

  loan.principal = event.params._principal;
  loan.interest = event.params._interest;
  loan.protocolFee = event.params._protocolFee;
  loan.pmt_principal = event.params._principal.div(nper);
  loan.pmt_interest = event.params._interest.div(nper);
  loan.pmt_fee = event.params._protocolFee.div(nper);
  loan.pmt_payment = loan.pmt_principal.plus(loan.pmt_interest).plus(loan.pmt_fee);

  loan.totalPrincipalPaid = loan.pmt_principal;
  loan.totalInterestPaid = loan.pmt_interest;
  loan.paidTimes = BigInt.fromI32(1);
  loan.save();

  // save the first instalment
  const repayment = getOrInitRepayment(event.params._vault, loan.loanId, loan.paidTimes);
  repayment.loan = loan.id;
  repayment.principal = loan.pmt_principal;
  repayment.interest = loan.pmt_interest;
  repayment.fee = loan.pmt_fee;
  repayment.total = loan.pmt_payment;
  repayment.paidAt = event.block.timestamp;
  repayment.repaid = true;
  repayment.save();

  const reserve = getOrInitReserveById(reserveId);
  reserve.totalPrincipal = reserve.totalPrincipal.plus(event.params._principal);
  reserve.totalInterest = reserve.totalInterest.plus(event.params._interest);
  reserve.totalBorrow = reserve.totalBorrow.plus(loan.principal).plus(loan.interest);
  reserve.totalLiquidity = reserve.totalLiquidity.plus(event.params._interest);
  reserve.utilizationRate = computeUtilizationRate(reserve);
  reserve.borrowRate = computeBorrowRateOnNewBorrow(reserve, loan);
  reserve.depositRate = computeDepositRate(reserve);

  const juniorInterest = getJuniorInterest(loan, reserveConfiguration.incomeRatio);
  reserve.juniorTrancheLiquidity = reserve.juniorTrancheLiquidity.plus(juniorInterest);
  reserve.juniorTrancheDepositRate = computeJuniorDepositRate(reserve, reserveConfiguration);
  const juniorVToken = getOrInitVToken(Address.fromString(reserve.juniorTrancheVToken));
  juniorVToken.totalAssets = juniorVToken.totalAssets.plus(juniorInterest);
  juniorVToken.save();

  const seniorInterest = getSeniorInterest(loan, reserveConfiguration.incomeRatio);
  reserve.seniorTrancheLiquidity = reserve.seniorTrancheLiquidity.plus(seniorInterest);
  reserve.seniorTrancheDepositRate = computeSeniorDepositRate(reserve, reserveConfiguration);
  const seniorVToken = getOrInitVToken(Address.fromString(reserve.seniorTrancheVToken));
  seniorVToken.totalAssets = seniorVToken.totalAssets.plus(seniorInterest);
  seniorVToken.save();

  reserve.save();
}

export function handleRepay(event: RepaymentEvent): void {
  const loanId = getLoanId(event.params._vault, event.params._loanId);
  const loan = Loan.load(loanId);
  if (!loan) {
    // Should not happen, since a loan should exist in order for a repay to happen.
    log.error('tried to handle repay event for a non-existent loan. vault: {} asset: {} loan: {}', [
      event.params._vault.toHex(),
      event.params._collection.toHex(),
      event.params._loanId.toString(),
    ]);
    return;
  }
  updateLoanEntity(
    loan,
    event.params._vault,
    event.params._collection,
    event.params._loanId,
    event,
  );
  loan.save();

  const id = getRepaymentId(event.params._vault, event.params._loanId, event.params._repaymentId);
  const repayment = new Repayment(id);
  repayment.loan = loan.id;
  repayment.principal = loan.pmt_principal;
  repayment.interest = loan.pmt_interest;
  // we cannot use pmt.amount, as this may be a liquidation.
  // in the event of liquidation, the amount repaid could fall short if there is a partial or even complete write down of the debt.
  repayment.total = event.params._amount;
  repayment.paidAt = event.block.timestamp;
  repayment.repaid = event.params.isFinal;
  repayment.save();
}

export function handleLiquidate(event: Liquidate): void {
  const vaultAddress = event.params._vault.toHex();
  const collection = event.params._collection.toHex();
  const userAddress = event.params._liquidator.toHex();

  const loanId = [vaultAddress, collection, event.params._drowDownId.toString()].join('_');
  const repaymentId = [loanId, event.params._repaymentId.toString()].join('_');

  let liquidationEntity = Liquidation.load(repaymentId);
  if (!liquidationEntity) {
    liquidationEntity = new Liquidation(repaymentId);
  }

  liquidationEntity.liquidator = userAddress;
  liquidationEntity.vault = vaultAddress;
  // liquidationEntity.reserve = collection;
  // liquidationEntity.loanId = event.params._drowDownId;
  liquidationEntity.repaymentId = event.params._repaymentId;
  liquidationEntity.loan = loanId;
  liquidationEntity.repayment = repaymentId;
  liquidationEntity.totalDebt = event.params._debt;
  liquidationEntity.amountToWriteDown = event.params._amountToWriteDown;

  liquidationEntity.save();
}
