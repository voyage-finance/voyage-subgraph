import { VaultCreated } from '../../generated/Voyage/Voyage';
import { getOrInitVault } from '../helpers/initializers';

export function handleVaultCreated(event: VaultCreated): void {
  const vault = getOrInitVault(event.params._vault);
  vault.signer = event.params._owner;
  vault.save();
}
