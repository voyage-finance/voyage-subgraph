import { Paused, Unpaused } from '../../generated/Voyage/Voyage';

export { handleDeposit, handleWithdraw, handleClaim } from './liquidity';
export { handleBorrow, handleLiquidate, handleRepay } from './loan';
export {
  handleIncomeRatioUpdated,
  handleLiquidationConfigurationUpdated,
  handleLoanParametersUpdated,
  handleReserveActivated,
  handleReserveInitialized,
} from './reserves';
export { handleVaultCreated } from './vault';

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}
