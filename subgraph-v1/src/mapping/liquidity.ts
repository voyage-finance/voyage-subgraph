import { Address } from '@graphprotocol/graph-ts';
import { Claim, Deposit, Withdraw } from '../../generated/templates/VToken/VToken';
import { JUNIOR_TRANCHE, SENIOR_TRANCHE, trancheFromString } from '../helpers/consts';
import {
  getOrInitReserve,
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

  const reserve = getOrInitReserve(Address.fromString(vToken.reserve));
  const reserveConfiguration = getOrInitReserveConfiguration(Address.fromHexString(reserve.id));
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
    userDepositData.juniorTrancheBalance = userDepositData.juniorTrancheBalance.plus(
      event.params.assets,
    );
  } else {
    userDepositData.seniorTrancheBalance = userDepositData.juniorTrancheBalance.plus(
      event.params.assets,
    );
  }
  // updatePnL(userDepositData, event.params.amount, event.params._tranche);
  userDepositData.save();
}

export function handleWithdraw(event: Withdraw): void {
  const vToken = getOrInitVToken(event.address);
  vToken.totalAssets = vToken.totalAssets.minus(event.params.assets);
  vToken.totalShares = vToken.totalShares.minus(event.params.shares);
  vToken.save();

  const reserve = getOrInitReserve(Address.fromString(vToken.reserve));
  const reserveConfiguration = getOrInitReserveConfiguration(Address.fromHexString(reserve.id));
  reserve.totalLiquidity = reserve.totalLiquidity.minus(event.params.assets);
  decreaseTrancheLiquidity(reserve, trancheFromString(vToken.tranche), event.params.assets);
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
    userDepositData.juniorTrancheBalance = userDepositData.juniorTrancheBalance.minus(
      event.params.assets,
    );
  } else {
    userDepositData.seniorTrancheBalance = userDepositData.seniorTrancheBalance.minus(
      event.params.assets,
    );
  }

  // updatePnL(userDepositData, event.params.amount, event.params._tranche);
  userDepositData.save();

  // unbonding only applies to senior tranche withdrawals
  if (vToken.tranche == SENIOR_TRANCHE) {
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
  const reserve = getOrInitReserve(Address.fromString(vToken.reserve));
  const unbonding = getOrInitUserUnbondingData(
    event.params.receiver,
    Address.fromBytes(reserve.collection),
    event,
  );
  unbonding.shares = unbonding.shares.minus(event.params.shares);
  unbonding.maxUnderlying = unbonding.maxUnderlying.minus(event.params.amount);
  unbonding.save();
}
