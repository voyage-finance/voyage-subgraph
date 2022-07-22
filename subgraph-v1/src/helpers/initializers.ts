import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  CreditLine,
  Loan,
  Pool,
  PoolConfiguration,
  Unbonding,
  UserData,
  UserDepositData,
  Vault,
  VToken,
} from "../../generated/schema";
import { IERC20Detailed } from "../../generated/Voyage/IERC20Detailed";
import {
  getCreditLineEntityId,
  getLoanEntityId,
  getUnbondingEntityId,
  getUserDepositDataId,
} from "../utils/id";
import { zeroBI } from "../utils/math";

export function getOrInitPool(assetAddress: Address): Pool {
  const id = assetAddress.toHex();
  let pool = Pool.load(id);
  if (!pool) {
    pool = new Pool(id);
    pool.isActive = false;
    pool.underlyingAsset = assetAddress;
    pool.symbol = "";
    pool.decimals = zeroBI();
    pool.seniorTrancheLiquidityRate = zeroBI();
    pool.seniorTrancheTotalLiquidity = zeroBI();
    pool.seniorTrancheAvailableLiquidity = zeroBI();
    pool.juniorTrancheTotalLiquidity = zeroBI();
    pool.juniorTrancheLiquidityRate = zeroBI();
    pool.totalLiquidity = zeroBI();
    pool.totalBorrow = zeroBI();
    pool.trancheRatio = zeroBI();
    pool.save();
  }
  return pool;
}

export function getOrInitPoolConfiguration(
  assetAddress: Address
): PoolConfiguration {
  const id = assetAddress.toHex();
  let poolConfiguration = PoolConfiguration.load(id);
  if (!poolConfiguration) {
    poolConfiguration = new PoolConfiguration(id);
    const pool = getOrInitPool(assetAddress);
    poolConfiguration.pool = pool.id;
    poolConfiguration.marginRequirement = zeroBI();
    poolConfiguration.marginMin = zeroBI();
    poolConfiguration.marginMax = zeroBI();
    poolConfiguration.loanTenure = zeroBI();
    poolConfiguration.optimalIncomeRatio = zeroBI();
    poolConfiguration.optimalTrancheRatio = zeroBI();
    poolConfiguration.save();
  }
  return poolConfiguration;
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
  assetAddress: Address,
  trancheType: string
): VToken {
  const vToken = new VToken(tokenAddress.toHex());
  vToken.trancheType = trancheType;
  vToken.asset = assetAddress.toHex();
  vToken.totalLiquidity = zeroBI();
  vToken.save();
  return vToken;
}

export function getOrInitUserDepositData(
  userAddress: Address,
  assetAddress: Address,
  event: ethereum.Event
): UserDepositData {
  const id = getUserDepositDataId(userAddress, assetAddress);
  let userDepositData = UserDepositData.load(id);
  if (!userDepositData) {
    const underlying = IERC20Detailed.bind(assetAddress);
    const decimals = underlying.decimals();
    userDepositData = new UserDepositData(id);
    userDepositData.underlyingAsset = assetAddress;
    userDepositData.decimals = BigInt.fromI32(decimals);
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
  assetAddress: Address,
  withdrawalTime: BigInt
): Unbonding {
  const id = getUnbondingEntityId(userAddress, assetAddress, withdrawalTime);
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
  assetAddress: Address,
  loanId: BigInt
): Loan {
  const id = getLoanEntityId(vaultAddress, assetAddress, loanId);
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

export function getOrInitCreditLine(
  vaultAddress: Address,
  assetAddress: Address
): CreditLine {
  const id = getCreditLineEntityId(vaultAddress, assetAddress);
  let creditLine = CreditLine.load(id);
  if (!creditLine) {
    creditLine = new CreditLine(id);
    creditLine.save();
  }
  return creditLine;
}
