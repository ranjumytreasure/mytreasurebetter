import React, { useState } from "react";
import { useLedgerEntryContext } from "../context/ledgerEntry_context";
import { useLedgerAccountContext } from "../context/ledgerAccount_context";
import { useUserContext } from "../context/user_context";
import Alert from '../components/Alert';
import "../style/AddEntryModal.css";
import { useGroupsDetailsContext } from "../context/groups_context";

const categoryOptions = [
  "Food",
  "Current Bill",
  "Water Bill",
  "Vegetable Expense",
  "Loan",
  "Donation",
  "Groups",
];

const AddEntryModal = ({ onClose, customersByGroup = {}, accounts = [] }) => {
  const { user } = useUserContext();
  const { addLedgerEntry, fetchLedgerEntries } = useLedgerEntryContext();
  const { fetchLedgerAccounts } = useLedgerAccountContext();
  const { state, fetchGroupById } = useGroupsDetailsContext();
  const { groups, selectedGroupDetails } = state;
  const groupSubscribers = selectedGroupDetails?.groupSubcriberResult || [];



  const today = new Date().toISOString().split("T")[0];

  const defaultFormData = {
    ledgerAccountId: "",
    transactedDate: today,
    entryType: "CREDIT",
    category: "",
    subCategory: "",
    amount: "",
    description: "",
    subscriberId: "",
    subscriberName: "",
    membershipId: "",
  };
  const groupSubcategories = [
    "DAILY-COLLECTION",
    "WEEKLY-COLLECTION",
    "MONTHLY-COLLECTION"
  ];

  const [formData, setFormData] = useState(defaultFormData);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedSubscriberId, setSelectedSubscriberId] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [tempData, setTempData] = useState(null);

  const [list, setList] = useState([]);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const [isLoading, setIsLoading] = useState(false);





  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setFormData((prev) => ({ ...prev, category }));

    if (category !== "Groups") {
      setSelectedGroupId("");
      setSelectedSubscriberId("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedGroup = groups.find((g) => String(g.id) === String(selectedGroupId));
    const selectedSubscriber = groupSubscribers.find(
      (sub) => String(sub.id) === String(selectedSubscriberId)
    );

    const payload = {
      ...formData,
      membershipId: user?.results?.userAccounts?.[0]?.parent_membership_id || "",
      groupId: formData.category === "Groups" ? selectedGroupId : null,
      subscriberId: formData.category === "Groups" ? selectedSubscriberId : null,
      subscriberName: formData.category === "Groups" ? selectedSubscriber?.name || "" : "",
      subCategory: formData.subCategory,  // Keep directly from formData
      amount: parseFloat(formData.amount),
    };

    setTempData(payload);
    setIsConfirming(true);
  };

  const showAlert = (show = false, type = '', msg = '') => {
    console.log('hi');
    setAlert({ show, type, msg });
  };
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await addLedgerEntry(tempData);
      const responseData = await response.json(); // Extract JSON

      if (response.ok) { // <-- check on response, not responseData
        fetchLedgerEntries();
        fetchLedgerAccounts();
        showAlert(true, 'success', responseData.message || 'Ledger entry added successfully!');

        setTimeout(() => {
          handleClose(); // Close after short delay
        }, 1000);
      } else {
        showAlert(true, 'danger', responseData.message || 'Failed to add ledger entry');
      }
    } catch (error) {
      showAlert(true, 'danger', 'An unexpected error occurred');
    }
    setIsLoading(false);  // Stop loader
  };




  const handleClose = () => {
    setFormData(defaultFormData);
    setSelectedGroupId("");
    setSelectedSubscriberId("");
    setIsConfirming(false);
    setTempData(null);
    setAlert({ show: false, type: "", message: "" });
    onClose?.();
  };

  const isConfirmDisabled = () => {
    if (!tempData) return true;
    const { amount, description, category, groupId, subscriberId } = tempData;
    if (!amount || !description) return true;
    if (category === "Groups" && (!groupId || !subscriberId)) return true;
    return false;
  };



  return (
    <>
      {
        isLoading && (
          <div className="page-overlay">
            <div className="loader-container">
              <div className="loader"></div>
              <p>Submitting...</p>
            </div>
          </div>
        )
      }
      <div className="modal-overlay">
        <div className="modal">
          <h2>New Ledger Entry</h2>

          {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}

          {isConfirming ? (
            <div className="confirmation-screen">
              <h3>Confirm Ledger Entry</h3>
              <p><strong>Date:</strong> {tempData.transactedDate}</p>
              <p><strong>Account:</strong> {
                tempData.ledgerAccountId
                  ? accounts.find((acc) => String(acc.id) === String(tempData.ledgerAccountId))?.account_name || "N/A"
                  : "N/A"
              }</p>
              <p><strong>Type:</strong> {tempData.entryType}</p>
              <p><strong>Category:</strong> {tempData.category}</p>

              {tempData.category === "Groups" && (
                <>
                  <p><strong>Group:</strong> {selectedGroupDetails?.groupName || "N/A"}</p>
                  <p><strong>Subcategory:</strong> {tempData.subCategory}</p>
                  <p><strong>Subscriber:</strong> {tempData.subscriberName}</p>
                </>
              )}


              <p><strong>Description:</strong> {tempData.description}</p>
              <div className="amount-highlight">₹ {tempData.amount}</div>

              <div className="modal-actions">
                <button onClick={() => setIsConfirming(false)}>Edit</button>
                <button onClick={handleConfirm} disabled={isConfirmDisabled()}>Confirm</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label htmlFor="transactedDate">Transaction Date</label>
              <input
                id="transactedDate"
                type="date"
                name="transactedDate"
                value={formData.transactedDate}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="ledgerAccountId">Select Account</label>
              <select
                id="ledgerAccountId"
                name="ledgerAccountId"
                value={formData.ledgerAccountId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Account</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.account_name}
                  </option>
                ))}
              </select>

              <label>Entry Type</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="entryType"
                    value="CREDIT"
                    checked={formData.entryType === "CREDIT"}
                    onChange={handleInputChange}
                  />
                  Credit
                </label>
                <label>
                  <input
                    type="radio"
                    name="entryType"
                    value="DEBIT"
                    checked={formData.entryType === "DEBIT"}
                    onChange={handleInputChange}
                  />
                  Debit
                </label>
              </div>

              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                required
              >
                <option value="">Select Category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {formData.category === "Groups" && (
                <>

                  <label htmlFor="subCategory">Group Subcategory</label>
                  <select
                    id="subCategory"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Subcategory</option>
                    {groupSubcategories.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  {/* Group Search Input */}
                  <label htmlFor="groupSearch">Group Name</label>
                  <input
                    id="groupSearch"
                    type="text"
                    placeholder="Search group by name"
                    value={formData.groupSearch || ""}
                    onChange={(e) => {
                      const input = e.target.value;
                      setFormData((prev) => ({ ...prev, groupSearch: input }));
                    }}
                  />

                  {/* Group Select Dropdown */}
                  <select
                    id="groupId"
                    value={selectedGroupId}
                    onChange={async (e) => {
                      const groupId = e.target.value;
                      setSelectedGroupId(groupId);
                      setSelectedSubscriberId("");
                      await fetchGroupById(groupId); // Fetch subscribers from context
                    }}
                    required
                  >
                    <option value="">Select Group</option>
                    {groups
                      .filter((group) =>
                        group.group_name
                          .toLowerCase()
                          .includes((formData.groupSearch || "").toLowerCase())
                      )
                      .map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.group_name}
                        </option>
                      ))}
                  </select>

                  {/* Subscriber Search Input */}
                  <label htmlFor="subscriberSearch">Subscriber Name</label>
                  <input
                    id="subscriberSearch"
                    type="text"
                    placeholder="Search subscriber"
                    value={formData.subscriberSearch || ""}
                    onChange={(e) => {
                      const input = e.target.value;
                      setFormData((prev) => ({ ...prev, subscriberSearch: input }));
                    }}
                  />

                  {/* Subscriber Dropdown */}
                  <select
                    id="subscriberId"
                    value={selectedSubscriberId}
                    onChange={(e) => setSelectedSubscriberId(e.target.value)}
                    required
                  >
                    <option value="">Select Subscriber</option>
                    {groupSubscribers
                      .filter((cust) =>
                        cust.name.toLowerCase().includes((formData.subscriberSearch || "").toLowerCase())
                      )
                      .map((cust) => (
                        <option key={cust.id} value={cust.id}>
                          {cust.name} - {cust.phone}
                        </option>
                      ))}
                  </select>

                </>
              )}


              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="number"
                name="amount"
                value={formData.amount}
                min="0"
                onChange={handleInputChange}
                required
              />

              <label htmlFor="description">Description</label>
              <input
                id="description"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />

              <div className="modal-actions">
                <button type="button" className="cancel" onClick={handleClose}>
                  Cancel
                </button>
                <button type="submit">Save</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default AddEntryModal;
