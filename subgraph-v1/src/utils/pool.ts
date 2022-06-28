import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import {
  Pool,
  PoolConfiguration,
  Unbonding,
  UserData,
  UserDepositData,
} from "../../generated/schema";
import { Deposit, Voyager } from "../../generated/Voyager/Voyager";

const Zero = new BigInt(0);

export function updatePoolAndConfigurationData(
  assetAddress: Address,
  eventAddress: Address
): Pool {
  const poolId = assetAddress.toHex();
  let pool = Pool.load(poolId);
  if (!pool) {
    pool = new Pool(poolId);
  }
  const voyager = Voyager.bind(eventAddress);
  const poolState = voyager.getPoolData(assetAddress);

  pool.isActive = poolState.isActive;
  pool.underlyingAsset = assetAddress;
  pool.symbol = poolState.symbol;
  pool.decimals = poolState.decimals;
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

  let poolConfiguration = updatePoolConfiguration(assetAddress, eventAddress);
  pool.configuration = poolConfiguration.id;
  pool.save();
  return pool;
}

export function updatePoolConfiguration(
  assetAddress: Address,
  eventAddress: Address
): PoolConfiguration {
  const voyager = Voyager.bind(eventAddress);

  const poolConfigState = voyager.getPoolConfiguration(assetAddress);
  const poolConfigurationEntity = new PoolConfiguration(assetAddress.toHex());

  poolConfigurationEntity.pool = assetAddress.toHex();
  poolConfigurationEntity.marginRequirement = poolConfigState.marginRequirement;
  poolConfigurationEntity.marginMin = poolConfigState.minMargin;
  poolConfigurationEntity.marginMax = poolConfigState.maxMargin;
  poolConfigurationEntity.loanTenure = poolConfigState.loanTenure;
  poolConfigurationEntity.optimalIncomeRatio =
    poolConfigState.optimalIncomeRatio;
  poolConfigurationEntity.optimalTrancheRatio =
    poolConfigState.optimalTrancheRatio;

  poolConfigurationEntity.save();
  return poolConfigurationEntity;
}

export function updateUserData(
  userAddress: Address,
  assetAddress: Address,
  eventAddress: Address
): UserData {
  const voyager = Voyager.bind(eventAddress);
  let userEntity = UserData.load(userAddress.toHex());
  if (!userEntity) {
    userEntity = new UserData(userAddress.toHex());
  }
  // save depositData
  const userPoolData = voyager.getUserPoolData(assetAddress, userAddress);
  let userPoolId = [userAddress.toHex(), assetAddress.toHex()].join("_");
  let userDepositDataEntity = UserDepositData.load(userPoolId);
  if (!userDepositDataEntity) {
    userDepositDataEntity = new UserDepositData(userPoolId);
  }
  userDepositDataEntity.underlyingAsset = assetAddress;
  userDepositDataEntity.juniorTrancheBalance = userDepositDataEntity.juniorTranchePnl =
    userPoolData.juniorTrancheBalance;
  userDepositDataEntity.seniorTrancheBalance = userDepositDataEntity.seniorTranchePnl =
    userPoolData.seniorTrancheBalance;
  userDepositDataEntity.withdrawableJuniorBalance =
    userPoolData.withdrawableJuniorTrancheBalance;
  userDepositDataEntity.withdrawableSeniorBalance =
    userPoolData.withdrawableSeniorTrancheBalance;
  userDepositDataEntity.decimals = userPoolData.decimals;
  userDepositDataEntity.user = userAddress.toHex();

  //update unbondings
  const jrPendings = voyager.pendingJuniorWithdrawals(
    userAddress,
    assetAddress
  );
  const srPendings = voyager.pendingSeniorWithdrawals(
    userAddress,
    assetAddress
  );
  const allTimes = jrPendings.value0.concat(srPendings.value0);
  const allAmounts = jrPendings.value1.concat(srPendings.value1);

  var unbonding: Unbonding;
  for (let i = 0; i < allTimes.length; ++i) {
    const uniqueId = [
      userAddress.toHex(),
      assetAddress.toHex(),
      allTimes[i].toString(),
    ].join("_");
    const _unbonding = Unbonding.load(uniqueId);
    unbonding = _unbonding ? _unbonding : new Unbonding(uniqueId);
    unbonding.time = allTimes[i];
    unbonding.amount = allAmounts[i];
    unbonding.type = i >= jrPendings.value0.length ? "Senior" : "Junior";
    unbonding.user = userAddress.toHex();
    unbonding.save();
  }

  userDepositDataEntity.save();
  userEntity.save();

  return userEntity;
}
// sum(withdrawalsFromJunior) + juniorTrancheBalance - sum(depositsInJunior)
export function updateTranchePnl(
  userAddress: Address,
  assetAddress: Address,
  amount: BigInt,
  tranche: number
): void {
  log.info("[updateTranchePnl]", []);
  let userPoolId = [userAddress.toHex(), assetAddress.toHex()].join("_");
  const userDepositData = UserDepositData.load(userPoolId);

  if (userDepositData) {
    log.info("[updateTranchePnl] userDepositData {} {} {}", [
      tranche.toString(),
      amount.toString(),
      userDepositData.seniorTranchePnl.toString(),
    ]);
    if (tranche === 1) {
      userDepositData.seniorTranchePnl = userDepositData.seniorTranchePnl.plus(
        amount
      );
    } else {
      userDepositData.juniorTranchePnl = userDepositData.juniorTranchePnl.plus(
        amount
      );
    }
    userDepositData.save();
  }
}
