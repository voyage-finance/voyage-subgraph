import { BigInt } from '@graphprotocol/graph-ts';
import { VaultCreated } from '../../generated/Voyage/Voyage';
import { getOrInitMarket, getOrInitVault } from '../helpers/initializers';

export function handleVaultCreated(event: VaultCreated): void {
  const market = getOrInitMarket(event);
  market.vaultCount = market.vaultCount.plus(BigInt.fromI32(1));
  market.save();

  const vault = getOrInitVault(event.params._vault, event);
  vault.market = market.id;
  vault.signer = event.params._owner;
  vault.createdAt = event.block.timestamp;
  vault.save();
}
