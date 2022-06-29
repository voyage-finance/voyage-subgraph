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
  Voyager,
  Voyager__pendingSeniorWithdrawalsResult,
  Withdraw,
} from "../generated/Voyager/Voyager";
import {
  updatePoolAndConfigurationData,
  updateTranchePnl,
  updateUserData,
} from "./utils/pool";
import { updateVaultData } from "./utils/vault";

export function handleDeposit(event: Deposit): void {
  log.info("triggered [handleDeposit]", []);
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

export function handleVaultCreated(event: VaultCreated): void {}

export function handleVaultAssetInitialized(
  event: VaultAssetInitialized
): void {
  log.info("-- handleVaultAssetInitialized ---", []);
  updateVaultData(event.params._vault, event.params._asset, event.address);
}

export function handleVaultMarginCredited(event: VaultMarginCredited): void {
  log.info("]MarginCredited ---", []);
  updateVaultData(event.params._vault, event.params._asset, event.address);
}

export function handleVaultMarginRedeemed(event: VaultMarginRedeemed): void {
  log.info("-- handleVaultMarginRedeemed ---", []);
  updateVaultData(event.params._vault, event.params._asset, event.address);
}

export function handleBorrow(event: Borrow): void {
  log.info("-- handleBorrow ---", []);
  updateVaultData(event.params._vault, event.params._asset, event.address);
}

export function handleRepay(event: Repay): void {
  log.info("-- handleRepay ---", []);
  updateVaultData(event.params._vault, event.params._asset, event.address);
}
