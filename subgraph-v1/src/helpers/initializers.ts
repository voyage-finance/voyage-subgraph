import {Address, BigInt, Bytes, ethereum, log} from "@graphprotocol/graph-ts";
import {
  Currency,
  Loan,
  Reserve,
  ReserveConfiguration,
  Unbonding,
  UserData,
  UserDepositData,
  Vault,
  VToken,
} from "../../generated/schema";
import { IERC20Detailed } from "../../generated/Voyage/IERC20Detailed";
import {
  getCreditLineEntityId, getCurrencyId,
  getLoanEntityId,
  getUnbondingEntityId,
  getUserDepositDataId,
} from "../utils/id";
import { zeroBI } from "../utils/math";
import {IERC721} from "../../generated/Voyage/IERC721";


export function getOrInitCurrency(
    address: Address
): Currency {
  const erc20Instance = IERC20Detailed.bind(address)
  const id = getCurrencyId(address, erc20Instance.symbol())

  let currencyInstance = Currency.load(id);
  if (!currencyInstance) {
    currencyInstance = new Currency(id);
    currencyInstance.address = address;
    currencyInstance.symbol = erc20Instance.symbol();
    currencyInstance.decimals = BigInt.fromI32(erc20Instance.decimals());


    currencyInstance.save();
  }
  return currencyInstance;
}

export function getOrInitReserve(collection: Address, currencyAddress: Address | null): Reserve {
  const id = collection.toHex();
  let reserve = Reserve.load(id);
  if (!reserve) {
    reserve = new Reserve(id);
    reserve.isActive = false;
    reserve.collection = collection;
    reserve.seniorTrancheLiquidityRate = zeroBI();
    reserve.seniorTrancheTotalLiquidity = zeroBI();
    reserve.seniorTrancheAvailableLiquidity = zeroBI();
    reserve.juniorTrancheTotalLiquidity = zeroBI();
    reserve.juniorTrancheLiquidityRate = zeroBI();
    reserve.totalLiquidity = zeroBI();
    reserve.totalBorrow = zeroBI();
    reserve.trancheRatio = zeroBI();
    if (currencyAddress !== null) {
      const currency = getOrInitCurrency(currencyAddress);
      reserve.currency = currency.id;
    }else throw new Error("currency is not defined when Reserve is creating!")

    reserve.save();
  }
  return reserve;
}

export function getOrInitReserveConfiguration(
  collection: Address
): ReserveConfiguration {
  const id = collection.toHex();
  let reserveConfiguration = ReserveConfiguration.load(id);
  if (!reserveConfiguration) {
    reserveConfiguration = new ReserveConfiguration(id);
    const reserve = getOrInitReserve(collection, null);
    reserveConfiguration.reserve = reserve.id;
    reserveConfiguration.liquidationBonus = zeroBI();
    reserveConfiguration.loanInterval = zeroBI();
    reserveConfiguration.loanTenure = zeroBI();
    reserveConfiguration.incomeRatio = zeroBI();
    reserveConfiguration.isInitialized = false;
    reserveConfiguration.isActive = false;

    reserveConfiguration.save();
  }
  return reserveConfiguration;
}

export function getOrInitUserData(userAddress: Address): UserData {
  let id = userAddress.toHex();
  let userData = UserData.load(id);
  if (!userData) {
    userData = new UserData(id);
    userData.save();
  }
  return userData;
}

export function initVToken(
  tokenAddress: Address,
  collection: Address,
  currency: Address,
  trancheType: string
): VToken {
  getOrInitReserve(collection, currency);
  const vToken = new VToken(tokenAddress.toHex());
  vToken.trancheType = trancheType;
  vToken.asset = collection.toHex();
  vToken.totalLiquidity = zeroBI();
  vToken.save();
  return vToken;
}

export function getOrInitUserDepositData(
  userAddress: Address,
  collection: Address,
  event: ethereum.Event
): UserDepositData {
  const id = getUserDepositDataId(userAddress, collection);
  let userDepositData = UserDepositData.load(id);
  if (!userDepositData) {
    userDepositData = new UserDepositData(id);
    userDepositData.collection = collection;
    userDepositData.decimals = BigInt.fromI32(18);
    userDepositData.juniorDepositWithdrawalDiff = zeroBI();
    userDepositData.seniorDepositWithdrawalDiff = zeroBI();
    userDepositData.juniorTranchePnl = zeroBI();
    userDepositData.seniorTranchePnl = zeroBI();
    userDepositData.withdrawableJuniorBalance = zeroBI();
    userDepositData.withdrawableSeniorBalance = zeroBI();
    userDepositData.juniorTrancheBalance = zeroBI();
    userDepositData.seniorTrancheBalance = zeroBI();

    const user = getOrInitUserData(userAddress);
    userDepositData.user = user.id;
    userDepositData.save();
  }
  return userDepositData;
}

export function getOrInitUnbonding(
  userAddress: Address,
  collection: Address,
  withdrawalTime: BigInt
): Unbonding {
  const id = getUnbondingEntityId(userAddress, collection, withdrawalTime);
  let unbonding = Unbonding.load(id);
  if (!unbonding) {
    const user = getOrInitUserData(userAddress);
    unbonding = new Unbonding(id);
    unbonding.time = withdrawalTime;
    unbonding.amount = zeroBI();
    unbonding.user = user.id;
  }
  return unbonding;
}

export function getOrInitLoan(
  vaultAddress: Address,
  collection: Address,
  loanId: BigInt
): Loan {
  const id = getLoanEntityId(vaultAddress, collection, loanId);
  let loan = Loan.load(id);
  if (!loan) {
    loan = new Loan(id);
    loan.save();
  }
  return loan;
}

export function getOrInitVault(vaultAddress: Address): Vault {
  const id = vaultAddress.toHex();
  let vault = Vault.load(id);
  if (!vault) {
    vault = new Vault(id);
    vault.save();
  }
  return vault;
}
