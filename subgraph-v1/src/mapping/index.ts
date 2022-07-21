import { Paused, Unpaused } from "../../generated/Voyage/Voyage";

export {
  handleReserveInitialized,
  handleReserveActivated,
  handleDeposit,
  handleWithdraw,
  handleDepositVToken,
  handleWithdrawVToken,
  handleLiquidationConfigurationUpdated,
  handleIncomeRatioUpdated,
  handleMarginParametersUpdated,
  handleLoanParametersUpdated,
} from "./liquidity";

export { handleBorrow, handleRepay, handleLiquidate } from "./loan";

export {
  handleVaultCreated,
  handleCreditLineInitialised,
  handleMarginEvent,
  handleLoanEvent,
} from "./vault";

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}
