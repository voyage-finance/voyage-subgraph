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
import { updatePoolAndConfigurationData, updateUserData } from "./utils/pool";

export function handleDeposit(event: Deposit): void {
  updatePoolAndConfigurationData(event.params.asset, event.address);
  updateUserData(event.params.user, event.params.asset, event.address);
}

export function handleReserveActivated(event: ReserveActivated): void {
  const poolId = event.params._asset.toHex();
  let pool = Pool.load(poolId);
  if (pool) {
    pool = new Pool(poolId);
    pool.isActive = true;
    pool.save();
  }
}

export function handleReserveInitialized(event: ReserveInitialized): void {
  updatePoolAndConfigurationData(event.params._asset, event.address);
}

export function handleWithdraw(event: Withdraw): void {
  updatePoolAndConfigurationData(event.params.asset, event.address);
  updateUserData(event.params.user, event.params.asset, event.address);
}

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}

export function handleVaultCreated(event: VaultCreated): void {}

export function handleVaultInitialized(event: VaultInitialized): void {}

export function handleVaultMarginCredited(event: VaultMarginCredited): void {}

export function handleVaultMarginRedeemed(event: VaultMarginRedeemed): void {}
