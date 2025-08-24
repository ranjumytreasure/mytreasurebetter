import React, { useContext } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import AppContext from "./Context";
import WhatsNext from "../../components/WhatsNext";
import { useUserContext } from "../../context/user_context";

const Container = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 40px auto;
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
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SuccessImage = styled.img`
  max-width: 120px;
  margin: 20px 0;
  display: block;
`;

const Message = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 10px 0;
  text-align: center;

  strong {
    color: #b30000;
  }
`;

const BackButton = styled.button`
  background: #b30000;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 20px;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: #990000;
  }
`;

const WhatsNextWrapper = styled.div`
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export default function Finish() {
  const { isLoggedIn } = useUserContext();
  const { groupDetails: updateContext } = useContext(AppContext);
  const history = useHistory();

  const name = updateContext.groupName;
  const groupId = updateContext.groupId;

  const handleBackButtonClick = () => {
    history.push("/home");
  };

  return (
    <Container>
      <HeadingBar>Group Created Successfully</HeadingBar>
      <Content>
        <Message>
          New Group <strong>{name}</strong> has been created successfully
        </Message>

        <SuccessImage
          src="https://www.svgrepo.com/show/13650/success.svg"
          alt="successful"
        />

        <Message>Thanks for your details</Message>

        {isLoggedIn && (
          <BackButton onClick={handleBackButtonClick}>
            Back to Home
          </BackButton>
        )}

        <WhatsNextWrapper>
          <WhatsNext groupId={groupId} />
        </WhatsNextWrapper>
      </Content>
    </Container>
  );
}
