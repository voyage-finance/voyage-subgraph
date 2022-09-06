import { BigInt } from '@graphprotocol/graph-ts';
import { Loan, Reserve, ReserveConfiguration } from '../../generated/schema';
import {
  MAX_U64_BI,
  PERCENT,
  percentMul,
  rayDiv,
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

export function getJuniorInterest(loan: Loan, incomeRatio: BigInt): BigInt {
  return loan.interest.minus(getSeniorInterest(loan, incomeRatio));
}

export function getSeniorInterest(loan: Loan, incomeRatio: BigInt): BigInt {
  return percentMul(loan.interest, incomeRatio);
}

export function computeBorrowRateOnNewBorrow(reserve: Reserve, loan: Loan): BigInt {
  const numer = rayMul(reserve.totalPrincipal, reserve.borrowRate).plus(
    rayMul(loan.principal, loan.apr),
  );
  const denom = reserve.totalPrincipal.plus(loan.principal);
  return rayDiv(numer, denom);
}

export function computeBorrowRateOnNewRepay(
  reserve: Reserve,
  loan: Loan,
  repayment: BigInt,
): BigInt {
  const numer = rayMul(reserve.totalPrincipal, reserve.borrowRate).minus(
    rayMul(repayment, loan.apr),
  );
  const denom = reserve.totalPrincipal.minus(repayment);
  return rayDiv(numer, denom);
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
