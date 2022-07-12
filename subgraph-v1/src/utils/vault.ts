import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Drawdown, Repayment, Vault } from "../../generated/schema";
import { Voyage } from "../../generated/Voyage/Voyage";
import { Zero } from "../consts";

export function createVault(
  _vaultAddress: Address,
  _userAddress: Address
): Vault {
  const vaultAddress = _vaultAddress.toHex();
  let vaultEntity = Vault.load(vaultAddress);
  if (!vaultEntity) {
    vaultEntity = new Vault(vaultAddress);
  }

  vaultEntity.user = _userAddress.toHex();
  vaultEntity.borrowRate = Zero;
  vaultEntity.totalDebt = Zero;
  vaultEntity.totalMargin = Zero;
  vaultEntity.withdrawableSecurityDeposit = Zero;
  vaultEntity.creditLimit = Zero;
  vaultEntity.spendableBalance = Zero;
  vaultEntity.gav = Zero;
  vaultEntity.ltv = Zero;
  vaultEntity.healthFactor = Zero;
  vaultEntity.marginRequirement = Zero;

  vaultEntity.save();
  return vaultEntity;
}

export function updateVaultData(
  _vaultAddress: Address,
  _assetAddress: Address,
  _eventAddress: Address
): Vault {
  const vaultAddress = _vaultAddress.toHex();
  let vaultEntity = Vault.load(vaultAddress);
  if (!vaultEntity) {
    vaultEntity = new Vault(vaultAddress);
  }
  const voyage = Voyage.bind(_eventAddress);
  const vaultData = voyage.getVaultData(_vaultAddress, _assetAddress);
  const vaultConfigData = voyage.getVaultConfig(_assetAddress);

  vaultEntity.borrowRate = vaultData.seniorLiquidityRate;
  vaultEntity.totalDebt = vaultData.totalDebt;
  vaultEntity.pool = _assetAddress.toHex();
  vaultEntity.totalMargin = vaultData.totalMargin;
  vaultEntity.marginRequirement = vaultConfigData.marginRequirement;
  vaultEntity.withdrawableSecurityDeposit =
    vaultData.withdrawableSecurityDeposit;
  vaultEntity.creditLimit = vaultData.creditLimit;
  vaultEntity.spendableBalance = vaultData.spendableBalance;
  vaultEntity.gav = vaultData.gav;
  vaultEntity.ltv = vaultData.ltv;
  vaultEntity.healthFactor = vaultData.healthFactor;

  // Update drawdowns
  var drawdownEntity: Drawdown;
  for (
    let i = vaultData.drawDownList.head.toI32();
    i < vaultData.drawDownList.tail.toI32();
    i++
  ) {
    const drawdown = voyage.getDrawDownDetail(
      _vaultAddress,
      _assetAddress,
      BigInt.fromI32(i)
    );
    const drawdownId = [vaultAddress, _assetAddress.toHex(), i.toString()].join(
      "_"
    );
    const _drawdownEntity = Drawdown.load(drawdownId);
    drawdownEntity = _drawdownEntity
      ? _drawdownEntity
      : new Drawdown(drawdownId);
    drawdownEntity.vault = vaultAddress;
    drawdownEntity.principal = drawdown.principal;
    drawdownEntity.pmt_principal = drawdown.pmt.principal;
    drawdownEntity.pmt_interest = drawdown.pmt.interest;
    drawdownEntity.pmt_payment = drawdown.pmt.pmt;
    drawdownEntity.term = drawdown.term;
    drawdownEntity.epoch = drawdown.epoch;
    drawdownEntity.nper = drawdown.nper;
    drawdownEntity.apr = drawdown.apr;
    drawdownEntity.borrowAt = drawdown.borrowAt;
    drawdownEntity.nextPaymentDue = drawdown.nextPaymentDue;
    drawdownEntity.totalPrincipalPaid = drawdown.totalPrincipalPaid;
    drawdownEntity.totalInterestPaid = drawdown.totalInterestPaid;
    drawdownEntity.paidTimes = drawdown.paidTimes;

    var repaymentEntity: Repayment;
    const repayments = voyage.getRepayment(
      _vaultAddress,
      _assetAddress,
      BigInt.fromI32(i)
    );
    for (let j = 0; j < repayments.length; j++) {
      const repaymentId = [drawdownId, j.toString()].join("_");
      const _repaymentEntity = Repayment.load(repaymentId);
      repaymentEntity = _repaymentEntity
        ? _repaymentEntity
        : new Repayment(repaymentId);
      repaymentEntity.drawdown = drawdownEntity.id;
      const repayment = repayments.at(j);
      repaymentEntity.principal = repayment.principal;
      repaymentEntity.interest = repayment.interest;
      repaymentEntity.total = repayment.total;
      repaymentEntity.paidAt = repayment.paidAt;
      repaymentEntity.isLiquidated = repayment.isLiquidated;
      repaymentEntity.save();
    }

    drawdownEntity.save();
  }
  vaultEntity.save();
  return vaultEntity;
}
