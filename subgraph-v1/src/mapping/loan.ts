import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Asset, Liquidation } from '../../generated/schema';
import {
  Borrow as BorrowLegacy,
  Borrow1 as Borrow,
  Liquidate,
  Repayment as RepaymentEvent,
} from '../../generated/Voyage/Voyage';
import { SECONDS_PER_DAY } from '../helpers/consts';
import {
  getOrInitAsset,
  getOrInitBuyNowTransaction,
  getOrInitLoan,
  getOrInitRepayment,
  getOrInitReserveById,
  getOrInitReserveConfiguration,
  getOrInitVToken,
} from '../helpers/initializers';
import {
  computeBorrowRateOnNewBorrow,
  computeBorrowRateOnNewRepay,
  computeDepositRate,
  computeJuniorDepositRate,
  computeSeniorDepositRate,
  computeUtilizationRate,
  getJuniorInterest,
  getSeniorInterest,
} from '../helpers/reserve-logic';
import { getReserveId } from '../utils/id';
import { zeroBI } from '../utils/math';

export function handleBorrowLegacy(event: BorrowLegacy): void {
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

  const zeroBigInt = zeroBI();
  const nper = !reserveConfiguration.loanInterval.isZero()
    ? reserveConfiguration.loanTenure.div(reserveConfiguration.loanInterval)
    : zeroBigInt;
  loan.apr = event.params._apr;
  loan.epoch = reserveConfiguration.loanInterval;
  loan.term = reserveConfiguration.loanTenure;
  loan.nper = nper;

  loan.principal = event.params._principal;
  loan.interest = event.params._interest;
  loan.protocolFee = event.params._protocolFee;
  loan.pmt_principal = !nper.isZero() ? event.params._principal.div(nper) : zeroBigInt;
  loan.pmt_interest = !nper.isZero() ? event.params._interest.div(nper) : zeroBigInt;
  loan.pmt_fee = !nper.isZero() ? event.params._protocolFee.div(nper) : zeroBigInt;
  loan.pmt_payment = loan.pmt_principal.plus(loan.pmt_interest).plus(loan.pmt_fee);

  loan.totalPrincipalPaid = loan.pmt_principal;
  loan.totalInterestPaid = loan.pmt_interest;
  loan.timestamp = event.block.timestamp;
  loan.nextPaymentDue = loan.timestamp.plus(loan.epoch.times(SECONDS_PER_DAY));
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
  repayment.save();

  const reserve = getOrInitReserveById(reserveId);
  const totalAdditionalPrincipal = event.params._principal.minus(loan.pmt_principal);
  const totalAdditionalInterest = event.params._interest.minus(loan.pmt_interest);
  reserve.totalPrincipal = reserve.totalPrincipal.plus(totalAdditionalPrincipal);
  reserve.totalInterest = reserve.totalInterest.plus(totalAdditionalInterest);
  reserve.totalBorrow = reserve.totalBorrow
    .plus(totalAdditionalPrincipal)
    .plus(totalAdditionalInterest);
  reserve.availableLiquidity = reserve.availableLiquidity
    .minus(totalAdditionalPrincipal)
    .plus(loan.pmt_interest);
  reserve.totalLiquidity = reserve.totalLiquidity
    .plus(event.params._interest)
    .plus(event.params._protocolFee);
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

  const buyNowTx = getOrInitBuyNowTransaction(
    event.params._vault,
    event.params._collection,
    event.params._tokenId,
    loan.id,
  );
  buyNowTx.txHash = event.transaction.hash;
  buyNowTx.save();
}

export function handleBorrow(event: Borrow): void {
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

  const zeroBigInt = zeroBI();
  const nper = !reserveConfiguration.loanInterval.isZero()
    ? reserveConfiguration.loanTenure.div(reserveConfiguration.loanInterval)
    : zeroBigInt;
  loan.apr = event.params._apr;
  loan.epoch = reserveConfiguration.loanInterval;
  loan.term = reserveConfiguration.loanTenure;
  loan.nper = nper;

  loan.principal = event.params._principal;
  loan.interest = event.params._interest;
  loan.protocolFee = event.params._protocolFee;
  loan.pmt_principal = !nper.isZero() ? event.params._principal.div(nper) : zeroBigInt;
  loan.pmt_interest = !nper.isZero() ? event.params._interest.div(nper) : zeroBigInt;
  loan.pmt_fee = !nper.isZero() ? event.params._protocolFee.div(nper) : zeroBigInt;
  loan.pmt_payment = loan.pmt_principal.plus(loan.pmt_interest).plus(loan.pmt_fee);

  loan.totalPrincipalPaid = loan.pmt_principal;
  loan.totalInterestPaid = loan.pmt_interest;
  loan.timestamp = event.block.timestamp;
  loan.nextPaymentDue = loan.timestamp.plus(loan.epoch.times(SECONDS_PER_DAY));
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
  repayment.save();

  const reserve = getOrInitReserveById(reserveId);
  const totalAdditionalPrincipal = event.params._principal.minus(loan.pmt_principal);
  const totalAdditionalInterest = event.params._interest.minus(loan.pmt_interest);
  reserve.totalPrincipal = reserve.totalPrincipal.plus(totalAdditionalPrincipal);
  reserve.totalInterest = reserve.totalInterest.plus(totalAdditionalInterest);
  reserve.totalBorrow = reserve.totalBorrow
    .plus(totalAdditionalPrincipal)
    .plus(totalAdditionalInterest);
  reserve.availableLiquidity = reserve.availableLiquidity
    .minus(totalAdditionalPrincipal)
    .plus(loan.pmt_interest);
  reserve.totalLiquidity = reserve.totalLiquidity
    .plus(event.params._interest)
    .plus(event.params._protocolFee);
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

  const buyNowTx = getOrInitBuyNowTransaction(
    event.params._vault,
    event.params._collection,
    event.params._tokenId,
    loan.id,
  );
  buyNowTx.txHash = event.transaction.hash;
  buyNowTx.marketplace = event.params._marketplace;
  buyNowTx.save();
}

