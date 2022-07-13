import { Address, BigInt } from "@graphprotocol/graph-ts";

export function getUserDepositDataId(
  userAddress: Address,
  assetAddress: Address
): string {
  return [userAddress.toHex(), assetAddress.toHex()].join("_");
}

export function getLoanEntityId(
  vaultAddress: Address,
  assetAddress: Address,
  drawdownId: BigInt
): string {
  return [
    vaultAddress.toHex(),
    assetAddress.toHex(),
    drawdownId.toString(),
  ].join("_");
}

export function getUnbondingEntityId(
  user: Address,
  asset: Address,
  timestamp: BigInt
) {
  return [user.toHex(), asset.toHex(), timestamp.toString()].join("_");
}

export function getCreditLineEntityId(
  vaultAddress: Address,
  assetAddress: Address
): string {
  return [vaultAddress.toHex(), assetAddress.toHex()].join("_");
}

export function getRepaymentEntityId(
  drawdownId: string,
  repaymentId: BigInt
): string {
  return [drawdownId, repaymentId.toString()].join("_");
}
