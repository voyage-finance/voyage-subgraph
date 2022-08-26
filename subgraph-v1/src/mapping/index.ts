import {Paused, Unpaused} from "../../generated/Voyage/Voyage";

export {
  handleDeposit,
  handleWithdraw,
  handleDepositVToken,
  handleWithdrawVToken,
} from "./liquidity";

export { handleBorrow, handleRepay, handleLiquidate } from "./loan";

export {
  handleReserveInitialized,
  handleReserveActivated,
  handleLiquidationConfigurationUpdated,
  handleIncomeRatioUpdated,
  handleLoanParametersUpdated
} from "./reserves";

export {
  handleVaultCreated,
  handleLoanEvent,
} from "./vault";

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}
