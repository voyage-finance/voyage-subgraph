import { Address, BigInt } from '@graphprotocol/graph-ts';

export function getReserveId(collection: Address, marketId: string): string {
  return [collection.toHexString(), marketId].join('_');
}

export function getUserDepositDataId(user: Address, collection: Address): string {
  return [user.toHex(), collection.toHex()].join('_');
}

export function getUserUnbondingDataId(user: Address, collection: Address): string {
  return [user.toHex(), collection.toHex()].join('_');
}

export function getLoanEntityId(
  vaultAddress: Address,
  collection: Address,
  loanId: BigInt,
): string {
  return [vaultAddress.toHex(), collection.toHex(), loanId.toString()].join('_');
}

export function getCreditLineEntityId(vaultAddress: Address, collection: Address): string {
  return [vaultAddress.toHex(), collection.toHex()].join('_');
}

export function getRepaymentEntityId(loanId: string, repaymentId: BigInt): string {
  return [loanId, repaymentId.toString()].join('_');
}

export function getCurrencyId(address: Address, symbol: string): string {
  return [address.toHex(), symbol].join('_');
}
