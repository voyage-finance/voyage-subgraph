import { Address, log } from "@graphprotocol/graph-ts";
import {
  Deposit as VoyageDeposit,
  IncomeRatioUpdated,
  LiquidationConfigurationUpdated,
  LoanParametersUpdated,
  MarginParametersUpdated,
  ReserveActivated,
  ReserveInitialized,
  Withdraw as VoyageWithdraw,
} from "../../generated/Voyage/Voyage";
import { Tranche } from "../helpers/consts";
import {
  getOrInitPool,
  getOrInitPoolConfiguration,
  getOrInitUnbonding,
  getOrInitUserData,
  getOrInitUserDepositData,
  initVToken,
} from "../helpers/initializers";
import {
  decreaseTrancheLiquidity,
  decreaseVTokenLiquidity,
  increaseTrancheLiquidity,
  increaseVTokenLiquidity,
  updatePnL,
  updatePoolData,
  updateUserDepositData,
} from "../helpers/updaters";
import { VToken as VTokenSource } from "../../generated/templates";
import {
  Deposit as VTokenDeposit,
  Withdraw as VTokenWithdraw,
} from "../../generated/templates/VToken/VToken";
import { VToken } from "../../generated/schema";

export function handleReserveInitialized(event: ReserveInitialized): void {
  getOrInitPool(event.params._asset);
  VTokenSource.create(event.params._juniorDepositTokenAddress);
  initVToken(
    event.params._juniorDepositTokenAddress,
    event.params._asset,
    "Junior"
  );

  VTokenSource.create(event.params._seniorDepositTokenAddress);
  initVToken(
    event.params._seniorDepositTokenAddress,
    event.params._asset,
    "Senior"
  );
}

export function handleReserveActivated(event: ReserveActivated): void {
  const reserve = getOrInitPool(event.params._asset);
  const poolConfiguration = getOrInitPoolConfiguration(event.params._asset);
  reserve.isActive = true;
  reserve.configuration = poolConfiguration.id;
  reserve.save();
}

// not used, currenly VToken's deposit events is being index
export function handleDeposit(event: VoyageDeposit): void {
  const pool = getOrInitPool(event.params.asset);
  updatePoolData(pool, event);
  pool.save();
  // could be first time user, create one if it doesn't exist.
  const userData = getOrInitUserData(event.params.user);
  userData.save();
  const userDepositData = getOrInitUserDepositData(
    event.params.user,
    event.params.asset,
    event
  );
  updateUserDepositData(userDepositData, event);
  updatePnL(userDepositData, event.params.amount, event.params.tranche);
  userDepositData.save();
}

// not used, currenly VToken's withdraw events is being index
export function handleWithdraw(event: VoyageWithdraw): void {
  const pool = getOrInitPool(event.params.asset);
  updatePoolData(pool, event);
  pool.save();
  const userDepositData = getOrInitUserDepositData(
    event.params.user,
    event.params.asset,
    event
  );
  updateUserDepositData(userDepositData, event);
  updatePnL(userDepositData, event.params.amount, event.params.tranche);
  const unbonding = getOrInitUnbonding(
    event.params.user,
    event.params.asset,
    event.block.timestamp
  );
  unbonding.amount = event.params.amount;
  unbonding.type =
    event.params.tranche === Tranche.Junior ? "Junior" : "Senior";
  unbonding.save();

  userDepositData.save();
}

export function handleDepositVToken(event: VTokenDeposit): void {
  const vTokenEntity = VToken.load(event.address.toHex());
  if (!vTokenEntity) {
    log.error(
      "tried to handle deposit event for a non-existent VToken. address: {}",
      [event.address.toHex()]
    );
    return;
  }
  let pool = getOrInitPool(Address.fromString(vTokenEntity.asset));
  increaseTrancheLiquidity(pool, vTokenEntity.trancheType, event.params.assets);
  increaseVTokenLiquidity(vTokenEntity, event.params.assets);
  pool.save();
  vTokenEntity.save();
}

export function handleWithdrawVToken(event: VTokenWithdraw): void {
  const vTokenEntity = VToken.load(event.address.toHex());
  if (!vTokenEntity) {
    log.error(
      "tried to handle withdraw event for a non-existent VToken. address: {}",
      [event.address.toHex()]
    );
    return;
  }
  let pool = getOrInitPool(Address.fromString(vTokenEntity.asset));
  decreaseTrancheLiquidity(pool, vTokenEntity.trancheType, event.params.assets);
  decreaseVTokenLiquidity(vTokenEntity, event.params.assets);
  pool.save();
  vTokenEntity.save();
}

export function handleLiquidationConfigurationUpdated(
  event: LiquidationConfigurationUpdated
): void {
  const pool = getOrInitPoolConfiguration(event.params._asset);
  pool.liquidationBonus = event.params._liquidationBonus;
  pool.save();
}

export function handleIncomeRatioUpdated(event: IncomeRatioUpdated): void {
  const pool = getOrInitPoolConfiguration(event.params._asset);
  pool.incomeRatio = event.params._incomeRatio;
  pool.save();
}

export function handleMarginParametersUpdated(
  event: MarginParametersUpdated
): void {
  const pool = getOrInitPoolConfiguration(event.params._asset);
  pool.marginMin = event.params._min;
  pool.marginMax = event.params._max;
  pool.marginRequirement = event.params._marginRequirement;
  pool.save();
}

export function handleLoanParametersUpdated(
  event: LoanParametersUpdated
): void {
  log.info("------- handleLoanParametersUpdated --------- {} {}", [
    event.params._epoch.toString(),
    event.params._term.toString(),
    event.params._gracePeriod.toString(),
  ]);
  const pool = getOrInitPoolConfiguration(event.params._asset);
  // TODO: clarify these params
  pool.loanInterval = event.params._epoch;
  pool.loanTenure = event.params._term;
  pool.save();
}
