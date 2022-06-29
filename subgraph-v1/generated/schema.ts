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

export class PoolConfiguration extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save PoolConfiguration entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type PoolConfiguration must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("PoolConfiguration", id.toString(), this);
    }
  }

  static load(id: string): PoolConfiguration | null {
    return changetype<PoolConfiguration | null>(
      store.get("PoolConfiguration", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get pool(): string {
    let value = this.get("pool");
    return value!.toString();
  }

  set pool(value: string) {
    this.set("pool", Value.fromString(value));
  }

  get marginRequirement(): BigInt {
    let value = this.get("marginRequirement");
    return value!.toBigInt();
  }

  set marginRequirement(value: BigInt) {
    this.set("marginRequirement", Value.fromBigInt(value));
  }

  get marginMin(): BigInt {
    let value = this.get("marginMin");
    return value!.toBigInt();
  }

  set marginMin(value: BigInt) {
    this.set("marginMin", Value.fromBigInt(value));
  }

  get marginMax(): BigInt {
    let value = this.get("marginMax");
    return value!.toBigInt();
  }

  set marginMax(value: BigInt) {
    this.set("marginMax", Value.fromBigInt(value));
  }

  get loanTenure(): BigInt {
    let value = this.get("loanTenure");
    return value!.toBigInt();
  }

  set loanTenure(value: BigInt) {
    this.set("loanTenure", Value.fromBigInt(value));
  }

  get optimalTrancheRatio(): BigInt {
    let value = this.get("optimalTrancheRatio");
    return value!.toBigInt();
  }

  set optimalTrancheRatio(value: BigInt) {
    this.set("optimalTrancheRatio", Value.fromBigInt(value));
  }

  get optimalIncomeRatio(): BigInt {
    let value = this.get("optimalIncomeRatio");
    return value!.toBigInt();
  }

  set optimalIncomeRatio(value: BigInt) {
    this.set("optimalIncomeRatio", Value.fromBigInt(value));
  }
}

export class Pool extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Pool entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Pool must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Pool", id.toString(), this);
    }
  }

  static load(id: string): Pool | null {
    return changetype<Pool | null>(store.get("Pool", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get isActive(): boolean {
    let value = this.get("isActive");
    return value!.toBoolean();
  }

  set isActive(value: boolean) {
    this.set("isActive", Value.fromBoolean(value));
  }

  get underlyingAsset(): Bytes {
    let value = this.get("underlyingAsset");
    return value!.toBytes();
  }

  set underlyingAsset(value: Bytes) {
    this.set("underlyingAsset", Value.fromBytes(value));
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

  get juniorTrancheTotalLiquidity(): BigInt {
    let value = this.get("juniorTrancheTotalLiquidity");
    return value!.toBigInt();
  }

  set juniorTrancheTotalLiquidity(value: BigInt) {
    this.set("juniorTrancheTotalLiquidity", Value.fromBigInt(value));
  }

  get juniorTrancheLiquidityRate(): BigInt {
    let value = this.get("juniorTrancheLiquidityRate");
    return value!.toBigInt();
  }

  set juniorTrancheLiquidityRate(value: BigInt) {
    this.set("juniorTrancheLiquidityRate", Value.fromBigInt(value));
  }

  get seniorTrancheTotalLiquidity(): BigInt {
    let value = this.get("seniorTrancheTotalLiquidity");
    return value!.toBigInt();
  }

  set seniorTrancheTotalLiquidity(value: BigInt) {
    this.set("seniorTrancheTotalLiquidity", Value.fromBigInt(value));
  }

  get seniorTrancheAvailableLiquidity(): BigInt {
    let value = this.get("seniorTrancheAvailableLiquidity");
    return value!.toBigInt();
  }

  set seniorTrancheAvailableLiquidity(value: BigInt) {
    this.set("seniorTrancheAvailableLiquidity", Value.fromBigInt(value));
  }

  get seniorTrancheLiquidityRate(): BigInt {
    let value = this.get("seniorTrancheLiquidityRate");
    return value!.toBigInt();
  }

  set seniorTrancheLiquidityRate(value: BigInt) {
    this.set("seniorTrancheLiquidityRate", Value.fromBigInt(value));
  }

  get totalLiquidity(): BigInt {
    let value = this.get("totalLiquidity");
    return value!.toBigInt();
  }

  set totalLiquidity(value: BigInt) {
    this.set("totalLiquidity", Value.fromBigInt(value));
  }

  get totalBorrow(): BigInt {
    let value = this.get("totalBorrow");
    return value!.toBigInt();
  }

  set totalBorrow(value: BigInt) {
    this.set("totalBorrow", Value.fromBigInt(value));
  }

  get trancheRatio(): BigInt {
    let value = this.get("trancheRatio");
    return value!.toBigInt();
  }

  set trancheRatio(value: BigInt) {
    this.set("trancheRatio", Value.fromBigInt(value));
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

  get depositData(): Array<string> {
    let value = this.get("depositData");
    return value!.toStringArray();
  }

  set depositData(value: Array<string>) {
    this.set("depositData", Value.fromStringArray(value));
  }

  get unbondings(): Array<string> {
    let value = this.get("unbondings");
    return value!.toStringArray();
  }

  set unbondings(value: Array<string>) {
    this.set("unbondings", Value.fromStringArray(value));
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

  get underlyingAsset(): Bytes {
    let value = this.get("underlyingAsset");
    return value!.toBytes();
  }

  set underlyingAsset(value: Bytes) {
    this.set("underlyingAsset", Value.fromBytes(value));
  }

  get juniorTrancheBalance(): BigInt {
    let value = this.get("juniorTrancheBalance");
    return value!.toBigInt();
  }

  set juniorTrancheBalance(value: BigInt) {
    this.set("juniorTrancheBalance", Value.fromBigInt(value));
  }

  get juniorDepositWithdrawalDiff(): BigInt {
    let value = this.get("juniorDepositWithdrawalDiff");
    return value!.toBigInt();
  }

  set juniorDepositWithdrawalDiff(value: BigInt) {
    this.set("juniorDepositWithdrawalDiff", Value.fromBigInt(value));
  }

  get juniorTranchePnl(): BigInt {
    let value = this.get("juniorTranchePnl");
    return value!.toBigInt();
  }

  set juniorTranchePnl(value: BigInt) {
    this.set("juniorTranchePnl", Value.fromBigInt(value));
  }

  get seniorTrancheBalance(): BigInt {
    let value = this.get("seniorTrancheBalance");
    return value!.toBigInt();
  }

  set seniorTrancheBalance(value: BigInt) {
    this.set("seniorTrancheBalance", Value.fromBigInt(value));
  }

  get seniorDepositWithdrawalDiff(): BigInt {
    let value = this.get("seniorDepositWithdrawalDiff");
    return value!.toBigInt();
  }

  set seniorDepositWithdrawalDiff(value: BigInt) {
    this.set("seniorDepositWithdrawalDiff", Value.fromBigInt(value));
  }

  get seniorTranchePnl(): BigInt {
    let value = this.get("seniorTranchePnl");
    return value!.toBigInt();
  }

  set seniorTranchePnl(value: BigInt) {
    this.set("seniorTranchePnl", Value.fromBigInt(value));
  }

  get withdrawableJuniorBalance(): BigInt {
    let value = this.get("withdrawableJuniorBalance");
    return value!.toBigInt();
  }

  set withdrawableJuniorBalance(value: BigInt) {
    this.set("withdrawableJuniorBalance", Value.fromBigInt(value));
  }

  get withdrawableSeniorBalance(): BigInt {
    let value = this.get("withdrawableSeniorBalance");
    return value!.toBigInt();
  }

  set withdrawableSeniorBalance(value: BigInt) {
    this.set("withdrawableSeniorBalance", Value.fromBigInt(value));
  }

  get decimals(): BigInt {
    let value = this.get("decimals");
    return value!.toBigInt();
  }

  set decimals(value: BigInt) {
    this.set("decimals", Value.fromBigInt(value));
  }

  get user(): string {
    let value = this.get("user");
    return value!.toString();
  }

  set user(value: string) {
    this.set("user", Value.fromString(value));
  }
}

export class Unbonding extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Unbonding entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Unbonding must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Unbonding", id.toString(), this);
    }
  }

  static load(id: string): Unbonding | null {
    return changetype<Unbonding | null>(store.get("Unbonding", id));
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

  get amount(): BigInt {
    let value = this.get("amount");
    return value!.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get type(): string {
    let value = this.get("type");
    return value!.toString();
  }

  set type(value: string) {
    this.set("type", Value.fromString(value));
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

  get borrowRate(): BigInt {
    let value = this.get("borrowRate");
    return value!.toBigInt();
  }

  set borrowRate(value: BigInt) {
    this.set("borrowRate", Value.fromBigInt(value));
  }

  get totalDebt(): BigInt {
    let value = this.get("totalDebt");
    return value!.toBigInt();
  }

  set totalDebt(value: BigInt) {
    this.set("totalDebt", Value.fromBigInt(value));
  }

  get drawdowns(): Array<string> {
    let value = this.get("drawdowns");
    return value!.toStringArray();
  }

  set drawdowns(value: Array<string>) {
    this.set("drawdowns", Value.fromStringArray(value));
  }

  get totalMargin(): BigInt {
    let value = this.get("totalMargin");
    return value!.toBigInt();
  }

  set totalMargin(value: BigInt) {
    this.set("totalMargin", Value.fromBigInt(value));
  }

  get withdrawableSecurityDeposit(): BigInt {
    let value = this.get("withdrawableSecurityDeposit");
    return value!.toBigInt();
  }

  set withdrawableSecurityDeposit(value: BigInt) {
    this.set("withdrawableSecurityDeposit", Value.fromBigInt(value));
  }

  get creditLimit(): BigInt {
    let value = this.get("creditLimit");
    return value!.toBigInt();
  }

  set creditLimit(value: BigInt) {
    this.set("creditLimit", Value.fromBigInt(value));
  }

  get spendableBalance(): BigInt {
    let value = this.get("spendableBalance");
    return value!.toBigInt();
  }

  set spendableBalance(value: BigInt) {
    this.set("spendableBalance", Value.fromBigInt(value));
  }

  get gav(): BigInt {
    let value = this.get("gav");
    return value!.toBigInt();
  }

  set gav(value: BigInt) {
    this.set("gav", Value.fromBigInt(value));
  }

  get ltv(): BigInt {
    let value = this.get("ltv");
    return value!.toBigInt();
  }

  set ltv(value: BigInt) {
    this.set("ltv", Value.fromBigInt(value));
  }

  get healthFactor(): BigInt {
    let value = this.get("healthFactor");
    return value!.toBigInt();
  }

  set healthFactor(value: BigInt) {
    this.set("healthFactor", Value.fromBigInt(value));
  }
}

export class Drawdown extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Drawdown entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Drawdown must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Drawdown", id.toString(), this);
    }
  }

  static load(id: string): Drawdown | null {
    return changetype<Drawdown | null>(store.get("Drawdown", id));
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

  get pmt_payment(): BigInt {
    let value = this.get("pmt_payment");
    return value!.toBigInt();
  }

  set pmt_payment(value: BigInt) {
    this.set("pmt_payment", Value.fromBigInt(value));
  }

  get principal(): BigInt {
    let value = this.get("principal");
    return value!.toBigInt();
  }

  set principal(value: BigInt) {
    this.set("principal", Value.fromBigInt(value));
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

  get borrowAt(): BigInt {
    let value = this.get("borrowAt");
    return value!.toBigInt();
  }

  set borrowAt(value: BigInt) {
    this.set("borrowAt", Value.fromBigInt(value));
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
}
