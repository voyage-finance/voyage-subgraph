import { Address } from "@graphprotocol/graph-ts";
import { Pool } from "../../generated/schema";
import { Deposit, Voyager } from "../../generated/Voyager/Voyager";

export function updatePoolData(
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
  pool.save();
  return pool;
}

// TODO: fix on voyager side
// if (!pool.configuration) {
//   const poolConfigState = voyager.getPoolConfiguration(underlyingAddress);
//   // use the address for config too
//   const poolConfigurationEntity = new PoolConfiguration(
//     underlyingAddress.toHex()
//   );
//   poolConfigurationEntity.pool = poolId;
//   poolConfigurationEntity.marginRequirement =
//     poolConfigState.marginRequirement;
//   poolConfigurationEntity.marginMin = poolConfigurationEntity.marginMin;
//   poolConfigurationEntity.marginMax = poolConfigurationEntity.marginMax;
//   poolConfigurationEntity.loanTenure = poolConfigState.loanTenure;
//   poolConfigurationEntity.optimalIncomeRatio =
//     poolConfigState.optimalIncomeRatio;
//   poolConfigurationEntity.optimalTrancheRatio =
//     poolConfigState.optimalTrancheRatio;
//   poolConfigurationEntity.save();
// }
