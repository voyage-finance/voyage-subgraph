import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Drawdown, Vault } from "../../generated/schema";
import { Voyager } from "../../generated/Voyager/Voyager";

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
  const voyager = Voyager.bind(_eventAddress);
  const vaultData = voyager.getVaultData(_vaultAddress, _assetAddress);

  vaultEntity.borrowRate = vaultData.borrowRate;
  vaultEntity.totalDebt = vaultData.totalDebt;
  vaultEntity.totalMargin = vaultData.totalMargin;
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
    const drawdown = voyager.getDrawDownDetail(
      _vaultAddress,
      _assetAddress,
      new BigInt(i)
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
    drawdownEntity.save();
  }
  vaultEntity.save();
  return vaultEntity;
}
