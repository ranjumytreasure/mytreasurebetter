import React, { useContext, useEffect, useState } from "react";
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

const Instruction = styled.p`
  font-size: 1rem;
  color: #333;
  margin-bottom: 20px;

  strong {
    color: #b30000;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 400px;
  margin: auto;
  text-align: left;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.95rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  input {
    accent-color: #b30000;
  }
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Input = styled.input`
  padding: 10px 15px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border 0.2s ease-in-out;
  width: ${(props) => (props.small ? "80px" : "100%")};

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
  margin-left: 8px;
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

export default function CommissionDetails() {
  const { groupDetails: updateContext } = useContext(AppContext);

  const groupAmt = updateContext.groupAmt || 0;
  const [localCommPercent, setLocalCommPercent] = useState(updateContext.commPercent || 5);
  const [localCommAmt, setLocalCommAmt] = useState(0);

  const calculateCommAmt = (percentage) => {
    return Math.round((groupAmt * percentage) / 100);
  };

  useEffect(() => {
    if (updateContext.commType === "ONEVERYAUCTION") {
      setLocalCommPercent(5);
    } else if (updateContext.commType === "LUMPSUM") {
      setLocalCommPercent(100);
    }
  }, [updateContext.commType]);

  useEffect(() => {
    const calculatedAmount = calculateCommAmt(localCommPercent);
    setLocalCommAmt(calculatedAmount);
    updateContext.setCommPercent(localCommPercent);
    updateContext.setCommAmt(calculatedAmount);
  }, [localCommPercent, groupAmt]);

  const next = () => {
    if (!updateContext.commType) {
      toast.error("Please select a commission type");
      return;
    }
    updateContext.setCommPercent(localCommPercent);
    updateContext.setCommAmt(localCommAmt);
    updateContext.setStep(updateContext.currentPage + 1);
  };

  return (
    <Container>
      <HeadingBar>Enter Commission Details</HeadingBar>
      <Content>


        <Form onSubmit={(e) => e.preventDefault()}>
          <LabelWithHelp helpText="Select the type of commission to charge">
            Commission Type:
          </LabelWithHelp>
          <RadioGroup>
            <label>
              <input
                type="radio"
                value="ONEVERYAUCTION"
                checked={updateContext.commType === "ONEVERYAUCTION"}
                onChange={() => updateContext.setCommType("ONEVERYAUCTION")}
              />
              On Every Auction
            </label>
            <label>
              <input
                type="radio"
                value="LUMPSUM"
                checked={updateContext.commType === "LUMPSUM"}
                onChange={() => updateContext.setCommType("LUMPSUM")}
              />
              Lump Sum
            </label>
          </RadioGroup>

          <LabelWithHelp helpText="Percentage of group amount as commission">
            Commission Percentage:
          </LabelWithHelp>
          <InputGroup>
            <Input
              type="number"
              small
              value={localCommPercent}
              onChange={(e) => setLocalCommPercent(Number(e.target.value))}
            />
            <span>%</span>
          </InputGroup>

          <LabelWithHelp helpText="Calculated commission amount based on percentage">
            Commission Amount:
          </LabelWithHelp>
          <Input type="text" value={localCommAmt} readOnly />

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
