import React, { useContext } from "react";
import styled from "styled-components";
import AppContext from "./Context";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Container = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: auto;
  overflow: hidden;
`;

const HeadingBar = styled.div`
  background: #b30000;
  color: #fff;
  font-size: 1.3rem;
  font-weight: bold;
  padding: 15px;
  text-align: center;
`;

const Content = styled.div`
  padding: 20px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 500px;
  margin: auto;
  text-align: left;
`;

const RadioGroupHorizontal = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  label {
    font-size: 0.95rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  input {
    accent-color: #b30000;
  }
`;

const Input = styled.input`
  padding: 10px 15px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border 0.2s ease-in-out;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #b30000;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 10px;
`;

const Button = styled.button`
  background: ${(props) => (props.secondary ? "#ccc" : "#b30000")};
  color: ${(props) => (props.secondary ? "#333" : "#fff")};
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: ${(props) => (props.secondary ? "#aaa" : "#990000")};
  }
`;

const TooltipWrapper = styled.div`
  position: relative;
  margin-left: 6px;
  cursor: pointer;

  &:hover > span {
    opacity: 1;
    visibility: visible;
  }
`;

const TooltipText = styled.span`
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  max-width: 220px;
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s;

  &::after {
    content: "";
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }
`;

// Yellow bulb SVG icon
const BulbIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#f1c40f"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 3-3 5-3 5H8s-3-2-3-5a7 7 0 0 1 7-7z" />
    </svg>
);

function LabelWithHelp({ children, helpText }) {
    return (
        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "bold" }}>
            {children}
            <TooltipWrapper>
                <BulbIcon />
                <TooltipText>{helpText}</TooltipText>
            </TooltipWrapper>
        </label>
    );
}

export default function AuctionDetails() {
    const { groupDetails: updateContext } = useContext(AppContext);

    const next = () => {
        if (
            updateContext.auctFreq &&
            updateContext.auctPlace &&
            updateContext.firstAuctDate &&
            updateContext.auctStartTime &&
            updateContext.auctEndTime
        ) {
            updateContext.setStep(updateContext.currentPage + 1);
        } else {
            toast.error("Please fill in all auction details");
        }
    };

    return (
        <Container>
            <HeadingBar>Enter Auction Details</HeadingBar>
            <Content>
                <Form onSubmit={(e) => e.preventDefault()}>
                    <LabelWithHelp helpText="Select how often the auction will be held">
                        Auction Frequency:
                    </LabelWithHelp>
                    <RadioGroupHorizontal>
                        <label>
                            <input
                                type="radio"
                                value="MONTHLY"
                                checked={updateContext.auctFreq === "MONTHLY"}
                                onChange={() => updateContext.setAuctFreq("MONTHLY")}
                            />
                            Monthly
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="WEEKLY"
                                checked={updateContext.auctFreq === "WEEKLY"}
                                onChange={() => updateContext.setAuctFreq("WEEKLY")}
                            />
                            Weekly
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="DAILY"
                                checked={updateContext.auctFreq === "DAILY"}
                                onChange={() => updateContext.setAuctFreq("DAILY")}
                            />
                            Daily
                        </label>
                    </RadioGroupHorizontal>

                    <LabelWithHelp helpText="Select the first auction date">
                        Auction Date:
                    </LabelWithHelp>
                    <Input
                        type="date"
                        value={updateContext.firstAuctDate}
                        onChange={(e) => updateContext.setFirstAuctdt(e.target.value)}
                        required
                    />

                    <LabelWithHelp helpText="Select the auction start time">
                        Auction Start Time:
                    </LabelWithHelp>
                    <Input
                        type="time"
                        value={updateContext.auctStartTime}
                        onChange={(e) => updateContext.setAuctStartTime(e.target.value)}
                        required
                    />

                    <LabelWithHelp helpText="Select the auction end time">
                        Auction End Time:
                    </LabelWithHelp>
                    <Input
                        type="time"
                        value={updateContext.auctEndTime}
                        onChange={(e) => updateContext.setAuctEndTime(e.target.value)}
                        required
                    />

                    <LabelWithHelp helpText="Select where the auction will take place">
                        Auction Place:
                    </LabelWithHelp>
                    <RadioGroupHorizontal>
                        <label>
                            <input
                                type="radio"
                                value="Office"
                                checked={updateContext.auctPlace === "Office"}
                                onChange={() => updateContext.setAuctPlace("Office")}
                            />
                            Office
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="Online"
                                checked={updateContext.auctPlace === "Online"}
                                onChange={() => updateContext.setAuctPlace("Online")}
                            />
                            Online
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="Both"
                                checked={updateContext.auctPlace === "Both"}
                                onChange={() => updateContext.setAuctPlace("Both")}
                            />
                            Both
                        </label>
                    </RadioGroupHorizontal>

                    <ButtonGroup>
                        <Button
                            type="button"
                            secondary
                            onClick={() => updateContext.setStep(updateContext.currentPage - 1)}
                        >
                            Previous
                        </Button>
                        <Button type="button" onClick={next}>
                            Next
                        </Button>
                    </ButtonGroup>
                </Form>
            </Content>

            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </Container>
    );
}
