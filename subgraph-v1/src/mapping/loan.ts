import { Borrow, Repayment, Voyage } from "../../generated/Voyage/Voyage";
import { getLoanEntityId } from "../utils/id";
import { getOrInitLoan } from "../helpers/initializers";
import { updateLoanEntity } from "../helpers/updaters";

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
  // const total = drawdown.inte
  loan.save();
}

export function handleRepay(event: Repayment): void {
  const voyage = Voyage.bind(event.address);
  const drawdownId = getLoanEntityId(
    event.params._vault,
    event.params._asset,
    event.params._loanId
  );
  const drawdown = Drawdown.load(drawdownId);
  updateLoanEntity(
    loan,
    event.params._vault,
    event.params._asset,
    event.params._loanId,
    event
  );
  drawdown!.save();

  const id = generateRepaymentId(drawdown!.id, event.params._repaymentId);
  const repayment = new Repayment(id);
  repayment.drawdown = drawdown!.id;
  repayment.principal = drawdown!.pmt_principal;
  repayment.interest = drawdown!.pmt_interest;
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

  const drawdownId = [
    vaultAddress,
    assetAddress,
    event.params._drowDownId.toString(),
  ].join("_");
  const repaymentId = [drawdownId, event.params._repaymentId.toString()].join(
    "_"
  );

  let liquidationEntity = Liquidation.load(repaymentId);
  if (!liquidationEntity) {
    liquidationEntity = new Liquidation(repaymentId);
  }

  liquidationEntity.liquidator = userAddress;
  liquidationEntity.vault = vaultAddress;
  liquidationEntity.reserve = assetAddress;
  liquidationEntity.drawdownId = event.params._drowDownId;
  liquidationEntity.repaymentId = event.params._repaymentId;
  liquidationEntity.drawdown = drawdownId;
  liquidationEntity.repayment = repaymentId;
  liquidationEntity.totalDebt = event.params._debt;
  liquidationEntity.amountSlashed = event.params._margin;
  liquidationEntity.totalToLiquidate = event.params._collateral;
  liquidationEntity.numNFTsToLiquidate = event.params._numCollateral;
  liquidationEntity.amountToWriteDown = event.params._writedown;

  liquidationEntity.save();
}
