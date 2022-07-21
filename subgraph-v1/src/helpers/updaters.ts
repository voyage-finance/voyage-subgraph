import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import {
  Loan,
  Pool,
  PoolConfiguration,
  UserDepositData,
  VToken,
} from "../../generated/schema";
import { Voyage } from "../../generated/Voyage/Voyage";

export function updatePoolConfiguration(
  poolConfiguration: PoolConfiguration,
  event: ethereum.Event
): void {
  const voyage = Voyage.bind(event.address);
  const assetAddress = Address.fromBytes(
    Address.fromHexString(poolConfiguration.pool)
  );
  const poolConfigState = voyage.getPoolConfiguration(assetAddress);
  poolConfiguration.liquidationBonus = poolConfigState.liquidationBonus;
  poolConfiguration.marginRequirement = poolConfigState.marginRequirement;
  poolConfiguration.marginMin = poolConfigState.minMargin;
  poolConfiguration.marginMax = poolConfigState.maxMargin;
  poolConfiguration.apr = poolConfigState.apr;
  poolConfiguration.loanInterval = poolConfigState.loanInterval;
  poolConfiguration.loanTenure = poolConfigState.loanTenure;
  poolConfiguration.incomeRatio = poolConfigState.incomeRatio;
  poolConfiguration.isInitialized = poolConfigState.isInitialized;
  poolConfiguration.isActive = poolConfigState.isActive;
}

export function updatePoolData(pool: Pool, event: ethereum.Event): void {
  const voyage = Voyage.bind(event.address);
  const poolState = voyage.getPoolData(Address.fromBytes(pool.underlyingAsset));

  pool.isActive = poolState.isActive;
  pool.juniorTrancheTotalLiquidity = poolState.juniorLiquidity;
  pool.juniorTrancheLiquidityRate = poolState.juniorLiquidityRate;
  pool.seniorTrancheTotalLiquidity = poolState.seniorLiquidity;
  pool.seniorTrancheAvailableLiquidity = poolState.seniorLiquidity.minus(
    poolState.totalDebt
  );
  pool.seniorTrancheLiquidityRate = poolState.seniorLiquidityRate;
  pool.totalLiquidity = poolState.totalLiquidity;
  pool.totalBorrow = poolState.totalDebt;
  pool.trancheRatio = poolState.trancheRatio;
}

export function increaseTrancheLiquidity(
  pool: Pool,
  trancheType: string,
  amount: BigInt
): void {
  if (trancheType === "Junior")
    pool.juniorTrancheTotalLiquidity = pool.juniorTrancheTotalLiquidity.plus(
      amount
    );
  else
    pool.seniorTrancheTotalLiquidity = pool.seniorTrancheTotalLiquidity.plus(
      amount
    );
}

export function decreaseTrancheLiquidity(
  pool: Pool,
  trancheType: string,
  amount: BigInt
): void {
  if (trancheType === "Junior")
    pool.juniorTrancheTotalLiquidity = pool.juniorTrancheTotalLiquidity.minus(
      amount
    );
  else
    pool.seniorTrancheTotalLiquidity = pool.seniorTrancheTotalLiquidity.minus(
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
  const voyage = Voyage.bind(event.address);
  const userAddress = Address.fromHexString(userDepositData.user);
  const assetAddress = userDepositData.underlyingAsset;
  const userPoolData = voyage.getUserPoolData(
    Address.fromBytes(assetAddress),
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
  assetAddress: Address,
  id: BigInt,
  event: ethereum.Event
): void {
  const voyage = Voyage.bind(event.address);
  const loanData = voyage.getLoanDetail(vaultAddress, assetAddress, id);
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
