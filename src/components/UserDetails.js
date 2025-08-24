import React, { useState } from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Card from './Card';
import Highlights from './Highlights';

const UserDetails = ({ groups, premium }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Container>
      {/* Collapse Button */}
      <ToggleButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </ToggleButton>

      {/* Collapsible Section */}
      <Content isOpen={isOpen}>
        <InnerContent>
          <CardWrapper>
            <Card />
          </CardWrapper>
          <HighlightsWrapper>
            <Highlights groups={groups} premium={premium} />
          </HighlightsWrapper>
        </InnerContent>
      </Content>
    </Container>
  );
};

export default UserDetails;

// Styled Components
const Container = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  max-width: 1200px;
  margin: 1rem auto;
  position: relative;
  padding-top: .5rem; /* space for button */
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #c62828;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  transition: background 0.3s ease;

  &:hover {
    background: #b71c1c;
  }
`;

const Content = styled.div`
  max-height: ${({ isOpen }) => (isOpen ? '2000px' : '0')};
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  overflow: hidden;
  transition: all 0.4s ease;
`;

const InnerContent = styled.div`
  padding: 1.5rem; /* padding inside the white card */
  display: grid;
  gap: 2rem; /* space between card & followers */
  
  @media (min-width: 992px) {
    grid-template-columns: 1.5fr 0.5fr;
  }
`;

const CardWrapper = styled.div`
  margin-bottom: 1rem;
`;

const HighlightsWrapper = styled.div``;


