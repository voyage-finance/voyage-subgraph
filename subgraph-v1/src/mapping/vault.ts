import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { CreditLine, Loan, Repayment, Vault } from "../../generated/schema";
import {
  VaultCreated,
  VaultCreditLineInitialized,
  Voyage,
} from "../../generated/Voyage/Voyage";
import { getCreditLineEntityId } from "../utils/id";
import { zeroBI } from "../utils/math";

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
  log.info("-- handleVaultCreated ---", []);
  createVault(event.params._vault, event.params._owner);
}

export function handleCreditLineInitialised(evt: VaultCreditLineInitialized) {
  const { _vault, _asset } = evt.params;
  const { vaultConfig, vaultState } = getVaultState(
    _vault,
    _asset,
    evt.address
  );

  const creditLineId = getCreditLineEntityId(
    evt.params._vault,
    evt.params._asset
  );
  const creditLine = new CreditLine(creditLineId);

  creditLine.marginEscrow = evt.params._me;
  creditLine.creditEscrow = evt.params._ce;
  creditLine.borrowRate = zeroBI();
  creditLine.totalDebt = zeroBI();
  creditLine.totalMargin = zeroBI();
  creditLine.marginRequirement = vaultConfig.marginRequirement;
  creditLine.withdrawableSecurityDeposit =
    vaultState.withdrawableSecurityDeposit;
  creditLine.creditLimit = vaultState.creditLimit;
  creditLine.spendableBalance = vaultState.spendableBalance;
  creditLine.gav = vaultState.gav;
  creditLine.ltv = vaultState.ltv;
  creditLine.healthFactor = vaultState.healthFactor;

  creditLine.save();
}

/**
 * Updates credit line state when margin is credited or redeemed.
 * Called for:
 * - VaultMarginCredited
 * - VaultMarginRedeemed
 * @param _vaultAddress - the vault which emitted the event
 * @param _assetAddress - the underlying asset
 * @param _eventAddress - Voyage diamond address
 * @returns
 */
export function handleMarginEvent(
  _vaultAddress: Address,
  _assetAddress: Address,
  _eventAddress: Address
) {
  const vaultAddress = _vaultAddress.toHex();
  const assetAddress = _assetAddress.toHex();
  let vaultEntity = Vault.load(vaultAddress);
  if (!vaultEntity) {
    vaultEntity = new Vault(vaultAddress);
  }

  const creditLineId = getCreditLineEntityId(_vaultAddress, _assetAddress);
  const creditLine = CreditLine.load(creditLineId);
  if (!creditLine) {
    // Should not happen, since a credit line should exist in order for a margin deposit to happen.
    log.error(
      "tried to handle margin event for a non-existent credit line. vault: {} asset: {}",
      [vaultAddress, assetAddress]
    );
    return;
  }

  const voyage = Voyage.bind(_eventAddress);
  const vaultData = voyage.getCreditLineData(_vaultAddress, _assetAddress);
  const vaultConfigData = voyage.getVaultConfig(_assetAddress, _vaultAddress);

  // TODO: compute the weighted average interest rate of draw downs
  // creditLine.borrowRate = vaultData.borrowRate;
  creditLine.totalDebt = vaultData.totalDebt;
  creditLine.totalMargin = vaultData.totalMargin;
  creditLine.marginRequirement = vaultConfigData.marginRequirement;
  creditLine.withdrawableSecurityDeposit =
    vaultData.withdrawableSecurityDeposit;
  creditLine.creditLimit = vaultData.creditLimit;
  creditLine.spendableBalance = vaultData.spendableBalance;
  creditLine.gav = vaultData.gav;
  creditLine.ltv = vaultData.ltv;
  creditLine.healthFactor = vaultData.healthFactor;
  creditLine.save();
}

/**
 * Called for:
 * - Borrow
 * - Repay
 * @param _vaultAddress - the vault which emitted the event
 * @param _assetAddress - the underlying asset
 * @param _eventAddress - Voyage diamond address
 * @returns
 */
export function handleLoanEvent(
  _vaultAddress: Address,
  _assetAddress: Address,
  _eventAddress: Address
) {
  const voyage = Voyage.bind(_eventAddress);
  const vaultAddress = _vaultAddress.toHex();
  const { vaultState } = getVaultState(
    _vaultAddress,
    _assetAddress,
    _eventAddress
  );
  // Update loans
  var loanEntity: Loan;
  for (
    let i = vaultState.loanList.head.toI32();
    i < vaultState.loanList.tail.toI32();
    i++
  ) {
    const loan = voyage.getLoanDetail(
      _vaultAddress,
      _assetAddress,
      BigInt.fromI32(i)
    );
    const loanId = [vaultAddress, _assetAddress.toHex(), i.toString()].join(
      "_"
    );
    const _loanEntity = Loan.load(loanId);
    loanEntity = _loanEntity ? _loanEntity : new Loan(loanId);
    loanEntity.vault = vaultAddress;
    loanEntity.principal = loan.principal;
    loanEntity.pmt_principal = loan.pmt.principal;
    loanEntity.pmt_interest = loan.pmt.interest;
    loanEntity.pmt_payment = loan.pmt.pmt;
    loanEntity.term = loan.term;
    loanEntity.epoch = loan.epoch;
    loanEntity.nper = loan.nper;
    loanEntity.apr = loan.apr;
    loanEntity.borrowAt = loan.borrowAt;
    loanEntity.nextPaymentDue = loan.nextPaymentDue;
    loanEntity.totalPrincipalPaid = loan.totalPrincipalPaid;
    loanEntity.totalInterestPaid = loan.totalInterestPaid;
    loanEntity.paidTimes = loan.paidTimes;

    var repaymentEntity: Repayment;
    const repayments = voyage.getRepayment(
      _vaultAddress,
      _assetAddress,
      BigInt.fromI32(i)
    );
    for (let j = 0; j < repayments.length; j++) {
      const repaymentId = [loanId, j.toString()].join("_");
      const _repaymentEntity = Repayment.load(repaymentId);
      repaymentEntity = _repaymentEntity
        ? _repaymentEntity
        : new Repayment(repaymentId);
      repaymentEntity.loan = loanEntity.id;
      const repayment = repayments.at(j);
      repaymentEntity.principal = repayment.principal;
      repaymentEntity.interest = repayment.interest;
      repaymentEntity.total = repayment.total;
      repaymentEntity.paidAt = repayment.paidAt;
      repaymentEntity.isLiquidated = repayment.isLiquidated;
      repaymentEntity.save();
    }

    loanEntity.save();
  }
}

function getVaultState(
  vaultAddress: Address,
  assetAddress: Address,
  voyageAddress: Address
) {
  const voyage = Voyage.bind(voyageAddress);
  const vaultConfig = voyage.getVaultConfig(assetAddress, vaultAddress);
  const vaultState = voyage.getCreditLineData(vaultAddress, assetAddress);
  return { vaultConfig, vaultState };
}
