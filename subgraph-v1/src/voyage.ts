import { log } from "@graphprotocol/graph-ts";
import {
  Paused,
  Unpaused,
  VaultAssetInitialized,
  VaultCreated,
  VaultMarginCredited,
  VaultMarginRedeemed,
} from "../generated/Voyage/Voyage";
import {
  createVault,
  handleCreditLineInitialised,
  handleMarginEvent,
} from "./utils/vault";

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}

export function handleVaultCreated(event: VaultCreated): void {
  log.info("-- handleVaultCreated ---", []);
  createVault(event.params._vault, event.params._owner);
}

export function handleVaultAssetInitialized(
  event: VaultAssetInitialized
): void {
  handleCreditLineInitialised(event);
}

export function handleVaultMarginCredited(event: VaultMarginCredited): void {
  handleMarginEvent(event.params._vault, event.params._asset, event.address);
}

export function handleVaultMarginRedeemed(event: VaultMarginRedeemed): void {
  handleMarginEvent(event.params._vault, event.params._asset, event.address);
}
