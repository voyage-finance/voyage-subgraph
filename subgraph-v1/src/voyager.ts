import { log } from "@graphprotocol/graph-ts";
import { Pool } from "../generated/schema";
import {
  Deposit,
  Paused,
  ReserveActivated,
  ReserveInitialized,
  Unpaused,
  VaultCreated,
  VaultInitialized,
  VaultMarginCredited,
  VaultMarginRedeemed,
  Voyager,
  Withdraw,
} from "../generated/Voyager/Voyager";
import { updatePoolAndConfigurationData } from "./utils/pool";

export function handleDeposit(event: Deposit): void {
  log.info("--------- triggered handleDeposit ------------", []);
  updatePoolAndConfigurationData(event.params.asset, event.address);
}

export function handleReserveActivated(event: ReserveActivated): void {
  log.info("--------- triggered handleReserveActivated ------------", []);
  const poolId = event.params._asset.toHex();
  let pool = Pool.load(poolId);
  if (pool) {
    pool = new Pool(poolId);
    pool.isActive = true;
    pool.save();
  }
}

export function handleReserveInitialized(event: ReserveInitialized): void {
  log.info("--------- triggered handleReserveInitialized ------------", []);
  updatePoolAndConfigurationData(event.params._asset, event.address);
}

export function handleWithdraw(event: Withdraw): void {
  log.info("--------- triggered handleWithdraw ------------", []);
  updatePoolAndConfigurationData(event.params.asset, event.address);
}

export function handlePaused(event: Paused): void {
  log.info("--------- triggered handlePaused ------------", []);
}

export function handleUnpaused(event: Unpaused): void {
  log.info("--------- triggered handleUnpaused ------------", []);
}

export function handleVaultCreated(event: VaultCreated): void {
  log.info("--------- triggered handleVaultCreated ------------", []);
}

export function handleVaultInitialized(event: VaultInitialized): void {
  log.info("--------- triggered handleVaultInitialized ------------", []);
}

export function handleVaultMarginCredited(event: VaultMarginCredited): void {
  log.info("--------- triggered handleVaultMarginCredited ------------", []);
}

export function handleVaultMarginRedeemed(event: VaultMarginRedeemed): void {
  log.info("--------- triggered handleVaultMarginRedeemed ------------", []);
}
