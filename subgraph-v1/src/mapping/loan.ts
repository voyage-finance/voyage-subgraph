import {
  Borrow,
  Liquidate,
  Voyage,
  Repayment as RepaymentEvent,
} from "../../generated/Voyage/Voyage";
import { getLoanEntityId, getRepaymentEntityId } from "../utils/id";
import { getOrInitLoan } from "../helpers/initializers";
import { updateLoanEntity } from "../helpers/updaters";
import { Liquidation, Loan, Repayment } from "../../generated/schema";
import { log } from "@graphprotocol/graph-ts";

export function handleBorrow(event: Borrow): void {
  const loan = getOrInitLoan(
    event.params._vault,
    event.params._asset,
    event.params._loanId
  );
  updateLoanEntity(
    loan,
    event.params._vault,
    event.params._asset,
    event.params._loanId,
    event
  );
  // creditline average borrow rate
  // const total = loan.inte
  loan.save();
}

export function handleRepay(event: RepaymentEvent): void {
  const voyage = Voyage.bind(event.address);
  const loanId = getLoanEntityId(
    event.params._vault,
    event.params._asset,
    event.params._loanId
  );
  const loan = Loan.load(loanId);
  if (!loan) {
    // Should not happen, since a loan should exist in order for a repay to happen.
    log.error(
      "tried to handle repay event for a non-existent loan. vault: {} asset: {} loan: {}",
      [
        event.params._vault.toHex(),
        event.params._asset.toHex(),
        event.params._loanId.toString(),
      ]
    );
    return;
  }
  updateLoanEntity(
    loan!,
    event.params._vault,
    event.params._asset,
    event.params._loanId,
    event
  );
  loan!.save();

  const id = getRepaymentEntityId(loan!.id, event.params._repaymentId);
  const repayment = new Repayment(id);
  repayment.loan = loan!.id;
  repayment.principal = loan!.pmt_principal;
  repayment.interest = loan!.pmt_interest;
  // we cannot use pmt.amount, as this may be a liquidation.
  // in the event of liquidation, the amount repaid could fall short if there is a partial or even complete write down of the debt.
  repayment.total = event.params._amount;
  repayment.paidAt = event.block.timestamp;
  repayment.repaid = event.params.isFinal;
  repayment.save();
}

export function handleLiquidate(event: Liquidate): void {
  const vaultAddress = event.params._vault.toHex();
  const assetAddress = event.params._asset.toHex();
  const userAddress = event.params._liquidator.toHex();

  const loanId = [
    vaultAddress,
    assetAddress,
    event.params._drowDownId.toString(),
  ].join("_");
  const repaymentId = [loanId, event.params._repaymentId.toString()].join("_");

  let liquidationEntity = Liquidation.load(repaymentId);
  if (!liquidationEntity) {
    liquidationEntity = new Liquidation(repaymentId);
  }

  liquidationEntity.liquidator = userAddress;
  liquidationEntity.vault = vaultAddress;
  liquidationEntity.reserve = assetAddress;
  liquidationEntity.loanId = event.params._drowDownId;
  liquidationEntity.repaymentId = event.params._repaymentId;
  liquidationEntity.loan = loanId;
  liquidationEntity.repayment = repaymentId;
  liquidationEntity.totalDebt = event.params._debt;
  liquidationEntity.amountSlashed = event.params._margin;
  liquidationEntity.totalToLiquidate = event.params._collateral;
  liquidationEntity.amountToWriteDown = event.params._amountToWriteDown;

  liquidationEntity.save();
}
