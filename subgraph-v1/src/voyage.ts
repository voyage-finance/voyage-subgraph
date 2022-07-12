import { BigInt, log } from "@graphprotocol/graph-ts";
import { Drawdown, Liquidation, Repayment, Pool } from "../generated/schema";
import {
  Borrow,
  Deposit,
  Liquidate,
  Paused,
  Repayment as RepaymentEvent,
  ReserveActivated,
  ReserveInitialized,
  Unpaused,
  VaultAssetInitialized,
  VaultCreated,
  VaultMarginCredited,
  VaultMarginRedeemed,
  Voyage,
  Withdraw,
} from "../generated/Voyage/Voyage";
import {
  populateDrawdownEntity,
  updatePoolAndConfigurationData,
  updateTranchePnl,
  updateUserData,
} from "./utils/pool";
import {
  createVault,
  generateRepaymentId,
  generateDrawdownId,
  handleCreditLineInitialised,
  handleLoanEvent,
  handleMarginEvent,
} from "./utils/vault";

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
  handleCreditLineInitialised(event);
}

export function handleVaultMarginCredited(event: VaultMarginCredited): void {
  handleMarginEvent(event.params._vault, event.params._asset, event.address);
}

export function handleVaultMarginRedeemed(event: VaultMarginRedeemed): void {
  handleMarginEvent(event.params._vault, event.params._asset, event.address);
}

export function handleBorrow(event: Borrow): void {
  const voyage = Voyage.bind(event.address);
  const vaultAddress = event.params._vault.toHex();
  const id = [
    vaultAddress,
    event.params._asset.toHex(),
    event.params._drawdownId.toString(),
  ].join("_");
  const drawdown = new Drawdown(id);
  populateDrawdownEntity(
    voyage,
    drawdown,
    event.params._vault,
    event.params._asset,
    event.params._drawdownId
  );
  drawdown.save();
}

export function handleRepay(event: RepaymentEvent): void {
  const voyage = Voyage.bind(event.address);
  const drawdownId = generateDrawdownId(
    event.params._vault,
    event.params._asset,
    event.params._drawdownId
  );
  const drawdown = Drawdown.load(drawdownId);
  populateDrawdownEntity(
    voyage,
    drawdown!,
    event.params._vault,
    event.params._asset,
    event.params._drawdownId
  );
  drawdown!.save();

  const id = generateRepaymentId(drawdown!.id, event.params._repaymentId);
  const repayment = new Repayment(id);
  repayment.drawdown = drawdown!.id;
  repayment.principal = drawdown!.pmt_principal;
  repayment.interest = drawdown!.pmt_interest;
  // we cannot use pmt.amount, as this may be a liquidation.
  // in the event of liquidation, the amount repaid could fall short if there is a partial or even complete write down of the debt.
  repayment.total = event.params._amount;
  repayment.paidAt = event.block.timestamp;
  repayment.repaid = event.params.isFinal;
  repayment.save();
}

export function handleLiquidate(event: Liquidate): void {
  const vaultAddress = event.params._vault.toHex();
  const assetAddress = event.params._asset.toHex();
  const userAddress = event.params._liquidator.toHex();

  const drawdownId = [
    vaultAddress,
    assetAddress,
    event.params._drowDownId.toString(),
  ].join("_");
  const repaymentId = [drawdownId, event.params._repaymentId.toString()].join(
    "_"
  );

  let liquidationEntity = Liquidation.load(repaymentId);
  if (!liquidationEntity) {
    liquidationEntity = new Liquidation(repaymentId);
  }

  liquidationEntity.liquidator = userAddress;
  liquidationEntity.vault = vaultAddress;
  liquidationEntity.reserve = assetAddress;
  liquidationEntity.drawdownId = event.params._drowDownId;
  liquidationEntity.repaymentId = event.params._repaymentId;
  liquidationEntity.drawdown = drawdownId;
  liquidationEntity.repayment = repaymentId;
  liquidationEntity.totalDebt = event.params._debt;
  liquidationEntity.amountSlashed = event.params._margin;
  liquidationEntity.totalToLiquidate = event.params._collateral;
  liquidationEntity.numNFTsToLiquidate = event.params._numCollateral;
  liquidationEntity.amountToWriteDown = event.params._writedown;

  liquidationEntity.save();
}
