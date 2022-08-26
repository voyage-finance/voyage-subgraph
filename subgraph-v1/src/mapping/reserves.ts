import {
    IncomeRatioUpdated,
    LiquidationConfigurationUpdated, LoanParametersUpdated, MarginParametersUpdated,
    ReserveActivated,
    ReserveInitialized
} from "../../generated/Voyage/Voyage";
import {getOrInitReserve, getOrInitReserveConfiguration, initVToken} from "../helpers/initializers";
import {VToken as VTokenSource} from "../../generated/templates";
import {log} from "@graphprotocol/graph-ts";


export function handleReserveInitialized(event: ReserveInitialized): void {
    getOrInitReserve(event.params._collection, event.params._currency);

    VTokenSource.create(event.params._juniorDepositTokenAddress);
    initVToken(
        event.params._juniorDepositTokenAddress,
        event.params._collection,
        event.params._currency,
        "Junior"
    );

    VTokenSource.create(event.params._seniorDepositTokenAddress);
    initVToken(
        event.params._seniorDepositTokenAddress,
        event.params._collection,
        event.params._currency,
        "Senior"
    );

    const reserveConfiguratio = getOrInitReserveConfiguration(event.params._collection);
    reserveConfiguratio.isInitialized = true;
    reserveConfiguratio.save();
}

export function handleReserveActivated(event: ReserveActivated): void {
    const reserve = getOrInitReserve(event.params._collection, null);
    const reserveConfiguratio = getOrInitReserveConfiguration(event.params._collection);
    reserve.isActive = true;
    reserve.configuration = reserveConfiguratio.id;
    reserve.save();
}

export function handleLiquidationConfigurationUpdated(
    event: LiquidationConfigurationUpdated
): void {
    const reserve = getOrInitReserveConfiguration(event.params._collection);
    reserve.liquidationBonus = event.params._liquidationBonus;
    reserve.save();
}

export function handleIncomeRatioUpdated(event: IncomeRatioUpdated): void {
    const reserve = getOrInitReserveConfiguration(event.params._collection);
    reserve.incomeRatio = event.params._incomeRatio;
    reserve.save();
}


export function handleLoanParametersUpdated(
    event: LoanParametersUpdated
): void {
    log.info("------- handleLoanParametersUpdated --------- {} {}", [
        event.params._epoch.toString(),
        event.params._term.toString(),
        event.params._gracePeriod.toString(),
    ]);
    const reserve = getOrInitReserveConfiguration(event.params._collection);
    // TODO: clarify these params
    reserve.loanInterval = event.params._epoch;
    reserve.loanTenure = event.params._term;
    reserve.save();
}

// todo-review: removed because margin-related fields deleted from ReserveConfiguration
// export function handleMarginParametersUpdated(
//     event: MarginParametersUpdated
// ): void {
//     const reserve = getOrInitReserveConfiguration(event.params._collection);
//     reserve.marginMin = event.params._min;
//     reserve.marginMax = event.params._max;
//     reserve.marginRequirement = event.params._marginRequirement;
//     reserve.save();
// }
