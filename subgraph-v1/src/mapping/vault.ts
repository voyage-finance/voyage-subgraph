import { Address, log } from '@graphprotocol/graph-ts';
import { Vault } from '../../generated/schema';
import { VaultCreated } from '../../generated/Voyage/Voyage';

function createVault(_vaultAddress: Address, _userAddress: Address): Vault {
  const vaultAddress = _vaultAddress.toHex();
  let vaultEntity = Vault.load(vaultAddress);
  if (!vaultEntity) {
    vaultEntity = new Vault(vaultAddress);
  }

  vaultEntity.user = _userAddress.toHex();

  vaultEntity.save();
  return vaultEntity;
}

export function handleVaultCreated(event: VaultCreated): void {
  log.info('-- handleVaultCreated ---', []);
  createVault(event.params._vault, event.params._owner);
}
