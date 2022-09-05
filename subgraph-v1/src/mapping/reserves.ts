import { log } from '@graphprotocol/graph-ts';
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
  getOrInitReserve,
  getOrInitReserveConfiguration,
  getOrInitVToken,
} from '../helpers/initializers';

export function handleReserveInitialized(event: ReserveInitialized): void {
  const reserve = getOrInitReserve(event.params._collection);
  const reserveConfiguration = getOrInitReserveConfiguration(event.params._collection);
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
  juniorTrancheVToken.reserve = event.params._collection.toHexString();
  juniorTrancheVToken.asset = event.params._currency.toHexString();
  juniorTrancheVToken.save();

  SeniorDepositToken.create(event.params._seniorDepositTokenAddress);
  const seniorTrancheVToken = getOrInitVToken(
    event.params._seniorDepositTokenAddress,
    SENIOR_TRANCHE,
  );
  seniorTrancheVToken.reserve = event.params._collection.toHexString();
  seniorTrancheVToken.asset = event.params._currency.toHexString();
  seniorTrancheVToken.save();

  reserve.juniorTrancheVToken = juniorTrancheVToken.id;
  reserve.seniorTrancheVToken = seniorTrancheVToken.id;

  reserve.save();
}

export function handleReserveActivated(event: ReserveActivated): void {
  const reserveConfiguration = getOrInitReserveConfiguration(event.params._collection);
  reserveConfiguration.isActive = true;
  reserveConfiguration.save();
}

export function handleLiquidationConfigurationUpdated(
  event: LiquidationConfigurationUpdated,
): void {
  const reserveConfiguration = getOrInitReserveConfiguration(event.params._collection);
  reserveConfiguration.liquidationBonus = event.params._liquidationBonus;
  reserveConfiguration.save();
}

export function handleIncomeRatioUpdated(event: IncomeRatioUpdated): void {
  const reserveConfiguration = getOrInitReserveConfiguration(event.params._collection);
  reserveConfiguration.incomeRatio = event.params._incomeRatio;
  reserveConfiguration.save();
}

export function handleLoanParametersUpdated(event: LoanParametersUpdated): void {
  log.info('------- handleLoanParametersUpdated --------- {} {}', [
    event.params._epoch.toString(),
    event.params._term.toString(),
    event.params._gracePeriod.toString(),
  ]);
  const reserveConfiguration = getOrInitReserveConfiguration(event.params._collection);
  reserveConfiguration.loanInterval = event.params._epoch;
  reserveConfiguration.loanTenure = event.params._term;
  reserveConfiguration.gracePeriod = event.params._gracePeriod;
  reserveConfiguration.save();
}
