import { Address, BigInt } from "@graphprotocol/graph-ts";

export function getUserDepositDataId(
  userAddress: Address,
  collection: Address
): string {
  return [userAddress.toHex(), collection.toHex()].join("_");
}

export function getLoanEntityId(
  vaultAddress: Address,
  collection: Address,
  loanId: BigInt
): string {
  return [vaultAddress.toHex(), collection.toHex(), loanId.toString()].join(
    "_"
  );
}

export function getUnbondingEntityId(
  user: Address,
  asset: Address,
  timestamp: BigInt
): string {
  return [user.toHex(), asset.toHex(), timestamp.toString()].join("_");
}

export function getCreditLineEntityId(
  vaultAddress: Address,
  collection: Address
): string {
  return [vaultAddress.toHex(), collection.toHex()].join("_");
}

export function getRepaymentEntityId(
  loanId: string,
  repaymentId: BigInt
): string {
  return [loanId, repaymentId.toString()].join("_");
}

export function getCurrencyId(
    address: Address,
    symbol: string,
): string {
  return [address.toHex(), symbol].join("_");
}
