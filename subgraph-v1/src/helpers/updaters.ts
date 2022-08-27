import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import {
  Loan,
  Reserve,
  ReserveConfiguration,
  UserDepositData,
  VToken,
} from "../../generated/schema";
import { Voyage } from "../../generated/Voyage/Voyage";

export function updatePoolConfiguration(
  reserveConfiguration: ReserveConfiguration,
  event: ethereum.Event
): void {
  const voyage = Voyage.bind(event.address);
  const collection = Address.fromBytes(
    Address.fromHexString(reserveConfiguration.reserve)
  );
  const poolConfigState = voyage.getPoolConfiguration(collection);
  reserveConfiguration.liquidationBonus = poolConfigState.liquidationBonus;
  reserveConfiguration.loanInterval = poolConfigState.loanInterval;
  reserveConfiguration.loanTenure = poolConfigState.loanTenure;
  reserveConfiguration.incomeRatio = poolConfigState.incomeRatio;
  reserveConfiguration.isInitialized = poolConfigState.isInitialized;
  reserveConfiguration.isActive = poolConfigState.isActive;
}

export function updatePoolData(reserve: Reserve, event: ethereum.Event): void {
  const voyage = Voyage.bind(event.address);
  const poolState = voyage.getPoolData(Address.fromBytes(reserve.collection));

  reserve.isActive = poolState.isActive;
  reserve.juniorTrancheTotalLiquidity = poolState.juniorLiquidity;
  reserve.juniorTrancheLiquidityRate = poolState.juniorLiquidityRate;
  reserve.seniorTrancheTotalLiquidity = poolState.seniorLiquidity;
  reserve.seniorTrancheAvailableLiquidity = poolState.seniorLiquidity.minus(
    poolState.totalDebt
  );
  reserve.seniorTrancheLiquidityRate = poolState.seniorLiquidityRate;
  reserve.totalLiquidity = poolState.totalLiquidity;
  reserve.totalBorrow = poolState.totalDebt;
  reserve.trancheRatio = poolState.trancheRatio;
}

export function increaseTrancheLiquidity(
  reserve: Reserve,
  trancheType: string,
  amount: BigInt
): void {
  if (trancheType === "Junior")
    reserve.juniorTrancheTotalLiquidity = reserve.juniorTrancheTotalLiquidity.plus(
      amount
    );
  else
    reserve.seniorTrancheTotalLiquidity = reserve.seniorTrancheTotalLiquidity.plus(
      amount
    );
}

export function decreaseTrancheLiquidity(
  reserve: Reserve,
  trancheType: string,
  amount: BigInt
): void {
  if (trancheType === "Junior")
    reserve.juniorTrancheTotalLiquidity = reserve.juniorTrancheTotalLiquidity.minus(
      amount
    );
  else
    reserve.seniorTrancheTotalLiquidity = reserve.seniorTrancheTotalLiquidity.minus(
      amount
    );
}

export function increaseVTokenLiquidity(vtoken: VToken, amount: BigInt): void {
  vtoken.totalLiquidity = vtoken.totalLiquidity.plus(amount);
}

export function decreaseVTokenLiquidity(vtoken: VToken, amount: BigInt): void {
  vtoken.totalLiquidity = vtoken.totalLiquidity.minus(amount);
}

export function updateUserDepositData(
  userDepositData: UserDepositData,
  event: ethereum.Event
): void {
  log.info("Here ----------------", [])
  const voyage = Voyage.bind(event.address);
  const userAddress = Address.fromHexString(userDepositData.user);
  const collection = userDepositData.collection;
  const userPoolData = voyage.getUserPoolData(
    Address.fromBytes(collection),
    Address.fromBytes(userAddress)
  );
  userDepositData.juniorTrancheBalance = userPoolData.juniorTrancheBalance;
  userDepositData.seniorTrancheBalance = userPoolData.seniorTrancheBalance;
  userDepositData.withdrawableJuniorBalance =
    userPoolData.withdrawableJuniorTrancheBalance;
  userDepositData.withdrawableSeniorBalance =
    userPoolData.withdrawableSeniorTrancheBalance;
}

// sum(withdrawalsFromJunior) + juniorTrancheBalance - sum(depositsInJunior)
export function updatePnL(
  userDepositData: UserDepositData,
  amount: BigInt,
  tranche: number
): void {
  log.info("[updateTranchePnl]", []);
  if (tranche === 1) {
    userDepositData.seniorDepositWithdrawalDiff = userDepositData.seniorDepositWithdrawalDiff.plus(
      amount
    );
    userDepositData.seniorTranchePnl = userDepositData.seniorTrancheBalance.plus(
      userDepositData.seniorDepositWithdrawalDiff
    );
  } else {
    userDepositData.juniorDepositWithdrawalDiff = userDepositData.juniorDepositWithdrawalDiff.plus(
      amount
    );
    userDepositData.juniorTranchePnl = userDepositData.juniorTrancheBalance.plus(
      userDepositData.juniorDepositWithdrawalDiff
    );
  }
}

export function updateLoanEntity(
  loan: Loan,
  vaultAddress: Address,
  collection: Address,
  id: BigInt,
  event: ethereum.Event
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
  loan.borrowAt = loanData.borrowAt;
  loan.nextPaymentDue = loanData.nextPaymentDue;
  loan.totalInterestPaid = loanData.totalInterestPaid;
  loan.paidTimes = loanData.paidTimes;
}
