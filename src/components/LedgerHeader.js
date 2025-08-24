import React from "react";
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { GoArrowBoth } from 'react-icons/go';
import "../style/LedgerHeader.css";

const LedgerHeader = ({ accounts, onAddClick }) => {
  const calculatePercentage = (opening, current) => {
    if (opening === 0) return "—";
    const diff = current - opening;
    const percent = ((diff / opening) * 100).toFixed(2);
    return `${percent}%`;
  };

  const getStatusIcon = (opening, current) => {
    const style = { display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' };

    if (current > opening) {
      return (
        <span style={{ ...style, color: 'green' }}>
          Profit <FiArrowUp />
        </span>
      );
    } else if (current < opening) {
      return (
        <span style={{ ...style, color: 'red' }}>
          Loss <FiArrowDown />
        </span>
      );
    } else {
      return (
        <span style={{ ...style, color: 'gray' }}>
          Break-even <GoArrowBoth />
        </span>
      );
    }
  };

  const calculateBalance = (opening, current) => {
    return Math.abs(opening - current);
  };

  // Totals
  const totalOpening = accounts?.reduce?.((sum, acc) => sum + acc.opening_balance, 0) || 0;
  const totalCurrent = accounts?.reduce?.((sum, acc) => sum + acc.current_balance, 0) || 0;
  const totalBalance = totalOpening - totalCurrent;


  return (
    <div className="account-header-section">
      <div className="account-header-top">
        <h2>Account Summary</h2>
        <button className="add-entry-btn" onClick={onAddClick}>+ Add Account</button>
      </div>

      <div className="account-grid-header">
        <span>Account Name</span>
        <span>Opening Balance</span>
        <span>Current Balance</span>
        <span>Diff</span>
        <span>% Change</span>
        <span>Status</span>
      </div>

      {accounts.map((acc, index) => (
        <div className="account-grid-row" key={index}>
          <span data-label="Account Name">{acc.account_name}</span>
          <span data-label="Opening Balance">₹{acc.opening_balance}</span>
          <span data-label="Current Balance">₹{acc.current_balance}</span>
          <span data-label="Balance">₹{calculateBalance(acc.opening_balance, acc.current_balance)}</span>
          <span data-label="% Change">{calculatePercentage(acc.opening_balance, acc.current_balance)}</span>
          <span data-label="Status">{getStatusIcon(acc.opening_balance, acc.current_balance)}</span>
        </div>

      ))}

      <div className="account-grid-row total-row">
        <span data-label="Account Name">Total</span>
        <span data-label="Opening Balance">₹{totalOpening}</span>
        <span data-label="Current Balance">₹{totalCurrent}</span>
        <span data-label="Balance">₹{totalBalance}</span>
        <span data-label="% Change">—</span>
        <span data-label="Status">—</span>
      </div>

    </div>
  );
};

export default LedgerHeader;



