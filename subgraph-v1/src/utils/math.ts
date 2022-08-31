// see https://github.dev/aave/protocol-subgraphs/blob/main/src/mapping/lending-pool/v3.ts
import { BigInt, BigDecimal, Bytes } from '@graphprotocol/graph-ts';
import { OwnershipTransferred } from '../../generated/Voyage/Voyage';

let RAY = BigInt.fromI32(10).pow(27);
let WAD_RAY_RATIO = BigInt.fromI32(10).pow(9);
let WAD = BigInt.fromI32(10).pow(18);
let halfRAY = RAY.div(BigInt.fromI32(2));
let halfWAD = WAD.div(BigInt.fromI32(2));
let WAD_PERCENT_RATIO = BigInt.fromI32(10).pow(14);
export let PERCENT = BigInt.fromI32(10).pow(4);
let halfPERCENT = PERCENT.div(BigInt.fromI32(2));

export const MAX_U64_BI = BigInt.fromU64(U64.MAX_VALUE);

export function rayToWad(a: BigInt): BigInt {
  let halfRatio = WAD_RAY_RATIO.div(BigInt.fromI32(2));
  return halfRatio.plus(a).div(WAD_RAY_RATIO);
}

export function wadToRay(a: BigInt): BigInt {
  let result = a.times(WAD_RAY_RATIO);
  return result;
}

export function wadToPercent(a: BigInt): BigInt {
  let halfRatio = WAD_PERCENT_RATIO.div(BigInt.fromI32(2));
  return halfRatio.plus(a).div(WAD_PERCENT_RATIO);
}

export function wadDiv(a: BigInt, b: BigInt): BigInt {
  let halfB = b.div(BigInt.fromI32(2));
  let result = a.times(WAD);
  result = result.plus(halfB);
  let division = result.div(b);
  return division;
}

export function wadMul(a: BigInt, b: BigInt): BigInt {
  let result = a.times(b);
  result = result.plus(halfWAD);
  let mult = result.div(WAD);
  return mult;
}

export function rayDiv(a: BigInt, b: BigInt): BigInt {
  let halfB = b.div(BigInt.fromI32(2));
  let result = a.times(RAY);
  result = result.plus(halfB);
  let division = result.div(b);
  return division;
}

export function rayMul(a: BigInt, b: BigInt): BigInt {
  let result = a.times(b);
  result = result.plus(halfRAY);
  let mult = result.div(RAY);
  return mult;
}

export function percentMul(a: BigInt, b: BigInt): BigInt {
  let result = a.times(b);
  result = result.plus(halfPERCENT);
  return result.div(PERCENT);
}

export function percentDiv(a: BigInt, b: BigInt): BigInt {
  let halfB = b.div(BigInt.fromI32(2));
  let result = a.times(PERCENT);
  result = result.plus(halfB);
  return result.div(b);
}

export function zeroBD(): BigDecimal {
  return BigDecimal.fromString('0');
}

export function zeroBI(): BigInt {
  return BigInt.fromI32(0);
}

export function zeroAddress(): Bytes {
  return Bytes.fromHexString('0x0000000000000000000000000000000000000000') as Bytes;
}
