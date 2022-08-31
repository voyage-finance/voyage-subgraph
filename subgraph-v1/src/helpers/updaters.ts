import { Address, BigInt, ethereum, log } from '@graphprotocol/graph-ts';
import { Loan, Reserve, UserDepositData } from '../../generated/schema';
import { Voyage } from '../../generated/Voyage/Voyage';
import { Tranche } from './consts';

export function increaseTrancheLiquidity(reserve: Reserve, tranche: Tranche, amount: BigInt): void {
  switch (tranche) {
    case Tranche.Junior:
      reserve.juniorTrancheLiquidity = reserve.juniorTrancheLiquidity.plus(amount);
      break;
    case Tranche.Senior:
      reserve.seniorTrancheLiquidity = reserve.seniorTrancheLiquidity.plus(amount);
      break;
    default:
      throw new Error(`Unable to update liquidity for unknown tranche: ${tranche}`);
  }
}

export function decreaseTrancheLiquidity(reserve: Reserve, tranche: Tranche, amount: BigInt): void {
  switch (tranche) {
    case Tranche.Junior:
      reserve.juniorTrancheLiquidity = reserve.juniorTrancheLiquidity.minus(amount);
      break;
    case Tranche.Senior:
      reserve.seniorTrancheLiquidity = reserve.seniorTrancheLiquidity.minus(amount);
      break;
    default:
      throw new Error(`Unable to update liquidity for unknown tranche: ${tranche}`);
  }
}

export function updateUserDepositData(
  userDepositData: UserDepositData,
  event: ethereum.Event,
): void {
  const voyage = Voyage.bind(event.address);
  const userAddress = Address.fromHexString(userDepositData.user);
  const collection = userDepositData.collection;
  const userPoolData = voyage.getUserPoolData(
    Address.fromBytes(collection),
    Address.fromBytes(userAddress),
  );
  userDepositData.juniorTrancheBalance = userPoolData.juniorTrancheBalance;
  userDepositData.seniorTrancheBalance = userPoolData.seniorTrancheBalance;
  userDepositData.withdrawableJuniorBalance = userPoolData.withdrawableJuniorTrancheBalance;
  userDepositData.withdrawableSeniorBalance = userPoolData.withdrawableSeniorTrancheBalance;
}

// sum(withdrawalsFromJunior) + juniorTrancheBalance - sum(depositsInJunior)
export function updatePnL(userDepositData: UserDepositData, amount: BigInt, tranche: number): void {
  log.info('[updateTranchePnl]', []);
  if (tranche === 1) {
    userDepositData.seniorDepositWithdrawalDiff =
      userDepositData.seniorDepositWithdrawalDiff.plus(amount);
    userDepositData.seniorTranchePnl = userDepositData.seniorTrancheBalance.plus(
      userDepositData.seniorDepositWithdrawalDiff,
    );
  } else {
    userDepositData.juniorDepositWithdrawalDiff =
      userDepositData.juniorDepositWithdrawalDiff.plus(amount);
    userDepositData.juniorTranchePnl = userDepositData.juniorTrancheBalance.plus(
      userDepositData.juniorDepositWithdrawalDiff,
    );
  }
}

export function updateLoanEntity(
  loan: Loan,
  vaultAddress: Address,
  collection: Address,
  id: BigInt,
  event: ethereum.Event,
): void {
  const voyage = Voyage.bind(event.address);
  const loanData = voyage.getLoanDetail(vaultAddress, collection, id);
  loan.vault = vaultAddress.toHex();
  loan.principal = loanData.principal;
  loan.pmt_principal = loanData.pmt.principal;
  loan.pmt_interest = loanData.pmt.interest;
  loan.pmt_payment = loanData.pmt.pmt;
  loan.term = loanData.term;
  loan.epoch = loanData.epoch;
  loan.nper = loanData.nper;
  loan.apr = loanData.apr;
  // loan.borrowAt = loanData.borrowAt;
  loan.nextPaymentDue = loanData.nextPaymentDue;
  loan.totalInterestPaid = loanData.totalInterestPaid;
  loan.paidTimes = loanData.paidTimes;
}
