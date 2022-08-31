import { BigInt } from '@graphprotocol/graph-ts';
import { Reserve, ReserveConfiguration } from '../../generated/schema';
import {
  MAX_U64_BI,
  PERCENT,
  percentMul,
  rayMul,
  wadDiv,
  wadToPercent,
  wadToRay,
} from '../utils/math';

export function computeUtilizationRate(reserve: Reserve): BigInt {
  return wadDiv(reserve.totalBorrow, reserve.totalLiquidity);
}

export function computeLiquidityRatio(reserve: Reserve): BigInt {
  return reserve.juniorTrancheLiquidity.equals(BigInt.zero())
    ? BigInt.fromU64(U64.MAX_VALUE)
    : wadToPercent(wadDiv(reserve.seniorTrancheLiquidity, reserve.juniorTrancheLiquidity));
}

export function computeDepositRate(reserve: Reserve): BigInt {
  return rayMul(reserve.borrowRate, wadToRay(reserve.utilizationRate));
}

export function computeSeniorDepositRate(
  reserve: Reserve,
  reserveConfiguration: ReserveConfiguration,
): BigInt {
  return percentMul(reserve.depositRate, reserveConfiguration.incomeRatio);
}

export function computeJuniorDepositRate(
  reserve: Reserve,
  reserveConfiguration: ReserveConfiguration,
): BigInt {
  return reserve.liquidityRatio.equals(MAX_U64_BI)
    ? BigInt.fromU64(U64.MAX_VALUE)
    : percentMul(
        percentMul(reserve.depositRate, PERCENT.minus(reserveConfiguration.incomeRatio)),
        reserve.liquidityRatio,
      );
}
