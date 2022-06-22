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

export function handleDeposit(event: Deposit): void {
  const underlyingAddress = event.params.asset;
  const poolId = underlyingAddress.toHex();
  let pool = Pool.load(poolId);
  if (!pool) {
    pool = new Pool(poolId);
  }
  const voyager = Voyager.bind(event.address);
  const poolState = voyager.getPoolData(underlyingAddress);

  // TODO: fix on voyager side
  // if (!pool.configuration) {
  //   const poolConfigState = voyager.getPoolConfiguration(underlyingAddress);
  //   // use the address for config too
  //   const poolConfigurationEntity = new PoolConfiguration(
  //     underlyingAddress.toHex()
  //   );
  //   poolConfigurationEntity.pool = poolId;
  //   poolConfigurationEntity.marginRequirement =
  //     poolConfigState.marginRequirement;
  //   poolConfigurationEntity.marginMin = poolConfigurationEntity.marginMin;
  //   poolConfigurationEntity.marginMax = poolConfigurationEntity.marginMax;
  //   poolConfigurationEntity.loanTenure = poolConfigState.loanTenure;
  //   poolConfigurationEntity.optimalIncomeRatio =
  //     poolConfigState.optimalIncomeRatio;
  //   poolConfigurationEntity.optimalTrancheRatio =
  //     poolConfigState.optimalTrancheRatio;
  //   poolConfigurationEntity.save();
  // }

  // pool.configuration = poolId;
  pool.isActive = true;
  pool.underlyingAsset = underlyingAddress;
  pool.symbol = poolState.symbol;
  pool.decimals = poolState.decimals;
  pool.juniorTrancheTotalLiquidity = poolState.juniorLiquidity;
  pool.juniorTrancheLiquidityRate = poolState.juniorLiquidityRate;
  pool.seniorTrancheTotalLiquidity = poolState.seniorLiquidity;
  pool.seniorTrancheAvailableLiquidity = poolState.seniorLiquidity.minus(
    poolState.totalDebt
  );
  pool.seniorTrancheLiquidityRate = poolState.seniorLiquidityRate;
  pool.totalLiquidity = poolState.totalLiquidity;
  pool.totalBorrow = poolState.totalDebt;
  pool.trancheRatio = poolState.trancheRatio;
  pool.save();
  // // Entities can be loaded from the store using a string ID; this ID
  // // needs to be unique across all entities of the same type
  // let entity = ExampleEntity.load(event.transaction.from.toHex());

  // // Entities only exist after they have been saved to the store;
  // // `null` checks allow to create entities on demand
  // if (!entity) {
  //   entity = new ExampleEntity(event.transaction.from.toHex());

  //   // Entity fields can be set using simple assignments
  //   entity.count = BigInt.fromI32(0);
  // }

  // // BigInt and BigDecimal math are supported
  // entity.count = entity.count + BigInt.fromI32(1);

  // // Entity fields can be set based on event parameters
  // entity.asset = event.params.asset;
  // entity.user = event.params.user;

  // // Entities can be written to the store with `.save()`
  // entity.save();

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.getDrawDownDetail(...)
  // - contract.getPoolConfiguration(...)
  // - contract.getPoolData(...)
  // - contract.getPoolTokens(...)
  // - contract.getUserPoolData(...)
  // - contract.getUserVault(...)
  // - contract.getVaultData(...)
  // - contract.pendingJuniorWithdrawals(...)
  // - contract.pendingSeniorWithdrawals(...)
  // - contract.balance(...)
  // - contract.getReserveFlags(...)
  // - contract.getReserveStatus(...)
  // - contract.liquidityRate(...)
  // - contract.unbonding(...)
  // - contract.utilizationRate(...)
  // - contract.getVaultDebt(...)
  // - contract.interestBalance(...)
  // - contract.principalBalance(...)
  // - contract.paused(...)
  // - contract.createVault(...)
  // - contract.getAllVaults(...)
  // - contract.getAvailableCredit(...)
  // - contract.getCreditLimit(...)
  // - contract.getMargin(...)
  // - contract.getVault(...)
  // - contract.getVaultConfig(...)
  // - contract.getWithdrawableDeposit(...)
}

export function handleReserveActivated(event: ReserveActivated): void {}

export function handleReserveInitialized(event: ReserveInitialized): void {}

export function handleWithdraw(event: Withdraw): void {}

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}

export function handleVaultCreated(event: VaultCreated): void {}

export function handleVaultInitialized(event: VaultInitialized): void {}

export function handleVaultMarginCredited(event: VaultMarginCredited): void {}

export function handleVaultMarginRedeemed(event: VaultMarginRedeemed): void {}
