import { log } from "@graphprotocol/graph-ts";
import { Drawdown, Pool, Vault } from "../generated/schema";
import {
  Deposit,
  Paused,
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

export function handleVaultCreated(event: VaultCreated): void {
  /*
  const vaultAddress = event.params._vault.toHex();
  let vaultEntity = Vault.load(vaultAddress);
  if (!vaultEntity) {
    vaultEntity = new Vault(vaultAddress);
  }
  const voyager = Voyager.bind(event.address);
  const vaultData = voyager.getVaultData(
    event.params._owner,
    event.params._vault,
    // TODO: here should be sponsor address
    event.params._owner
  );
  vaultEntity.borrowRate = vaultData.borrowRate;
  vaultEntity.totalDebt = vaultData.totalDebt;
  vaultEntity.totalMargin = vaultData.totalMargin;
  vaultEntity.withdrawableSecurityDeposit =
    vaultData.withdrawableSecurityDeposit;
  vaultEntity.creditLimit = vaultData.creditLimit;
  vaultEntity.spendableBalance = vaultData.spendableBalance;
  vaultEntity.gav = vaultData.gav;
  vaultEntity.ltv = vaultData.ltv;
  vaultEntity.healthFactor = vaultData.healthFactor;
  vaultEntity.save();
  */
  // Update drawdowns
  // var unbonding: Drawdown;
  // for (let i = vaultData.drawDownList[0]; i < vaultData.drawDownList[1]; i++) {
  //   const drawdown = voyager.getDrawDownDetail(
  //     event.params._owner,
  //     event.params._vault,
  //     i.toBigInt()
  //   );
  // }
}

export function handleVaultAssetInitialized(
  event: VaultAssetInitialized
): void {
  log.info("-- handleVaultAssetInitialized vault {} reserve {}", [
    event.params._vault.toHexString(),
    event.params._asset.toHexString(),
  ]);
  // const vaultAddress = event.params._vault.toHex();
  // let vaultEntity = Vault.load(vaultAddress);
  // if (!vaultEntity) {
  //   vaultEntity = new Vault(vaultAddress);
  // }
  const voyager = Voyager.bind(event.address);
  const vaultData = voyager.getVaultData(
    event.params._vault,
    event.params._asset
  );

  log.info("-- handleVaultAssetInitialized: borrowRate {} totalDebt {}", [
    vaultData.borrowRate.toString(),
    vaultData.totalDebt.toString(),
  ]);
  /*
  vaultEntity.borrowRate = vaultData.borrowRate;
  vaultEntity.totalDebt = vaultData.totalDebt;
  vaultEntity.totalMargin = vaultData.totalMargin;
  vaultEntity.withdrawableSecurityDeposit =
    vaultData.withdrawableSecurityDeposit;
  vaultEntity.creditLimit = vaultData.creditLimit;
  vaultEntity.spendableBalance = vaultData.spendableBalance;
  vaultEntity.gav = vaultData.gav;
  vaultEntity.ltv = vaultData.ltv;
  vaultEntity.healthFactor = vaultData.healthFactor;
  vaultEntity.save();
  // Update drawdowns
  // var unbonding: Drawdown;
  // for (let i = vaultData.drawDownList[0]; i < vaultData.drawDownList[1]; i++) {
  //   const drawdown = voyager.getDrawDownDetail(
  //     event.params._owner,
  //     event.params._vault,
  //     i.toBigInt()
  //   );
  // }*/
}

export function handleVaultMarginCredited(event: VaultMarginCredited): void {}

export function handleVaultMarginRedeemed(event: VaultMarginRedeemed): void {}
