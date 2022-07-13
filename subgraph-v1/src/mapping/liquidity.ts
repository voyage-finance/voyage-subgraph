import {
  Deposit,
  ReserveActivated,
  ReserveInitialized,
  Withdraw,
} from "../../generated/Voyage/Voyage";
import { Tranche } from "../helpers/consts";
import {
  getOrInitPool,
  getOrInitPoolConfiguration,
  getOrInitUnbonding,
  getOrInitUserData,
  getOrInitUserDepositData,
} from "../helpers/initializers";
import {
  updatePnL,
  updatePoolConfiguration,
  updatePoolData,
  updateUserDepositData,
} from "../helpers/updaters";

export function handleReserveInitialized(event: ReserveInitialized): void {
  getOrInitPool(event.params._asset);
}

export function handleReserveActivated(event: ReserveActivated): void {
  const poolConfiguration = getOrInitPoolConfiguration(event.params._asset);
  updatePoolConfiguration(poolConfiguration, event);
  poolConfiguration.save();
  const reserve = getOrInitPool(event.params._asset);
  reserve.isActive = true;
  reserve.configuration = poolConfiguration.id;
  reserve.save();
}

export function handleDeposit(event: Deposit): void {
  const pool = getOrInitPool(event.params.asset);
  updatePoolData(pool, event);
  pool.save();
  const poolConfiguration = getOrInitPoolConfiguration(event.params.asset);
  updatePoolConfiguration(poolConfiguration, event);
  poolConfiguration.save();
  // could be first time user, create one if it doesn't exist.
  const userData = getOrInitUserData(event.params.user);
  userData.save();
  const userDepositData = getOrInitUserDepositData(
    event.params.user,
    event.params.asset,
    event
  );
  updateUserDepositData(userDepositData, event);
  updatePnL(userDepositData, event.params.amount, event.params.tranche);
  userDepositData.save();
}

export function handleWithdraw(event: Withdraw): void {
  const pool = getOrInitPool(event.params.asset);
  updatePoolData(pool, event);
  pool.save();
  const poolConfiguration = getOrInitPoolConfiguration(event.params.asset);
  updatePoolConfiguration(poolConfiguration, event);
  poolConfiguration.save();
  const userDepositData = getOrInitUserDepositData(
    event.params.user,
    event.params.asset,
    event
  );
  updateUserDepositData(userDepositData, event);
  updatePnL(userDepositData, event.params.amount, event.params.tranche);
  const unbonding = getOrInitUnbonding(
    event.params.user,
    event.params.asset,
    event.block.timestamp
  );
  unbonding.amount = event.params.amount;
  unbonding.type =
    event.params.tranche === Tranche.Junior ? "Junior" : "Senior";
  unbonding.save();

  userDepositData.save();
}
