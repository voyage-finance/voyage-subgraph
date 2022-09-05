import { BigInt, log } from '@graphprotocol/graph-ts';
import { Liquidation, Loan, Repayment } from '../../generated/schema';
import { Borrow, Liquidate, Repayment as RepaymentEvent } from '../../generated/Voyage/Voyage';
import {
  getOrInitLoan,
  getOrInitReserveById,
  getOrInitReserveConfiguration,
} from '../helpers/initializers';
import { updateLoanEntity } from '../helpers/updaters';
import { getLoanEntityId, getRepaymentEntityId, getReserveId } from '../utils/id';
import { rayDiv, rayMul } from '../utils/math';

export function handleBorrow(event: Borrow): void {
  const reserveId = getReserveId(event.params._collection, event.address.toHexString());
  const configuration = getOrInitReserveConfiguration(reserveId);
  const loan = getOrInitLoan(
    event.params._vault,
    event.params._collection,
    event.params._loanId,
    event,
  );

  const nper = configuration.loanTenure.div(configuration.loanInterval);
  loan.tokenId = event.params._tokenId;
  loan.apr = event.params._apr;
  loan.epoch = configuration.loanInterval;
  loan.term = configuration.loanTenure;
  loan.nper = nper;

  loan.principal = event.params._principal;
  loan.interest = event.params._interest;
  loan.pmt_principal = event.params._principal.div(nper);
  loan.pmt_interest = event.params._interest.div(nper);
  loan.pmt_payment = loan.pmt_principal.plus(loan.pmt_interest);

  loan.totalPrincipalPaid = loan.pmt_principal;
  loan.totalInterestPaid = loan.pmt_interest;
  loan.paidTimes = BigInt.fromI32(1);
  loan.save();

  const reserve = getOrInitReserveById(reserveId);
  const numer = rayMul(reserve.totalPrincipal, reserve.borrowRate).plus(
    rayMul(loan.principal, loan.apr),
  );
  const denom = reserve.totalPrincipal.plus(loan.principal);
  reserve.borrowRate = rayDiv(numer, denom);
  reserve.totalPrincipal = reserve.totalPrincipal.plus(event.params._principal);
  reserve.totalInterest = reserve.totalInterest.plus(event.params._interest);
  const loanBorrow = event.params._principal.plus(event.params._interest);
  reserve.totalBorrow = reserve.totalBorrow.plus(loanBorrow);
  reserve.totalLiquidity = reserve.totalLiquidity.plus(event.params._interest);
  reserve.save();
}

export function handleRepay(event: RepaymentEvent): void {
  const loanId = getLoanEntityId(
    event.params._vault,
    event.params._collection,
    event.params._loanId,
  );
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

  const id = getRepaymentEntityId(loan.id, event.params._repaymentId);
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
  liquidationEntity.reserve = collection;
  liquidationEntity.loanId = event.params._drowDownId;
  liquidationEntity.repaymentId = event.params._repaymentId;
  liquidationEntity.loan = loanId;
  liquidationEntity.repayment = repaymentId;
  liquidationEntity.totalDebt = event.params._debt;
  liquidationEntity.amountToWriteDown = event.params._amountToWriteDown;

  liquidationEntity.save();
}
