import { BigInt } from '@graphprotocol/graph-ts';
import { JuniorDepositToken, SeniorDepositToken } from '../../generated/templates';
import {
  IncomeRatioUpdated,
  LiquidationConfigurationUpdated,
  LoanParametersUpdated,
  ReserveActivated,
  ReserveInitialized,
} from '../../generated/Voyage/Voyage';
import { JUNIOR_TRANCHE, SENIOR_TRANCHE } from '../helpers/consts';
import {
  getOrInitCurrency,
  getOrInitMarket,
  getOrInitReserve,
  getOrInitReserveConfiguration,
  getOrInitVToken,
} from '../helpers/initializers';
import { getReserveId } from '../utils/id';

export function handleReserveInitialized(event: ReserveInitialized): void {
  const market = getOrInitMarket(event);
  market.reserveCount = market.reserveCount.plus(BigInt.fromI32(1));
  market.save();

  const reserve = getOrInitReserve(event.params._collection, market.id);
  reserve.market = market.id;
  const reserveConfiguration = getOrInitReserveConfiguration(reserve.id);
  reserveConfiguration.isInitialized = true;
  reserveConfiguration.save();
  reserve.configuration = reserveConfiguration.id;
  const currency = getOrInitCurrency(event.params._currency);
  reserve.currency = currency.id;

  JuniorDepositToken.create(event.params._juniorDepositTokenAddress);
  const juniorTrancheVToken = getOrInitVToken(
    event.params._juniorDepositTokenAddress,
    JUNIOR_TRANCHE,
  );
  juniorTrancheVToken.reserve = reserve.id;
  juniorTrancheVToken.asset = event.params._currency.toHexString();
  juniorTrancheVToken.save();

  SeniorDepositToken.create(event.params._seniorDepositTokenAddress);
  const seniorTrancheVToken = getOrInitVToken(
    event.params._seniorDepositTokenAddress,
    SENIOR_TRANCHE,
  );
  seniorTrancheVToken.reserve = reserve.id;
  seniorTrancheVToken.asset = event.params._currency.toHexString();
  seniorTrancheVToken.save();

  reserve.juniorTrancheVToken = juniorTrancheVToken.id;
  reserve.seniorTrancheVToken = seniorTrancheVToken.id;

  reserve.save();
}

export function handleReserveActivated(event: ReserveActivated): void {
  const reserveId = getReserveId(event.params._collection, event.address.toHexString());
  const reserveConfiguration = getOrInitReserveConfiguration(reserveId);
  reserveConfiguration.isActive = true;
  reserveConfiguration.save();
}

export function handleLiquidationConfigurationUpdated(
  event: LiquidationConfigurationUpdated,
): void {
  const reserveId = getReserveId(event.params._collection, event.address.toHexString());
  const reserveConfiguration = getOrInitReserveConfiguration(reserveId);
  reserveConfiguration.liquidationBonus = event.params._liquidationBonus;
  reserveConfiguration.save();
}

export function handleIncomeRatioUpdated(event: IncomeRatioUpdated): void {
  const reserveId = getReserveId(event.params._collection, event.address.toHexString());
  const reserveConfiguration = getOrInitReserveConfiguration(reserveId);
  reserveConfiguration.incomeRatio = event.params._incomeRatio;
  reserveConfiguration.save();
}

export function handleLoanParametersUpdated(event: LoanParametersUpdated): void {
  const reserveId = getReserveId(event.params._collection, event.address.toHexString());
  const reserveConfiguration = getOrInitReserveConfiguration(reserveId);
  reserveConfiguration.loanInterval = event.params._epoch;
  reserveConfiguration.loanTenure = event.params._term;
  reserveConfiguration.gracePeriod = event.params._gracePeriod;
  reserveConfiguration.save();
}
