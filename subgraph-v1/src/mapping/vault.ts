import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Loan, Repayment, Vault } from "../../generated/schema";
import {
  VaultCreated,
  Voyage,
  Voyage__getCreditLineDataResultValue0Struct,
} from "../../generated/Voyage/Voyage";

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
): void {
  const voyage = Voyage.bind(_eventAddress);
  const vaultAddress = _vaultAddress.toHex();
  const vaultInfo = getVaultState(_vaultAddress, _assetAddress, _eventAddress);
  const vaultState = vaultInfo.vaultState;
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

class IVaultState {
  vaultState: Voyage__getCreditLineDataResultValue0Struct;
}

function getVaultState(
  vaultAddress: Address,
  collection: Address,
  voyageAddress: Address
): IVaultState {
  const voyage = Voyage.bind(voyageAddress);
  // const vaultConfig = voyage.getVaultConfig(collection, vaultAddress);
  const vaultState = voyage.getCreditLineData(vaultAddress, collection);
  // todo-refactor
  return { vaultState };
}
