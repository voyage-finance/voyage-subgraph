import { Address, BigInt } from '@graphprotocol/graph-ts';

export function getReserveId(collection: Address, marketId: string): string {
  return [collection.toHexString(), marketId].join('_');
}

export function getUserDepositDataId(user: Address, reserveId: string): string {
  return [user.toHex(), reserveId].join('_');
}

export function getUserUnbondingDataId(user: Address, reserveId: string): string {
  return [user.toHex(), reserveId].join('_');
}

export function getAssetId(collection: Address, tokenId: BigInt): string {
  return [collection.toHexString(), tokenId.toString()].join('.');
}

export function getLoanId(vaultAddress: Address, collection: Address, loanId: BigInt): string {
  return [vaultAddress.toHex(), collection.toHex(), loanId.toString()].join('_');
}

export function getCreditLineEntityId(vaultAddress: Address, collection: Address): string {
  return [vaultAddress.toHex(), collection.toHex()].join('_');
}

export function getRepaymentId(vault: Address, loanId: BigInt, repaymentId: BigInt): string {
  return [vault.toHexString(), loanId.toString(), repaymentId.toString()].join('_');
}

export function getCurrencyId(address: Address): string {
  return address.toHex();
}

export function getBuyNowTransactionId(
  vault: Address,
  collection: Address,
  tokenId: BigInt,
): string {
  return [vault.toHexString(), collection.toHexString(), tokenId.toString()].join('_');
}
