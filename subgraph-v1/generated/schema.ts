// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Market extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Market entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Market must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Market", id.toString(), this);
    }
  }

  static load(id: string): Market | null {
    return changetype<Market | null>(store.get("Market", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get reserves(): Array<string> {
    let value = this.get("reserves");
    return value!.toStringArray();
  }

  set reserves(value: Array<string>) {
    this.set("reserves", Value.fromStringArray(value));
  }

  get protocolFee(): BigInt {
    let value = this.get("protocolFee");
    return value!.toBigInt();
  }

  set protocolFee(value: BigInt) {
    this.set("protocolFee", Value.fromBigInt(value));
  }

  get protocolTreasury(): Bytes {
    let value = this.get("protocolTreasury");
    return value!.toBytes();
  }

  set protocolTreasury(value: Bytes) {
    this.set("protocolTreasury", Value.fromBytes(value));
  }
}

export class Reserve extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Reserve entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Reserve must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Reserve", id.toString(), this);
    }
  }

  static load(id: string): Reserve | null {
    return changetype<Reserve | null>(store.get("Reserve", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get market(): string {
    let value = this.get("market");
    return value!.toString();
  }

  set market(value: string) {
    this.set("market", Value.fromString(value));
  }

  get collection(): Bytes {
    let value = this.get("collection");
    return value!.toBytes();
  }

  set collection(value: Bytes) {
    this.set("collection", Value.fromBytes(value));
  }

  get currency(): string {
    let value = this.get("currency");
    return value!.toString();
  }

  set currency(value: string) {
    this.set("currency", Value.fromString(value));
  }

  get configuration(): string | null {
    let value = this.get("configuration");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set configuration(value: string | null) {
    if (!value) {
      this.unset("configuration");
    } else {
      this.set("configuration", Value.fromString(<string>value));
    }
  }

  get totalPrincipal(): BigInt {
    let value = this.get("totalPrincipal");
    return value!.toBigInt();
  }

  set totalPrincipal(value: BigInt) {
    this.set("totalPrincipal", Value.fromBigInt(value));
  }

  get totalInterest(): BigInt {
    let value = this.get("totalInterest");
    return value!.toBigInt();
  }

  set totalInterest(value: BigInt) {
    this.set("totalInterest", Value.fromBigInt(value));
  }

  get totalBorrow(): BigInt {
    let value = this.get("totalBorrow");
    return value!.toBigInt();
  }

  set totalBorrow(value: BigInt) {
    this.set("totalBorrow", Value.fromBigInt(value));
  }

  get availableLiquidity(): BigInt {
    let value = this.get("availableLiquidity");
    return value!.toBigInt();
  }

  set availableLiquidity(value: BigInt) {
    this.set("availableLiquidity", Value.fromBigInt(value));
  }

  get totalLiquidity(): BigInt {
    let value = this.get("totalLiquidity");
    return value!.toBigInt();
  }

  set totalLiquidity(value: BigInt) {
    this.set("totalLiquidity", Value.fromBigInt(value));
  }

  get liquidityRatio(): BigInt {
    let value = this.get("liquidityRatio");
    return value!.toBigInt();
  }

  set liquidityRatio(value: BigInt) {
    this.set("liquidityRatio", Value.fromBigInt(value));
  }

  get utilizationRate(): BigInt {
    let value = this.get("utilizationRate");
    return value!.toBigInt();
  }

  set utilizationRate(value: BigInt) {
    this.set("utilizationRate", Value.fromBigInt(value));
  }

  get borrowRate(): BigInt {
    let value = this.get("borrowRate");
    return value!.toBigInt();
  }

  set borrowRate(value: BigInt) {
    this.set("borrowRate", Value.fromBigInt(value));
  }

  get depositRate(): BigInt {
    let value = this.get("depositRate");
    return value!.toBigInt();
  }

  set depositRate(value: BigInt) {
    this.set("depositRate", Value.fromBigInt(value));
  }

  get seniorTrancheVToken(): string {
    let value = this.get("seniorTrancheVToken");
    return value!.toString();
  }

  set seniorTrancheVToken(value: string) {
    this.set("seniorTrancheVToken", Value.fromString(value));
  }

  get seniorTrancheLiquidity(): BigInt {
    let value = this.get("seniorTrancheLiquidity");
    return value!.toBigInt();
  }

  set seniorTrancheLiquidity(value: BigInt) {
    this.set("seniorTrancheLiquidity", Value.fromBigInt(value));
  }

  get seniorTrancheDepositRate(): BigInt {
    let value = this.get("seniorTrancheDepositRate");
    return value!.toBigInt();
  }

  set seniorTrancheDepositRate(value: BigInt) {
    this.set("seniorTrancheDepositRate", Value.fromBigInt(value));
  }

  get juniorTrancheVToken(): string {
    let value = this.get("juniorTrancheVToken");
    return value!.toString();
  }

  set juniorTrancheVToken(value: string) {
    this.set("juniorTrancheVToken", Value.fromString(value));
  }

  get juniorTrancheLiquidity(): BigInt {
    let value = this.get("juniorTrancheLiquidity");
    return value!.toBigInt();
  }

  set juniorTrancheLiquidity(value: BigInt) {
    this.set("juniorTrancheLiquidity", Value.fromBigInt(value));
  }

  get juniorTrancheDepositRate(): BigInt {
    let value = this.get("juniorTrancheDepositRate");
    return value!.toBigInt();
  }

  set juniorTrancheDepositRate(value: BigInt) {
    this.set("juniorTrancheDepositRate", Value.fromBigInt(value));
  }

  get userDeposits(): Array<string> {
    let value = this.get("userDeposits");
    return value!.toStringArray();
  }

  set userDeposits(value: Array<string>) {
    this.set("userDeposits", Value.fromStringArray(value));
  }
}

export class ReserveConfiguration extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ReserveConfiguration entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ReserveConfiguration must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("ReserveConfiguration", id.toString(), this);
    }
  }

  static load(id: string): ReserveConfiguration | null {
    return changetype<ReserveConfiguration | null>(
      store.get("ReserveConfiguration", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get reserve(): string {
    let value = this.get("reserve");
    return value!.toString();
  }

  set reserve(value: string) {
    this.set("reserve", Value.fromString(value));
  }

  get isInitialized(): boolean {
    let value = this.get("isInitialized");
    return value!.toBoolean();
  }

  set isInitialized(value: boolean) {
    this.set("isInitialized", Value.fromBoolean(value));
  }

  get isActive(): boolean {
    let value = this.get("isActive");
    return value!.toBoolean();
  }

  set isActive(value: boolean) {
    this.set("isActive", Value.fromBoolean(value));
  }

  get incomeRatio(): BigInt {
    let value = this.get("incomeRatio");
    return value!.toBigInt();
  }

  set incomeRatio(value: BigInt) {
    this.set("incomeRatio", Value.fromBigInt(value));
  }

  get loanInterval(): BigInt {
    let value = this.get("loanInterval");
    return value!.toBigInt();
  }

  set loanInterval(value: BigInt) {
    this.set("loanInterval", Value.fromBigInt(value));
  }

  get loanTenure(): BigInt {
    let value = this.get("loanTenure");
    return value!.toBigInt();
  }

  set loanTenure(value: BigInt) {
    this.set("loanTenure", Value.fromBigInt(value));
  }

  get gracePeriod(): BigInt {
    let value = this.get("gracePeriod");
    return value!.toBigInt();
  }

  set gracePeriod(value: BigInt) {
    this.set("gracePeriod", Value.fromBigInt(value));
  }

  get liquidationBonus(): BigInt {
    let value = this.get("liquidationBonus");
    return value!.toBigInt();
  }

  set liquidationBonus(value: BigInt) {
    this.set("liquidationBonus", Value.fromBigInt(value));
  }
}

export class Currency extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Currency entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Currency must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Currency", id.toString(), this);
    }
  }

  static load(id: string): Currency | null {
    return changetype<Currency | null>(store.get("Currency", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value!.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get decimals(): BigInt {
    let value = this.get("decimals");
    return value!.toBigInt();
  }

  set decimals(value: BigInt) {
    this.set("decimals", Value.fromBigInt(value));
  }
}

export class VToken extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save VToken entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type VToken must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("VToken", id.toString(), this);
    }
  }

  static load(id: string): VToken | null {
    return changetype<VToken | null>(store.get("VToken", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get reserve(): string {
    let value = this.get("reserve");
    return value!.toString();
  }

  set reserve(value: string) {
    this.set("reserve", Value.fromString(value));
  }

  get tranche(): string {
    let value = this.get("tranche");
    return value!.toString();
  }

  set tranche(value: string) {
    this.set("tranche", Value.fromString(value));
  }

  get asset(): string {
    let value = this.get("asset");
    return value!.toString();
  }

  set asset(value: string) {
    this.set("asset", Value.fromString(value));
  }

  get totalAssets(): BigInt {
    let value = this.get("totalAssets");
    return value!.toBigInt();
  }

  set totalAssets(value: BigInt) {
    this.set("totalAssets", Value.fromBigInt(value));
  }

  get totalShares(): BigInt {
    let value = this.get("totalShares");
    return value!.toBigInt();
  }

  set totalShares(value: BigInt) {
    this.set("totalShares", Value.fromBigInt(value));
  }
}

export class UserData extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save UserData entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type UserData must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("UserData", id.toString(), this);
    }
  }

  static load(id: string): UserData | null {
    return changetype<UserData | null>(store.get("UserData", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get deposits(): Array<string> {
    let value = this.get("deposits");
    return value!.toStringArray();
  }

  set deposits(value: Array<string>) {
    this.set("deposits", Value.fromStringArray(value));
  }

  get unbonding(): Array<string> {
    let value = this.get("unbonding");
    return value!.toStringArray();
  }

  set unbonding(value: Array<string>) {
    this.set("unbonding", Value.fromStringArray(value));
  }
}

export class UserDepositData extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save UserDepositData entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type UserDepositData must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("UserDepositData", id.toString(), this);
    }
  }

  static load(id: string): UserDepositData | null {
    return changetype<UserDepositData | null>(store.get("UserDepositData", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get user(): string {
    let value = this.get("user");
    return value!.toString();
  }

  set user(value: string) {
    this.set("user", Value.fromString(value));
  }

  get reserve(): string {
    let value = this.get("reserve");
    return value!.toString();
  }

  set reserve(value: string) {
    this.set("reserve", Value.fromString(value));
  }

  get juniorTrancheShares(): BigInt {
    let value = this.get("juniorTrancheShares");
    return value!.toBigInt();
  }

  set juniorTrancheShares(value: BigInt) {
    this.set("juniorTrancheShares", Value.fromBigInt(value));
  }

  get juniorTrancheCumulativeDeposits(): BigInt {
    let value = this.get("juniorTrancheCumulativeDeposits");
    return value!.toBigInt();
  }

  set juniorTrancheCumulativeDeposits(value: BigInt) {
    this.set("juniorTrancheCumulativeDeposits", Value.fromBigInt(value));
  }

  get juniorTrancheCumulativeWithdrawals(): BigInt {
    let value = this.get("juniorTrancheCumulativeWithdrawals");
    return value!.toBigInt();
  }

  set juniorTrancheCumulativeWithdrawals(value: BigInt) {
    this.set("juniorTrancheCumulativeWithdrawals", Value.fromBigInt(value));
  }

  get seniorTrancheShares(): BigInt {
    let value = this.get("seniorTrancheShares");
    return value!.toBigInt();
  }

  set seniorTrancheShares(value: BigInt) {
    this.set("seniorTrancheShares", Value.fromBigInt(value));
  }

  get seniorTrancheCumulativeDeposits(): BigInt {
    let value = this.get("seniorTrancheCumulativeDeposits");
    return value!.toBigInt();
  }

  set seniorTrancheCumulativeDeposits(value: BigInt) {
    this.set("seniorTrancheCumulativeDeposits", Value.fromBigInt(value));
  }

  get seniorTrancheCumulativeWithdrawals(): BigInt {
    let value = this.get("seniorTrancheCumulativeWithdrawals");
    return value!.toBigInt();
  }

  set seniorTrancheCumulativeWithdrawals(value: BigInt) {
    this.set("seniorTrancheCumulativeWithdrawals", Value.fromBigInt(value));
  }
}

export class UserUnbondingData extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save UserUnbondingData entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type UserUnbondingData must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("UserUnbondingData", id.toString(), this);
    }
  }

  static load(id: string): UserUnbondingData | null {
    return changetype<UserUnbondingData | null>(
      store.get("UserUnbondingData", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get time(): BigInt {
    let value = this.get("time");
    return value!.toBigInt();
  }

  set time(value: BigInt) {
    this.set("time", Value.fromBigInt(value));
  }

  get collection(): Bytes {
    let value = this.get("collection");
    return value!.toBytes();
  }

  set collection(value: Bytes) {
    this.set("collection", Value.fromBytes(value));
  }

  get blocknum(): BigInt {
    let value = this.get("blocknum");
    return value!.toBigInt();
  }

  set blocknum(value: BigInt) {
    this.set("blocknum", Value.fromBigInt(value));
  }

  get shares(): BigInt {
    let value = this.get("shares");
    return value!.toBigInt();
  }

  set shares(value: BigInt) {
    this.set("shares", Value.fromBigInt(value));
  }

  get maxUnderlying(): BigInt {
    let value = this.get("maxUnderlying");
    return value!.toBigInt();
  }

  set maxUnderlying(value: BigInt) {
    this.set("maxUnderlying", Value.fromBigInt(value));
  }

  get user(): string {
    let value = this.get("user");
    return value!.toString();
  }

  set user(value: string) {
    this.set("user", Value.fromString(value));
  }
}

export class Vault extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Vault entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Vault must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Vault", id.toString(), this);
    }
  }

  static load(id: string): Vault | null {
    return changetype<Vault | null>(store.get("Vault", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get signer(): Bytes {
    let value = this.get("signer");
    return value!.toBytes();
  }

  set signer(value: Bytes) {
    this.set("signer", Value.fromBytes(value));
  }

  get loans(): Array<string> {
    let value = this.get("loans");
    return value!.toStringArray();
  }

  set loans(value: Array<string>) {
    this.set("loans", Value.fromStringArray(value));
  }

  get assets(): Array<string> {
    let value = this.get("assets");
    return value!.toStringArray();
  }

  set assets(value: Array<string>) {
    this.set("assets", Value.fromStringArray(value));
  }
}

export class Asset extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Asset entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Asset must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Asset", id.toString(), this);
    }
  }

  static load(id: string): Asset | null {
    return changetype<Asset | null>(store.get("Asset", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get vault(): string {
    let value = this.get("vault");
    return value!.toString();
  }

  set vault(value: string) {
    this.set("vault", Value.fromString(value));
  }

  get loan(): string {
    let value = this.get("loan");
    return value!.toString();
  }

  set loan(value: string) {
    this.set("loan", Value.fromString(value));
  }

  get collection(): Bytes {
    let value = this.get("collection");
    return value!.toBytes();
  }

  set collection(value: Bytes) {
    this.set("collection", Value.fromBytes(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    return value!.toBigInt();
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get isUnderLien(): boolean {
    let value = this.get("isUnderLien");
    return value!.toBoolean();
  }

  set isUnderLien(value: boolean) {
    this.set("isUnderLien", Value.fromBoolean(value));
  }

  get isLiquidated(): boolean {
    let value = this.get("isLiquidated");
    return value!.toBoolean();
  }

  set isLiquidated(value: boolean) {
    this.set("isLiquidated", Value.fromBoolean(value));
  }
}

export class Loan extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Loan entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Loan must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Loan", id.toString(), this);
    }
  }

  static load(id: string): Loan | null {
    return changetype<Loan | null>(store.get("Loan", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get reserve(): string {
    let value = this.get("reserve");
    return value!.toString();
  }

  set reserve(value: string) {
    this.set("reserve", Value.fromString(value));
  }

  get vault(): string {
    let value = this.get("vault");
    return value!.toString();
  }

  set vault(value: string) {
    this.set("vault", Value.fromString(value));
  }

  get loanId(): BigInt {
    let value = this.get("loanId");
    return value!.toBigInt();
  }

  set loanId(value: BigInt) {
    this.set("loanId", Value.fromBigInt(value));
  }

  get collateral(): string | null {
    let value = this.get("collateral");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set collateral(value: string | null) {
    if (!value) {
      this.unset("collateral");
    } else {
      this.set("collateral", Value.fromString(<string>value));
    }
  }

  get principal(): BigInt {
    let value = this.get("principal");
    return value!.toBigInt();
  }

  set principal(value: BigInt) {
    this.set("principal", Value.fromBigInt(value));
  }

  get interest(): BigInt {
    let value = this.get("interest");
    return value!.toBigInt();
  }

  set interest(value: BigInt) {
    this.set("interest", Value.fromBigInt(value));
  }

  get protocolFee(): BigInt {
    let value = this.get("protocolFee");
    return value!.toBigInt();
  }

  set protocolFee(value: BigInt) {
    this.set("protocolFee", Value.fromBigInt(value));
  }

  get pmt_principal(): BigInt {
    let value = this.get("pmt_principal");
    return value!.toBigInt();
  }

  set pmt_principal(value: BigInt) {
    this.set("pmt_principal", Value.fromBigInt(value));
  }

  get pmt_interest(): BigInt {
    let value = this.get("pmt_interest");
    return value!.toBigInt();
  }

  set pmt_interest(value: BigInt) {
    this.set("pmt_interest", Value.fromBigInt(value));
  }

  get pmt_fee(): BigInt {
    let value = this.get("pmt_fee");
    return value!.toBigInt();
  }

  set pmt_fee(value: BigInt) {
    this.set("pmt_fee", Value.fromBigInt(value));
  }

  get pmt_payment(): BigInt {
    let value = this.get("pmt_payment");
    return value!.toBigInt();
  }

  set pmt_payment(value: BigInt) {
    this.set("pmt_payment", Value.fromBigInt(value));
  }

  get term(): BigInt {
    let value = this.get("term");
    return value!.toBigInt();
  }

  set term(value: BigInt) {
    this.set("term", Value.fromBigInt(value));
  }

  get epoch(): BigInt {
    let value = this.get("epoch");
    return value!.toBigInt();
  }

  set epoch(value: BigInt) {
    this.set("epoch", Value.fromBigInt(value));
  }

  get nper(): BigInt {
    let value = this.get("nper");
    return value!.toBigInt();
  }

  set nper(value: BigInt) {
    this.set("nper", Value.fromBigInt(value));
  }

  get apr(): BigInt {
    let value = this.get("apr");
    return value!.toBigInt();
  }

  set apr(value: BigInt) {
    this.set("apr", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get nextPaymentDue(): BigInt {
    let value = this.get("nextPaymentDue");
    return value!.toBigInt();
  }

  set nextPaymentDue(value: BigInt) {
    this.set("nextPaymentDue", Value.fromBigInt(value));
  }

  get totalPrincipalPaid(): BigInt {
    let value = this.get("totalPrincipalPaid");
    return value!.toBigInt();
  }

  set totalPrincipalPaid(value: BigInt) {
    this.set("totalPrincipalPaid", Value.fromBigInt(value));
  }

  get totalInterestPaid(): BigInt {
    let value = this.get("totalInterestPaid");
    return value!.toBigInt();
  }

  set totalInterestPaid(value: BigInt) {
    this.set("totalInterestPaid", Value.fromBigInt(value));
  }

  get paidTimes(): BigInt {
    let value = this.get("paidTimes");
    return value!.toBigInt();
  }

  set paidTimes(value: BigInt) {
    this.set("paidTimes", Value.fromBigInt(value));
  }

  get closed(): boolean {
    let value = this.get("closed");
    return value!.toBoolean();
  }

  set closed(value: boolean) {
    this.set("closed", Value.fromBoolean(value));
  }

  get repayments(): Array<string> {
    let value = this.get("repayments");
    return value!.toStringArray();
  }

  set repayments(value: Array<string>) {
    this.set("repayments", Value.fromStringArray(value));
  }

  get liquidation(): string | null {
    let value = this.get("liquidation");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set liquidation(value: string | null) {
    if (!value) {
      this.unset("liquidation");
    } else {
      this.set("liquidation", Value.fromString(<string>value));
    }
  }
}

export class Repayment extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Repayment entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Repayment must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Repayment", id.toString(), this);
    }
  }

  static load(id: string): Repayment | null {
    return changetype<Repayment | null>(store.get("Repayment", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get loan(): string {
    let value = this.get("loan");
    return value!.toString();
  }

  set loan(value: string) {
    this.set("loan", Value.fromString(value));
  }

  get principal(): BigInt {
    let value = this.get("principal");
    return value!.toBigInt();
  }

  set principal(value: BigInt) {
    this.set("principal", Value.fromBigInt(value));
  }

  get interest(): BigInt {
    let value = this.get("interest");
    return value!.toBigInt();
  }

  set interest(value: BigInt) {
    this.set("interest", Value.fromBigInt(value));
  }

  get fee(): BigInt {
    let value = this.get("fee");
    return value!.toBigInt();
  }

  set fee(value: BigInt) {
    this.set("fee", Value.fromBigInt(value));
  }

  get total(): BigInt {
    let value = this.get("total");
    return value!.toBigInt();
  }

  set total(value: BigInt) {
    this.set("total", Value.fromBigInt(value));
  }

  get paidAt(): BigInt {
    let value = this.get("paidAt");
    return value!.toBigInt();
  }

  set paidAt(value: BigInt) {
    this.set("paidAt", Value.fromBigInt(value));
  }

  get isFinal(): boolean {
    let value = this.get("isFinal");
    return value!.toBoolean();
  }

  set isFinal(value: boolean) {
    this.set("isFinal", Value.fromBoolean(value));
  }

  get liquidation(): string | null {
    let value = this.get("liquidation");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set liquidation(value: string | null) {
    if (!value) {
      this.unset("liquidation");
    } else {
      this.set("liquidation", Value.fromString(<string>value));
    }
  }

  get txHash(): Bytes {
    let value = this.get("txHash");
    return value!.toBytes();
  }

  set txHash(value: Bytes) {
    this.set("txHash", Value.fromBytes(value));
  }
}

export class Liquidation extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Liquidation entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Liquidation must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Liquidation", id.toString(), this);
    }
  }

  static load(id: string): Liquidation | null {
    return changetype<Liquidation | null>(store.get("Liquidation", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get vault(): string {
    let value = this.get("vault");
    return value!.toString();
  }

  set vault(value: string) {
    this.set("vault", Value.fromString(value));
  }

  get loan(): string {
    let value = this.get("loan");
    return value!.toString();
  }

  set loan(value: string) {
    this.set("loan", Value.fromString(value));
  }

  get liquidator(): string {
    let value = this.get("liquidator");
    return value!.toString();
  }

  set liquidator(value: string) {
    this.set("liquidator", Value.fromString(value));
  }

  get repaymentId(): BigInt {
    let value = this.get("repaymentId");
    return value!.toBigInt();
  }

  set repaymentId(value: BigInt) {
    this.set("repaymentId", Value.fromBigInt(value));
  }

  get repayment(): string {
    let value = this.get("repayment");
    return value!.toString();
  }

  set repayment(value: string) {
    this.set("repayment", Value.fromString(value));
  }

  get totalDebt(): BigInt {
    let value = this.get("totalDebt");
    return value!.toBigInt();
  }

  set totalDebt(value: BigInt) {
    this.set("totalDebt", Value.fromBigInt(value));
  }

  get amountToWriteDown(): BigInt {
    let value = this.get("amountToWriteDown");
    return value!.toBigInt();
  }

  set amountToWriteDown(value: BigInt) {
    this.set("amountToWriteDown", Value.fromBigInt(value));
  }
}

export class BuyNowTransaction extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save BuyNowTransaction entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type BuyNowTransaction must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("BuyNowTransaction", id.toString(), this);
    }
  }

  static load(id: string): BuyNowTransaction | null {
    return changetype<BuyNowTransaction | null>(
      store.get("BuyNowTransaction", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    return value!.toBigInt();
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get collection(): Bytes {
    let value = this.get("collection");
    return value!.toBytes();
  }

  set collection(value: Bytes) {
    this.set("collection", Value.fromBytes(value));
  }

  get vault(): Bytes {
    let value = this.get("vault");
    return value!.toBytes();
  }

  set vault(value: Bytes) {
    this.set("vault", Value.fromBytes(value));
  }

  get txHash(): Bytes {
    let value = this.get("txHash");
    return value!.toBytes();
  }

  set txHash(value: Bytes) {
    this.set("txHash", Value.fromBytes(value));
  }

  get marketplace(): Bytes {
    let value = this.get("marketplace");
    return value!.toBytes();
  }

  set marketplace(value: Bytes) {
    this.set("marketplace", Value.fromBytes(value));
  }
}
