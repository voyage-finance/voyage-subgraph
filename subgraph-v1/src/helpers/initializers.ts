import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import {
  ContractToMarketMapping,
  Currency,
  Loan,
  Market,
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
  getCurrencyId,
  getLoanEntityId,
  getReserveId,
  getUserDepositDataId,
  getUserUnbondingDataId,
} from '../utils/id';
import { zeroAddress, zeroBI } from '../utils/math';

export function getMarketByContract(event: ethereum.Event): string {
  let contractAddress = event.address.toHexString();
  let contractToMarketMapping = ContractToMarketMapping.load(contractAddress);
  if (contractToMarketMapping === null) {
    throw new Error(contractAddress + 'is not registered in ContractToMarketMapping');
  }
  return contractToMarketMapping.market;
}

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
  const id = getCurrencyId(address, erc20Instance.symbol());

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

export function getOrInitUserDepositData(
  userAddress: Address,
  collectionAddress: Address,
): UserDepositData {
  const id = getUserDepositDataId(userAddress, collectionAddress);
  let userDepositData = UserDepositData.load(id);
  if (!userDepositData) {
    userDepositData = new UserDepositData(id);
    userDepositData.collection = collectionAddress;
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
  collection: Address,
  loanId: BigInt,
  event: ethereum.Event,
): Loan {
  const id = getLoanEntityId(vault, collection, loanId);
  let loan = Loan.load(id);
  if (!loan) {
    loan = new Loan(id);
    loan.reserve = collection.toHexString();
    loan.vault = vault.toHexString();
    loan.loanId = loanId;
    loan.tokenId = zeroBI();

    loan.principal = zeroBI();
    loan.interest = zeroBI();
    loan.pmt_principal = zeroBI();
    loan.pmt_interest = zeroBI();
    loan.pmt_payment = zeroBI();

    loan.term = zeroBI();
    loan.epoch = zeroBI();
    loan.nper = zeroBI();
    loan.apr = zeroBI();

    loan.timestamp = event.block.timestamp;
    loan.nextPaymentDue = event.block.timestamp.plus(loan.epoch);

    loan.totalPrincipalPaid = zeroBI();
    loan.totalInterestPaid = zeroBI();
    loan.paidTimes = zeroBI();

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
