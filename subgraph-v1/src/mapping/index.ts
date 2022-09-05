export { handleProtocolFeeUpdated } from './market';
export {
  handleIncomeRatioUpdated,
  handleLiquidationConfigurationUpdated,
  handleLoanParametersUpdated,
  handleReserveActivated,
  handleReserveInitialized,
} from './reserves';
export { handleDeposit, handleWithdraw, handleClaim } from './liquidity';
export { handleBorrow, handleLiquidate, handleRepay } from './loan';
export { handleVaultCreated } from './vault';
