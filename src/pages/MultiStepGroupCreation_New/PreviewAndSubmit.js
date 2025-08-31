import React, { useContext, useEffect, useState, useMemo } from "react";
import AppContext from "./Context";
import { API_BASE_URL } from "../../utils/apiConfig";
import productJson from "../../assets/product.json";
import { useHistory } from "react-router-dom";
import { useUserContext } from "../../context/user_context";
import { v4 as uuidv4 } from "uuid";

export default function PreviewAndSubmit() {
  const { groupDetails } = useContext(AppContext);
  const myContext = useContext(AppContext);
  const updateContext = myContext.groupDetails;

  const history = useHistory();
  const { isLoggedIn, user, userRole } = useUserContext();

  const [membershipId, setMembershipId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch membershipId from user context
  useEffect(() => {
    if (user.results?.userAccounts?.length > 0) {
      const membership = user.results.userAccounts[0];
      setMembershipId(membership.membershipId);
    }
  }, [user]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Generate fixed group accounts if groupType is Fixed
  const fixedGroupAccounts = useMemo(() => {
    if (groupDetails.groupType !== "Fixed") return [];

    const matchingProduct = productJson.find(
      (entry) =>
        entry.product === Number(groupDetails.groupAmt) &&
        entry.noofmonths === Number(groupDetails.groupNoOfMonths) &&
        entry.membershipid === Number(membershipId)
    );

    if (!matchingProduct) return [];

    const startDate = new Date(groupDetails.firstAuctDate);
    const months = groupDetails.groupNoOfMonths;

    const generatedDates = Array.from({ length: months }, (_, i) => {
      const date = new Date(startDate.getTime());
      date.setMonth(date.getMonth() + i);
      return date.toISOString().split("T")[0];
    });

    return matchingProduct.groupAccounts.map((acc, idx) => ({
      ...acc,
      auctDate: generatedDates[idx] || "",
    }));
  }, [groupDetails, membershipId]);

  const handleSubmit = async () => {
    setIsLoading(true);

    if (isLoggedIn) {
      // Logged-in: send to backend
      const emi =
        groupDetails.groupType === "Fixed"
          ? groupDetails.groupAmt / groupDetails.groupNoOfMonths
          : groupDetails.groupAmt / groupDetails.groupNoOfSub;

      const groupData = {
        groupId: null,
        groupName: groupDetails.groupName,
        amount: groupDetails.groupAmt,
        type: groupDetails.groupType,
        noOfSubscribers: groupDetails.groupNoOfSub,
        tenure:
          groupDetails.groupType === "Fixed"
            ? groupDetails.groupNoOfMonths
            : groupDetails.groupNoOfSub,
        groupProgress: "FUTURE",
        auctDate: groupDetails.firstAuctDate,
        auctStartTime: groupDetails.auctStartTime,
        auctEndTime: groupDetails.auctEndTime,
        emi: emi || 0,
        collectedBy: user.results.userId,
        commissionType: groupDetails.commType,
        commissionMonth: 0,
        commissionPercentage: groupDetails.commPercentage,
        commissionAmount: groupDetails.commAmt,
        auctionPlace: groupDetails.auctPlace,
        nextAuctDate: groupDetails.firstAuctDate,
        auctionMode: groupDetails.auctFreq,
        sourceSystem: "WEB",
        stepper: 0,
        isAuctionReady: false,
        isDrafted: 0,
        groupAccounts: fixedGroupAccounts,
      };

      try {
        const response = await fetch(`${API_BASE_URL}/groups`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.results.token}`,
            "Content-Type": "application/json",
            "X-User-Role": userRole,
          },
          body: JSON.stringify(groupData),
        });

        if (response.ok) {
          const grpJsonObject = await response.json();
          groupDetails.setGroupId(grpJsonObject.results.id);
          updateContext.setStep(updateContext.currentPage + 1);
          localStorage.removeItem("unauthenticatedGroup");
        } else {
          console.error("Failed to submit group details");
        }
      } catch (error) {
        console.error("Error submitting group details:", error);
      }
    } else {
      // Not logged-in: save to localStorage and redirect
      const generatedKey = uuidv4();
      const groupData = {
        step: groupDetails.currentPage,
        groupId: generatedKey,
        groupName: groupDetails.groupName,
        groupAmt: groupDetails.groupAmt,
        groupType: groupDetails.groupType,
        groupNoOfSub: groupDetails.groupNoOfSub,
        groupNoOfMonths: groupDetails.groupNoOfMonths,
        groupProgress: "FUTURE",
        firstAuctDate: groupDetails.firstAuctDate,
        auctStartTime: groupDetails.auctStartTime,
        auctEndTime: groupDetails.auctEndTime,
        commAmt: groupDetails.commAmt,
        collectedBy: null,
        commissionType: groupDetails.commType,
        commissionMonth: 0,
        commissionAmount: groupDetails.commAmt,
        auctionPlace: groupDetails.auctPlace,
        auctionMode: groupDetails.auctFreq,
        sourceSystem: "WEB",
        stepper: 0,
        isAuctionReady: false,
        isDrafted: 0,
      };
      localStorage.setItem("unauthenticatedGroup", JSON.stringify(groupData));
      history.push("/login");
    }

    setIsLoading(false);
  };

  const handlePrevious = () => {
    updateContext.setStep(updateContext.currentPage - 1);
  };

  return (
    <div className="max-w-4xl mx-auto my-6 bg-white rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
            <span className="text-2xl">📋</span>
          </div>
          <h2 className="text-3xl font-bold font-['Poppins'] mb-2">Preview & Submit</h2>
          <p className="text-red-100 text-sm">Review your group details before submission</p>
        </div>
      </div>
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <span className="font-semibold text-gray-700">Group Name:</span>
            <span className="ml-2 text-gray-900">{groupDetails.groupName}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <span className="font-semibold text-gray-700">Group Amount:</span>
            <span className="ml-2 text-gray-900">{groupDetails.groupAmt}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <span className="font-semibold text-gray-700">
              {groupDetails.groupType === "Fixed" ? "No of Months:" : "No of Subscribers:"}
            </span>
            <span className="ml-2 text-gray-900">
              {groupDetails.groupType === "Fixed" ? groupDetails.groupNoOfMonths : groupDetails.groupNoOfSub}
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <span className="font-semibold text-gray-700">Group Type:</span>
            <span className="ml-2 text-gray-900">{groupDetails.groupType}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <span className="font-semibold text-gray-700">Commission Type:</span>
            <span className="ml-2 text-gray-900">{groupDetails.commType}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <span className="font-semibold text-gray-700">Commission Percent:</span>
            <span className="ml-2 text-gray-900">{groupDetails.commPercentage}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <span className="font-semibold text-gray-700">Commission Amount:</span>
            <span className="ml-2 text-gray-900">{groupDetails.commAmt}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <span className="font-semibold text-gray-700">Auction Mode:</span>
            <span className="ml-2 text-gray-900">{groupDetails.auctFreq}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <span className="font-semibold text-gray-700">Auction Date:</span>
            <span className="ml-2 text-gray-900">{groupDetails.firstAuctDate}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <span className="font-semibold text-gray-700">Auction Start Time:</span>
            <span className="ml-2 text-gray-900">{groupDetails.auctStartTime}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <span className="font-semibold text-gray-700">Auction End Time:</span>
            <span className="ml-2 text-gray-900">{groupDetails.auctEndTime}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <span className="font-semibold text-gray-700">Auction Place:</span>
            <span className="ml-2 text-gray-900">{groupDetails.auctPlace}</span>
          </div>
        </div>

        {groupDetails.groupType === "Fixed" && fixedGroupAccounts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 font-['Poppins']">Fixed Group Accounts</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-xl shadow-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                    <th className="p-4 text-left font-semibold">Auction Date</th>
                    <th className="p-4 text-center font-semibold">Bid</th>
                    <th className="p-4 text-center font-semibold">Prize</th>
                    <th className="p-4 text-center font-semibold">Commission</th>
                    <th className="p-4 text-center font-semibold">Balance</th>
                    <th className="p-4 text-center font-semibold">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {fixedGroupAccounts.map((acc, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-4 border-b border-gray-200">{formatDate(acc.auctDate)}</td>
                      <td className="p-4 border-b border-gray-200 text-center">{acc.bid ?? 0}</td>
                      <td className="p-4 border-b border-gray-200 text-center">{acc.prize ?? 0}</td>
                      <td className="p-4 border-b border-gray-200 text-center">{acc.comm ?? 0}</td>
                      <td className="p-4 border-b border-gray-200 text-center">{acc.bal ?? 0}</td>
                      <td className="p-4 border-b border-gray-200 text-center">{acc.due ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-6">
          <button
            onClick={handlePrevious}
            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-gray-600 hover:to-gray-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-500/30 flex items-center justify-center gap-2"
          >
            <span>←</span>
            Previous
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-red-700 hover:to-red-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                Submit
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
