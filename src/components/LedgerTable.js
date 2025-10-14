import React from "react";
import { useLedgerEntryContext } from "../context/ledgerEntry_context";

const LedgerTable = () => {
  const {
    ledgerEntries,
    isLoading,
    page,
    totalPages,
    setPage,
    limit,
    setLimit,
  } = useLedgerEntryContext();

  const totalCredit = ledgerEntries.results
    .filter((entry) => entry.entry_type === "CREDIT")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalDebit = ledgerEntries.results
    .filter((entry) => entry.entry_type === "DEBIT")
    .reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div>
      <table className="ledger-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Account Name</th>
            <th>Category</th>
            <th>CR Amount</th>
            <th>DB Amount</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {ledgerEntries.results.map((entry, index) => {
            const date = new Date(entry.transacted_date);
            const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

            return (
              <tr key={index}>
                <td>{formattedDate}</td>
                <td>{entry.account?.account_name || '-'}</td>
                <td>{entry.category}</td>
                <td>{entry.entry_type === "CREDIT" ? `₹${entry.amount}` : "-"}</td>
                <td>{entry.entry_type === "DEBIT" ? `₹${entry.amount}` : "-"}</td>
                <td>{entry.description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="total-sum" style={{ marginTop: "10px" }}>
        <strong>Total Credit:</strong> ₹{totalCredit} &nbsp;&nbsp;
        <strong>Total Debit:</strong> ₹{totalDebit}
      </div>

      <div className="pagination" style={{ marginTop: "10px" }}>
        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
          Prev
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages}
        </span>
        <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
          Next
        </button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n} per page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LedgerTable;
