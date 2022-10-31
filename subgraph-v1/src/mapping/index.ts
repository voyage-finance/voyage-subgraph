export { handleProtocolFeeUpdated } from './market';
export {
  handleIncomeRatioUpdated,
  handleLiquidationConfigurationUpdated,
  handleLoanParametersUpdated,
  handleReserveActivated,
  handleReserveDeactivated,
  handleReserveInitialized,
} from './reserves';
export { handleDeposit, handleWithdraw, handleClaim } from './liquidity';
export { handleBorrow, handleBorrowLegacy, handleLiquidate, handleRepay } from './loan';
export { handleVaultCreated } from './vault';
