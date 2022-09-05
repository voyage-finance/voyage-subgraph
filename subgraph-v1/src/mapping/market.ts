import { ProtocolFeeUpdated } from '../../generated/Voyage/Voyage';
import { getOrInitMarket } from '../helpers/initializers';

export function handleProtocolFeeUpdated(event: ProtocolFeeUpdated): void {
  const market = getOrInitMarket(event);
  market.protocolTreasury = event.params._treasury;
  market.protocolFee = event.params._fee;
  market.save();
}
