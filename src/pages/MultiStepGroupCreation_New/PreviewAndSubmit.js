import React, { useContext, useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import AppContext from "./Context";
import { API_BASE_URL } from "../../utils/apiConfig";
import productJson from "../../assets/product.json";
import { useHistory } from "react-router-dom";
import { useUserContext } from "../../context/user_context";
import { v4 as uuidv4 } from "uuid";

const Container = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  max-width: 1200px;
`;

const Heading = styled.h2`
  color: #e53935;
  margin-bottom: 20px;
  border-bottom: 2px solid #e53935;
  padding-bottom: 8px;
`;

const Card = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
`;

const CardItem = styled.li`
  flex: 1 1 50%;
  display: flex;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  background: ${(props) => (props.index % 2 === 0 ? "#fafafa" : "white")};

  span {
    font-weight: bold;
    margin-right: 6px;
    color: #333;
  }

  @media (max-width: 768px) {
    flex: 1 1 100%;
  }
`;

const TableContainer = styled.div`
  margin-top: 20px;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    background: #e53935;
    color: #fff;
    padding: 8px;
    text-align: left;
  }

  td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: center;
  }

  tr:nth-child(even) {
    background: #f9f9f9;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: #e53935;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #c62828;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #ccc;
  color: #333;

  &:hover {
    background-color: #aaa;
  }
`;

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
    <Container>
      <Heading>Preview & Submit</Heading>

      <Card>
        <CardItem><span>Group Name:</span>{groupDetails.groupName}</CardItem>
        <CardItem><span>Group Amount:</span>{groupDetails.groupAmt}</CardItem>
        <CardItem>
          <span>{groupDetails.groupType === "Fixed" ? "No of Months:" : "No of Subscribers:"}</span>
          {groupDetails.groupType === "Fixed" ? groupDetails.groupNoOfMonths : groupDetails.groupNoOfSub}
        </CardItem>
        <CardItem><span>Group Type:</span>{groupDetails.groupType}</CardItem>
        <CardItem><span>Commission Type:</span>{groupDetails.commType}</CardItem>
        <CardItem><span>Commission Percent:</span>{groupDetails.commPercentage}</CardItem>
        <CardItem><span>Commission Amount:</span>{groupDetails.commAmt}</CardItem>
        <CardItem><span>Auction Mode:</span>{groupDetails.auctFreq}</CardItem>
        <CardItem><span>Auction Date:</span>{groupDetails.firstAuctDate}</CardItem>
        <CardItem><span>Auction Start Time:</span>{groupDetails.auctStartTime}</CardItem>
        <CardItem><span>Auction End Time:</span>{groupDetails.auctEndTime}</CardItem>
        <CardItem><span>Auction Place:</span>{groupDetails.auctPlace}</CardItem>
      </Card>

      {groupDetails.groupType === "Fixed" && fixedGroupAccounts.length > 0 && (
        <TableContainer>
          <h3>Fixed Group Accounts</h3>
          <StyledTable>
            <thead>
              <tr>
                <th>Auction Date</th>
                <th>Bid</th>
                <th>Prize</th>
                <th>Commission</th>
                <th>Balance</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {fixedGroupAccounts.map((acc, idx) => (
                <tr key={idx}>
                  <td>{formatDate(acc.auctDate)}</td>
                  <td>{acc.bid ?? 0}</td>
                  <td>{acc.prize ?? 0}</td>
                  <td>{acc.comm ?? 0}</td>
                  <td>{acc.bal ?? 0}</td>
                  <td>{acc.due ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      )}

      <ButtonGroup>
        <SecondaryButton onClick={handlePrevious}>Previous</SecondaryButton>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </ButtonGroup>
    </Container>
  );
}
