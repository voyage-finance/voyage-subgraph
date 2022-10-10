import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import {
  Asset,
  BuyNowTransaction,
  Currency,
  Loan,
  Market,
  Repayment,
  Reserve,
  ReserveConfiguration,
  UserData,
  UserDepositData,
  UserUnbondingData,
  Vault,
  VToken,
} from '../../generated/schema';
import { IERC20Detailed } from '../../generated/Voyage/IERC20Detailed';
import {
  getAssetId,
  getBuyNowTransactionId,
  getCurrencyId,
  getLoanId,
  getRepaymentId,
  getReserveId,
  getUserDepositDataId,
  getUserUnbondingDataId,
} from '../utils/id';
import { zeroAddress, zeroBI } from '../utils/math';

export function getOrInitMarket(event: ethereum.Event): Market {
  const id = event.address.toHexString();
  let market = Market.load(id);
  if (!market) {
    market = new Market(id);
    market.protocolFee = zeroBI();
    market.protocolTreasury = zeroAddress();
    market.save();
  }
  return market;
}

export function getOrInitReserveById(reserveId: string): Reserve {
  let reserve = Reserve.load(reserveId);
  if (!reserve) {
    reserve = new Reserve(reserveId);
    reserve.market = zeroAddress().toHexString();
    reserve.collection = zeroAddress();
    reserve.currency = zeroAddress().toHexString();

    reserve.totalPrincipal = zeroBI();
    reserve.totalInterest = zeroBI();
    reserve.totalBorrow = zeroBI();
    reserve.availableLiquidity = zeroBI();
    reserve.totalLiquidity = zeroBI();
    reserve.utilizationRate = zeroBI();
    reserve.liquidityRatio = zeroBI();
    reserve.borrowRate = zeroBI();
    reserve.depositRate = zeroBI();

    reserve.seniorTrancheVToken = zeroAddress().toHexString();
    reserve.seniorTrancheDepositRate = zeroBI();
    reserve.seniorTrancheLiquidity = zeroBI();

    reserve.juniorTrancheVToken = zeroAddress().toHexString();
    reserve.juniorTrancheDepositRate = zeroBI();
    reserve.juniorTrancheLiquidity = zeroBI();

    reserve.save();
  }
  return reserve;
}

export function getOrInitReserve(collection: Address, marketId: string): Reserve {
  const id = getReserveId(collection, marketId);
  const reserve = getOrInitReserveById(id);
  reserve.collection = collection;
  reserve.save();
  return reserve;
}

export function getOrInitReserveConfiguration(reserveId: string): ReserveConfiguration {
  let reserveConfiguration = ReserveConfiguration.load(reserveId);
  if (!reserveConfiguration) {
    reserveConfiguration = new ReserveConfiguration(reserveId);
    reserveConfiguration.reserve = reserveId;
    reserveConfiguration.liquidationBonus = zeroBI();
    reserveConfiguration.loanInterval = zeroBI();
    reserveConfiguration.loanTenure = zeroBI();
    reserveConfiguration.gracePeriod = zeroBI();
    reserveConfiguration.incomeRatio = zeroBI();
    reserveConfiguration.isInitialized = false;
    reserveConfiguration.isActive = false;

    reserveConfiguration.save();
  }
  return reserveConfiguration;
}

