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
