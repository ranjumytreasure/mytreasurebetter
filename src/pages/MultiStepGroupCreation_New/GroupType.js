import React, { useContext } from "react";
import styled from "styled-components";
import { FaVideo } from "react-icons/fa";
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

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
  max-width: 350px;
  margin-left: auto;
  margin-right: auto;
`;

const RadioRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px; /* smaller gap between radio label and icon */
  width: 100%;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  flex-grow: 1; /* so label takes remaining space */

  input {
    accent-color: #b30000;
    transform: scale(1.2);
  }
`;

const VideoIcon = styled.a`
  color: #b30000;
  font-size: 1.3rem;
  cursor: pointer;
  flex-shrink: 0; /* prevent shrinking */

  &:hover {
    color: #990000;
  }
`;

const NextButton = styled.button`
  background: #b30000;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: #990000;
  }
`;
// Extra style to center toast message text
const ToastStyle = styled.div`
  .Toastify__toast-body {
    text-align: center;
  }
`;


export default function GroupType() {
  const { groupDetails: updateContext } = useContext(AppContext);

  const next = () => {
    if (!updateContext.groupType) {
      toast.error("Please select a group type");
    } else {
      updateContext.setStep(updateContext.currentPage + 1);
    }
  };

  const videoLinks = {
    Accumulative: "https://example.com/accumulative-video",
    Deductive: "https://example.com/deductive-video",
    Fixed: "https://example.com/fixed-video",
  };

  return (
    <Container>
      <HeadingBar>Choose your group type :</HeadingBar>
      <Content>
        <form onSubmit={(e) => e.preventDefault()}>
          <RadioGroup>
            {["Accumulative", "Deductive", "Fixed"].map((type) => (
              <RadioRow key={type}>
                <RadioLabel>
                  <input
                    type="radio"
                    name="groupType"
                    value={type}
                    checked={updateContext.groupType === type}
                    onChange={() => updateContext.setGroupType(type)}
                  />
                  {type}
                </RadioLabel>
                <VideoIcon
                  href={videoLinks[type]}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Watch video about ${type}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaVideo />
                </VideoIcon>
              </RadioRow>
            ))}
          </RadioGroup>

          <NextButton type="button" onClick={next}>
            Next
          </NextButton>
        </form>
      </Content>

      <ToastStyle>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </ToastStyle>
    </Container>
  );
}
