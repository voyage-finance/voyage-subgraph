import { Address, log } from "@graphprotocol/graph-ts";
import { Pool, PoolConfiguration } from "../../generated/schema";
import { Deposit, Voyager } from "../../generated/Voyager/Voyager";

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
