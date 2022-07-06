import { BigInt, log } from "@graphprotocol/graph-ts";
import { Drawdown, Pool, Vault } from "../generated/schema";
import {
  Borrow,
  Deposit,
  Paused,
  Repay,
  ReserveActivated,
  ReserveInitialized,
  Unpaused,
  VaultAssetInitialized,
  VaultCreated,
  VaultMarginCredited,
  VaultMarginRedeemed,
  Withdraw,
} from "../generated/Voyage/Voyage";
import {
  updatePoolAndConfigurationData,
  updateTranchePnl,
  updateUserData,
} from "./utils/pool";
import { createVault, updateVaultData } from "./utils/vault";

export function handleDeposit(event: Deposit): void {
  updatePoolAndConfigurationData(event.params.asset, event.address);
  updateUserData(event.params.user, event.params.asset, event.address);
  updateTranchePnl(
    event.params.user,
    event.params.asset,
    event.params.amount,
    event.params.tranche
  );
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
  updateTranchePnl(
    event.params.user,
    event.params.asset,
    event.params.amount.neg(),
    event.params.tranche
  );
}

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}

export function handleVaultCreated(event: VaultCreated): void {
  log.info("-- handleVaultCreated ---", []);
  createVault(event.params._vault, event.params._owner);
}

export function handleVaultAssetInitialized(
  event: VaultAssetInitialized
): void {
  updateVaultData(event.params._vault, event.params._asset, event.address);
}

export function handleVaultMarginCredited(event: VaultMarginCredited): void {
  updateVaultData(event.params._vault, event.params._asset, event.address);
}

export function handleVaultMarginRedeemed(event: VaultMarginRedeemed): void {
  updateVaultData(event.params._vault, event.params._asset, event.address);
}

export function handleBorrow(event: Borrow): void {
  updateVaultData(event.params._vault, event.params._asset, event.address);
}

export function handleRepay(event: Repay): void {
  updateVaultData(event.params._vault, event.params._asset, event.address);
}