export function handleRepay(event: RepaymentEvent): void {
  const reserveId = getReserveId(event.params._collection, event.address.toHexString());
  const loan = getOrInitLoan(event.params._vault, reserveId, event.params._loanId, event);
  loan.totalPrincipalPaid = loan.totalPrincipalPaid.plus(loan.pmt_principal);
  loan.totalInterestPaid = loan.totalInterestPaid.plus(loan.pmt_interest);
  loan.paidTimes = loan.paidTimes.plus(BigInt.fromI32(1));
  loan.nextPaymentDue = loan.timestamp.plus(
    loan.epoch.times(loan.paidTimes).times(SECONDS_PER_DAY),
  );
  if (event.params.isFinal) {
    loan.closed = true;
  }
  loan.save();

  const repayment = getOrInitRepayment(event.params._vault, loan.loanId, event.params._repaymentId);
  repayment.loan = loan.id;
  repayment.isFinal = event.params.isFinal;
  // it could be a liquidation, in which case the repayment could cover > 1 instalment.
  const numPaymentsCovered = repayment.isFinal
    ? loan.nper.minus(loan.paidTimes.minus(BigInt.fromI32(1)))
    : BigInt.fromI32(1);
  const principalExpected = loan.pmt_principal.times(numPaymentsCovered);
  const interestExpected = loan.pmt_interest.times(numPaymentsCovered);
  const feesExpected = loan.pmt_fee.times(numPaymentsCovered);
  const totalExpected = principalExpected.plus(interestExpected).plus(feesExpected);

  let amount = event.params._amount;
  let principalRepaid = zeroBI();
  let interestRepaid = zeroBI();
  let feesRepaid = zeroBI();

  // highest
  if (amount.ge(principalExpected)) {
    principalRepaid = principalExpected;
  } else {
    // liquidation case
    principalRepaid = amount;
  }
  amount = amount.minus(principalRepaid);

  // consider interest next
  if (amount.gt(zeroBI())) {
    interestRepaid = amount.ge(interestExpected) ? interestExpected : amount;
  }
  amount = amount.minus(interestRepaid);

  if (amount.gt(zeroBI())) {
    feesRepaid = amount.ge(feesExpected) ? feesExpected : amount;
  }
  amount = amount.minus(feesRepaid);

  const writeDown = totalExpected.gt(event.params._amount)
    ? totalExpected.minus(event.params._amount)
    : zeroBI();

  repayment.principal = principalRepaid;
  repayment.interest = interestRepaid;
  repayment.fee = feesRepaid;
  repayment.total = event.params._amount;
  repayment.paidAt = event.block.timestamp;
  repayment.txHash = event.transaction.hash;
  repayment.save();

  const reserve = getOrInitReserveById(reserveId);
  reserve.availableLiquidity = reserve.availableLiquidity.plus(event.params._amount);
  reserve.totalLiquidity = reserve.totalLiquidity.minus(writeDown);
  reserve.totalPrincipal = reserve.totalPrincipal.minus(repayment.principal);
  reserve.totalInterest = reserve.totalInterest.minus(repayment.interest);
  reserve.totalBorrow = reserve.totalBorrow.minus(repayment.total);
  reserve.utilizationRate = computeUtilizationRate(reserve);
  reserve.borrowRate = computeBorrowRateOnNewRepay(reserve, loan, repayment.principal);
  reserve.depositRate = computeDepositRate(reserve);
  reserve.save();

  if (event.params.isFinal && loan.collateral != null) {
    const collateral = Asset.load(loan.collateral!);
    if (!collateral) {
      throw new Error(`Unable to find asset for loan`);
    }
    // only release the lien; set liquidation status in handleLiquidate
    collateral.isUnderLien = false;
    collateral.save();
  }
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
