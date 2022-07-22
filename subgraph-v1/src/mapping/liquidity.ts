import { log } from "@graphprotocol/graph-ts";
import {
  Deposit as VoyageDeposit,
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
} from "../helpers/initializers";
import {
  updatePnL,
  updatePoolConfiguration,
  updatePoolData,
  updateUserDepositData,
} from "../helpers/updaters";
import { VToken } from "../../generated/templates";
import {
  Deposit as VTokenDeposit,
  Withdraw as VTokenWithdraw,
} from "../../generated/templates/VToken/VToken";

export function handleReserveInitialized(event: ReserveInitialized): void {
  getOrInitPool(event.params._asset);
  VToken.create(event.params._juniorDepositTokenAddress);
  VToken.create(event.params._seniorDepositTokenAddress);
}

export function handleReserveActivated(event: ReserveActivated): void {
  const poolConfiguration = getOrInitPoolConfiguration(event.params._asset);
  updatePoolConfiguration(poolConfiguration, event);
  poolConfiguration.save();
  const reserve = getOrInitPool(event.params._asset);
  reserve.isActive = true;
  reserve.configuration = poolConfiguration.id;
  reserve.save();
}

export function handleDeposit(event: VoyageDeposit): void {
  log.info("------ handleDeposit Voyage -------", []);
  log.info("Voyage Deposit asset {} amount {} tranche {} user {}", [
    event.params.asset.toHex(),
    event.params.amount.toString(),
    event.params.tranche.toString(),
    event.params.user.toHex(),
  ]);
  const pool = getOrInitPool(event.params.asset);
  updatePoolData(pool, event);
  pool.save();
  const poolConfiguration = getOrInitPoolConfiguration(event.params.asset);
  updatePoolConfiguration(poolConfiguration, event);
  poolConfiguration.save();
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

export function handleWithdraw(event: VoyageWithdraw): void {
  log.info("------ handleWithdraw Voyage -------", []);
  const pool = getOrInitPool(event.params.asset);
  updatePoolData(pool, event);
  pool.save();
  const poolConfiguration = getOrInitPoolConfiguration(event.params.asset);
  updatePoolConfiguration(poolConfiguration, event);
  poolConfiguration.save();
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
  log.info("------ handleDepositVToken VToken -------", []);
  log.info("VToken Deposit assets {} caller {} owner {} shares {}", [
    event.params.assets.toString(),
    event.params.caller.toHex(),
    event.params.owner.toHex(),
    event.params.shares.toString(),
  ]);
}

export function handleWithdrawVToken(event: VTokenWithdraw): void {
  log.info("------ handleWithdraw VToken -------", []);
}
