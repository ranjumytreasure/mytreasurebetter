import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/apiConfig";
import { useUserContext } from "../context/user_context";
import { useGroupDetailsContext } from "../context/group_context";

const SendReminderModal = ({ triggerLabel = "Send Reminder", onSuccess }) => {
  const { user } = useUserContext();
  const userCompany = user?.results?.userCompany;

  const { state: groupDetailsState } = useGroupDetailsContext();
  const { data: groupsAccountsDetail } = groupDetailsState;

  const [open, setOpen] = useState(false);
  const [due, setDue] = useState("");
  const [auctDate, setAuctDate] = useState("");
  const [groupId, setGroupId] = useState("");
  const [month, setMonth] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");

  // ✅ Extract company name on load
  useEffect(() => {
    if (userCompany?.name) {
      setCompanyName(userCompany.name);
    }
  }, [userCompany]);

  // ✅ Get auction details
  useEffect(() => {
    if (groupsAccountsDetail?.results?.type === "FIXED") {
      const pendingAuctions = groupsAccountsDetail.results.groupAccountResult
        ?.filter((item) => item.auctionStatus === "pending")
        .sort((a, b) => a.sno - b.sno);

      if (pendingAuctions && pendingAuctions.length > 0) {
        const first = pendingAuctions[0];
        setDue(first?.customerDue?.toString() || "");
        setAuctDate(first?.auctionDate?.toString() || "");
        setGroupId(first?.grpAccountId?.toString() || "");
      }
    }
  }, [groupsAccountsDetail]);

  const handleSend = async () => {
    setIsLoading(true);

    const reminderData = {
      groupId,
      due,
      month,
      auct_date: auctDate,
      companyname: companyName,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/whatsapp/due-reminder`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.results?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reminderData),
      });

      if (response.ok) {
        const resJson = await response.json();
        if (onSuccess) onSuccess(resJson);

        setOpen(false);
        setDue("");
        setMonth("");
        setAuctDate("");
      } else {
        const errorRes = await response.json();
        console.error("Error response:", errorRes);
      }
    } catch (error) {
      console.error("Error sending reminder:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Send WhatsApp Reminder</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Due Amount</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Month</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="e.g. April"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Auction Date</label>
                <input
                  type="date"
                  className="border p-2 w-full rounded"
                  value={auctDate}
                  onChange={(e) => setAuctDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleSend}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Confirm & Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SendReminderModal;
