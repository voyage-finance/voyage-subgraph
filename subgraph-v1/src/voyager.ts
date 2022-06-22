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
import { updatePoolData } from "./utils/pool";

export function handleDeposit(event: Deposit): void {
  let _pool = updatePoolData(event.params.asset, event.address);
}

export function handleReserveActivated(event: ReserveActivated): void {
  let _pool = updatePoolData(event.params._asset, event.address);
}

export function handleReserveInitialized(event: ReserveInitialized): void {
  const poolId = event.params._asset.toHex();
  let pool = Pool.load(poolId);
  if (!pool) {
    pool = new Pool(poolId);
    pool.isActive = true;
  }
}

export function handleWithdraw(event: Withdraw): void {}

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}

export function handleVaultCreated(event: VaultCreated): void {}

export function handleVaultInitialized(event: VaultInitialized): void {}

export function handleVaultMarginCredited(event: VaultMarginCredited): void {}

export function handleVaultMarginRedeemed(event: VaultMarginRedeemed): void {}
