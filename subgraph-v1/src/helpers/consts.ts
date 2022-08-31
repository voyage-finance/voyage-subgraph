export enum Tranche {
  Junior,
  Senior,
}

export const JUNIOR_TRANCHE = 'Junior';
export const SENIOR_TRANCHE = 'Senior';

export function trancheFromString(tranche: string): Tranche {
  if (tranche == JUNIOR_TRANCHE) return Tranche.Junior;
  if (tranche == SENIOR_TRANCHE) return Tranche.Senior;
  throw new Error(`Unable to convert unknown string to Tranche: ${tranche}`);
}

export function trancheToString(tranche: Tranche): string {
  switch (tranche) {
    case Tranche.Junior:
      return JUNIOR_TRANCHE;
    case Tranche.Senior:
      return SENIOR_TRANCHE;
    default:
      throw new Error(`Unable to convert unknown tranche to string: ${tranche}`);
  }
}