export function getOrInitCurrency(address: Address): Currency {
  const erc20Instance = IERC20Detailed.bind(address);
  const id = getCurrencyId(address);

  let currencyInstance = Currency.load(id);
  if (!currencyInstance) {
    currencyInstance = new Currency(id);
    currencyInstance.symbol = erc20Instance.symbol();
    currencyInstance.decimals = BigInt.fromI32(erc20Instance.decimals());

    currencyInstance.save();
  }
  return currencyInstance;
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

export function getOrInitVToken(vTokenAddress: Address, tranche: string = ''): VToken {
  const id = vTokenAddress.toHexString();
  let vToken = VToken.load(id);
  if (!vToken) {
    vToken = new VToken(id);
    vToken.reserve = zeroAddress().toHexString();
    vToken.asset = zeroAddress().toHexString();
    vToken.tranche = tranche;
    vToken.totalAssets = zeroBI();
    vToken.totalShares = zeroBI();
    vToken.save();
  }
  return vToken;
}

export function getOrInitUserDepositData(userAddress: Address, reserveId: string): UserDepositData {
  const id = getUserDepositDataId(userAddress, reserveId);
  let userDepositData = UserDepositData.load(id);
  if (!userDepositData) {
    userDepositData = new UserDepositData(id);
    userDepositData.reserve = reserveId;
    userDepositData.juniorTrancheShares = zeroBI();
    userDepositData.juniorTrancheCumulativeDeposits = zeroBI();
    userDepositData.juniorTrancheCumulativeWithdrawals = zeroBI();
    userDepositData.seniorTrancheShares = zeroBI();
    userDepositData.seniorTrancheCumulativeDeposits = zeroBI();
    userDepositData.seniorTrancheCumulativeWithdrawals = zeroBI();

    const user = getOrInitUserData(userAddress);
    userDepositData.user = user.id;
    userDepositData.save();
  }
  return userDepositData;
}

export function getOrInitUserUnbondingData(
  user: Address,
  collection: Address,
  event: ethereum.Event,
): UserUnbondingData {
  const id = getUserUnbondingDataId(user, collection);
  let unbonding = UserUnbondingData.load(id);
  if (!unbonding) {
    unbonding = new UserUnbondingData(id);
    unbonding.time = event.block.timestamp;
    unbonding.blocknum = event.block.number;
    unbonding.collection = collection;
    unbonding.shares = zeroBI();
    unbonding.maxUnderlying = zeroBI();
    unbonding.user = user.toHexString();
  }
  return unbonding;
}

export function getOrInitLoan(
  vault: Address,
  reserveId: string,
  loanId: BigInt,
  event: ethereum.Event,
): Loan {
  const id = getLoanId(vault, loanId);
  let loan = Loan.load(id);
  if (!loan) {
    loan = new Loan(id);
    loan.reserve = reserveId;
    loan.vault = getOrInitVault(vault).id;
    loan.loanId = loanId;

    loan.protocolFee = zeroBI();
    loan.principal = zeroBI();
    loan.interest = zeroBI();

    loan.pmt_principal = zeroBI();
    loan.pmt_interest = zeroBI();
    loan.pmt_payment = zeroBI();
    loan.pmt_fee = zeroBI();

    loan.term = zeroBI();
    loan.epoch = zeroBI();
    loan.nper = zeroBI();
    loan.apr = zeroBI();

    loan.timestamp = event.block.timestamp;
    loan.blocknum = event.block.number;
    loan.nextPaymentDue = event.block.timestamp.plus(loan.epoch);

    loan.totalPrincipalPaid = zeroBI();
    loan.totalInterestPaid = zeroBI();
    loan.paidTimes = zeroBI();
    loan.closed = false;

    loan.save();
  }
  return loan;
}

export function getOrInitAsset(
  collection: Address,
  tokenId: BigInt,
  vaultId: string,
  loanId: string,
): Asset {
  const id = getAssetId(collection, tokenId);
  let asset = Asset.load(id);
  if (!asset) {
    asset = new Asset(id);
    asset.vault = vaultId;
    asset.loan = loanId;
    asset.collection = collection;
    asset.tokenId = tokenId;
    asset.isUnderLien = false;
    asset.isLiquidated = false;
    asset.save();
  }
  return asset;
}

export function getOrInitRepayment(vault: Address, loanId: BigInt, repaymentId: BigInt): Repayment {
  const id = getRepaymentId(vault, loanId, repaymentId);
  let repayment = Repayment.load(id);
  if (!repayment) {
    repayment = new Repayment(id);
    repayment.loan = getLoanId(vault, loanId);
    repayment.principal = zeroBI();
    repayment.interest = zeroBI();
    repayment.fee = zeroBI();
    repayment.total = zeroBI();
    repayment.paidAt = zeroBI();
    repayment.isFinal = false;
    repayment.txHash = zeroAddress();
    repayment.save();
  }

  return repayment;
}

export function getOrInitVault(vaultAddress: Address): Vault {
  const id = vaultAddress.toHex();
  let vault = Vault.load(id);
  if (!vault) {
    vault = new Vault(id);
    vault.signer = zeroAddress();
    vault.save();
  }
  return vault;
}

export function getOrInitBuyNowTransaction(
  vault: Address,
  collection: Address,
  tokenId: BigInt,
  loanId: string,
): BuyNowTransaction {
  const id = getBuyNowTransactionId(vault, collection, tokenId);
  let buyNowTransaction = BuyNowTransaction.load(id);
  if (!buyNowTransaction) {
    buyNowTransaction = new BuyNowTransaction(id);
    buyNowTransaction.tokenId = tokenId;
    buyNowTransaction.collection = collection;
    buyNowTransaction.vault = vault;

    buyNowTransaction.txHash = zeroAddress();
    buyNowTransaction.marketplace = zeroAddress();
    buyNowTransaction.loan = loanId;

    buyNowTransaction.save();
  }
  return buyNowTransaction;
}
