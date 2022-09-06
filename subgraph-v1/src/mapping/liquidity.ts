import { Address } from '@graphprotocol/graph-ts';
import { Claim } from '../../generated/templates/SeniorDepositToken/SeniorDepositToken';
import { Deposit, Withdraw } from '../../generated/templates/VToken/VToken';
import { JUNIOR_TRANCHE, trancheFromString } from '../helpers/consts';
import {
  getOrInitReserveById,
  getOrInitReserveConfiguration,
  getOrInitUserDepositData,
  getOrInitUserUnbondingData,
  getOrInitVToken,
} from '../helpers/initializers';
import {
  computeDepositRate,
  computeJuniorDepositRate,
  computeLiquidityRatio,
  computeSeniorDepositRate,
  computeUtilizationRate,
} from '../helpers/reserve-logic';
import { decreaseTrancheLiquidity, increaseTrancheLiquidity } from '../helpers/updaters';

export function handleDeposit(event: Deposit): void {
  const vToken = getOrInitVToken(event.address);
  vToken.totalAssets = vToken.totalAssets.plus(event.params.assets);
  vToken.totalShares = vToken.totalShares.plus(event.params.shares);
  vToken.save();

  const reserve = getOrInitReserveById(vToken.reserve);
  const reserveConfiguration = getOrInitReserveConfiguration(reserve.id);
  reserve.availableLiquidity = reserve.availableLiquidity.plus(event.params.assets);
  reserve.totalLiquidity = reserve.totalLiquidity.plus(event.params.assets);
  increaseTrancheLiquidity(reserve, trancheFromString(vToken.tranche), event.params.assets);
  reserve.liquidityRatio = computeLiquidityRatio(reserve);
  reserve.utilizationRate = computeUtilizationRate(reserve);
  reserve.depositRate = computeDepositRate(reserve);
  reserve.seniorTrancheDepositRate = computeSeniorDepositRate(reserve, reserveConfiguration);
  reserve.juniorTrancheDepositRate = computeJuniorDepositRate(reserve, reserveConfiguration);
  reserve.save();

  const userDepositData = getOrInitUserDepositData(
    event.params.owner,
    Address.fromBytes(reserve.collection),
  );
  if (vToken.tranche == JUNIOR_TRANCHE) {
    userDepositData.juniorTrancheCumulativeDeposits =
      userDepositData.juniorTrancheCumulativeDeposits.plus(event.params.assets);
    userDepositData.juniorTrancheShares = userDepositData.juniorTrancheShares.plus(
      event.params.shares,
    );
  } else {
    userDepositData.seniorTrancheCumulativeDeposits =
      userDepositData.seniorTrancheCumulativeDeposits.plus(event.params.assets);
    userDepositData.seniorTrancheShares = userDepositData.seniorTrancheShares.plus(
      event.params.shares,
    );
  }
  userDepositData.save();
}

export function handleWithdraw(event: Withdraw): void {
  const vToken = getOrInitVToken(event.address);
  vToken.totalAssets = vToken.totalAssets.minus(event.params.assets);
  vToken.totalShares = vToken.totalShares.minus(event.params.shares);
  vToken.save();

  const reserve = getOrInitReserveById(vToken.reserve);
  const reserveConfiguration = getOrInitReserveConfiguration(reserve.id);
  reserve.availableLiquidity = reserve.availableLiquidity.minus(event.params.assets);
  reserve.totalLiquidity = reserve.totalLiquidity.minus(event.params.assets);
  decreaseTrancheLiquidity(reserve, trancheFromString(vToken.tranche), event.params.assets);
  reserve.liquidityRatio = computeLiquidityRatio(reserve);
  reserve.utilizationRate = computeUtilizationRate(reserve);
  reserve.depositRate = computeDepositRate(reserve);
  reserve.seniorTrancheDepositRate = computeSeniorDepositRate(reserve, reserveConfiguration);
  reserve.juniorTrancheDepositRate = computeJuniorDepositRate(reserve, reserveConfiguration);
  reserve.save();

  if (vToken.tranche == JUNIOR_TRANCHE) {
    // Junior Tranche withdrawals happen immediately.
    const userDepositData = getOrInitUserDepositData(
      event.params.owner,
      Address.fromBytes(reserve.collection),
    );
    userDepositData.juniorTrancheCumulativeWithdrawals =
      userDepositData.juniorTrancheCumulativeWithdrawals.plus(event.params.assets);
    userDepositData.juniorTrancheShares = userDepositData.juniorTrancheShares.minus(
      event.params.shares,
    );
    userDepositData.save();
  } else {
    // Senior Tranche withdrawals enter unbonding.
    const userUnbondingData = getOrInitUserUnbondingData(
      event.params.owner,
      Address.fromBytes(reserve.collection),
      event,
    );
    userUnbondingData.maxUnderlying = userUnbondingData.maxUnderlying.plus(event.params.assets);
    userUnbondingData.shares = userUnbondingData.shares.plus(event.params.shares);
    userUnbondingData.save();
  }
}

export function handleClaim(event: Claim): void {
  const vToken = getOrInitVToken(event.address);
  vToken.totalAssets = vToken.totalAssets.minus(event.params.assets);
  vToken.totalShares = vToken.totalAssets.minus(event.params.shares);
  vToken.save();
  const reserve = getOrInitReserveById(vToken.reserve);
  const userDepositData = getOrInitUserDepositData(
    event.params.owner,
    Address.fromBytes(reserve.collection),
  );
  userDepositData.seniorTrancheShares = userDepositData.seniorTrancheShares.minus(
    event.params.shares,
  );
  userDepositData.seniorTrancheCumulativeWithdrawals =
    userDepositData.seniorTrancheCumulativeWithdrawals.plus(event.params.assets);
  userDepositData.save();
  const unbonding = getOrInitUserUnbondingData(
    event.params.owner,
    Address.fromBytes(reserve.collection),
    event,
  );
  unbonding.maxUnderlying = unbonding.maxUnderlying.minus(event.params.assets);
  unbonding.shares = unbonding.shares.minus(event.params.shares);
  unbonding.save();
}
