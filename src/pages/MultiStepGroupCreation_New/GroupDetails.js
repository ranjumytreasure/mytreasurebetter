import React, { useContext, useEffect } from "react";
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

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 15px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: #b30000;
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
  max-width: 180px;
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

function InputWithHelp({ placeholder, value, onChange, required, helpText }) {
  return (
    <InputWrapper>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      <TooltipWrapper>
        <BulbIcon />
        <TooltipText>{helpText}</TooltipText>
      </TooltipWrapper>
    </InputWrapper>
  );
}

export default function GroupDetails() {
  const { groupDetails: updateContext } = useContext(AppContext);

  useEffect(() => {
    updateContext.setGroupName(updateContext.groupName || "");
    updateContext.setGroupAmt(updateContext.groupAmt || "");
    updateContext.setNoOfSub(updateContext.groupNoOfSub || "");
    updateContext.setNoOfMonths(updateContext.groupNoOfMonths || "");
  }, []);

  const next = () => {
    if (!updateContext.groupName) {
      toast.error("Please enter Group Name");
    } else if (!updateContext.groupAmt) {
      toast.error("Please enter Group Amount");
    } else if (
      updateContext.groupType === "Fixed" &&
      !updateContext.groupNoOfMonths
    ) {
      toast.error("Please enter No of Months");
    } else if (
      updateContext.groupType !== "Fixed" &&
      !updateContext.groupNoOfSub
    ) {
      toast.error("Please enter No of Subscribers");
    } else {
      updateContext.setStep(updateContext.currentPage + 1);
    }
  };

  return (
    <Container>
      <HeadingBar>Enter Group Details</HeadingBar>
      <Content>
        <Form onSubmit={(e) => e.preventDefault()}>
          <InputWithHelp
            placeholder="Group name"
            value={updateContext.groupName}
            onChange={(e) => updateContext.setGroupName(e.target.value)}
            required
            helpText="Sample: 1LackA1"
          />

          <InputWithHelp
            placeholder="Group amount"
            value={updateContext.groupAmt}
            onChange={(e) => updateContext.setGroupAmt(e.target.value)}
            required
            helpText="For eg 50000, 100000,500000 "
          />

          {updateContext.groupType === "Fixed" ? (
            <InputWithHelp
              placeholder="No of Months"
              value={updateContext.groupNoOfMonths}
              onChange={(e) => updateContext.setNoOfMonths(e.target.value)}
              required
              helpText="No of months"
            />
          ) : (
            <InputWithHelp
              placeholder="No of Subscribers"
              value={updateContext.groupNoOfSub}
              onChange={(e) => updateContext.setNoOfSub(e.target.value)}
              required
              helpText="Total subscribers in group"
            />
          )}

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
