import { Address, log } from "@graphprotocol/graph-ts";
import {
  Deposit as VoyageDeposit,
  Withdraw as VoyageWithdraw,
} from "../../generated/Voyage/Voyage";
import { Tranche } from "../helpers/consts";
import {
  getOrInitReserve,
  getOrInitUnbonding,
  getOrInitUserData,
  getOrInitUserDepositData,
} from "../helpers/initializers";
import {
  decreaseTrancheLiquidity,
  decreaseVTokenLiquidity,
  increaseTrancheLiquidity,
  increaseVTokenLiquidity,
  updatePnL,
  updatePoolData,
  updateUserDepositData,
} from "../helpers/updaters";
import {
  Deposit as VTokenDeposit,
  Withdraw as VTokenWithdraw,
} from "../../generated/templates/VToken/VToken";
import { VToken } from "../../generated/schema";





// not used, currenly VToken's deposit events is being index
export function handleDeposit(event: VoyageDeposit): void {
  const reserve = getOrInitReserve(event.params._collection, event.params._currency);
  updatePoolData(reserve, event);
  reserve.save();
  // could be first time user, create one if it doesn't exist.
  const userData = getOrInitUserData(event.params._user);
  userData.save();
  const userDepositData = getOrInitUserDepositData(
    event.params._user,
    event.params._collection,
    event
  );
  updateUserDepositData(userDepositData, event);
  updatePnL(userDepositData, event.params.amount, event.params._tranche);
  userDepositData.save();
}

// not used, currenly VToken's withdraw events is being index
export function handleWithdraw(event: VoyageWithdraw): void {
  const reserve = getOrInitReserve(event.params._collection, event.params._currency);
  updatePoolData(reserve, event);
  reserve.save();
  const userDepositData = getOrInitUserDepositData(
    event.params._user,
    event.params._collection,
    event
  );
  updateUserDepositData(userDepositData, event);
  updatePnL(userDepositData, event.params.amount, event.params._tranche);
  const unbonding = getOrInitUnbonding(
    event.params._user,
    event.params._collection,
    event.block.timestamp
  );
  unbonding.amount = event.params.amount;
  unbonding.type =
    event.params._tranche === Tranche.Junior ? "Junior" : "Senior";
  unbonding.save();

  userDepositData.save();
}

export function handleDepositVToken(event: VTokenDeposit): void {
  const vTokenEntity = VToken.load(event.address.toHex());
  if (!vTokenEntity) {
    log.error(
      "tried to handle deposit event for a non-existent VToken. address: {}",
      [event.address.toHex()]
    );
    return;
  }
  let reserve = getOrInitReserve(Address.fromString(vTokenEntity.asset), null);
  increaseTrancheLiquidity(reserve, vTokenEntity.trancheType, event.params.assets);
  increaseVTokenLiquidity(vTokenEntity, event.params.assets);
  reserve.save();
  vTokenEntity.save();
}

export function handleWithdrawVToken(event: VTokenWithdraw): void {
  const vTokenEntity = VToken.load(event.address.toHex());
  if (!vTokenEntity) {
    log.error(
      "tried to handle withdraw event for a non-existent VToken. address: {}",
      [event.address.toHex()]
    );
    return;
  }
  let reserve = getOrInitReserve(Address.fromString(vTokenEntity.asset), null);
  decreaseTrancheLiquidity(reserve, vTokenEntity.trancheType, event.params.assets);
  decreaseVTokenLiquidity(vTokenEntity, event.params.assets);
  reserve.save();
  vTokenEntity.save();
}


