// LoadingBar.js
import React from 'react';
import styled from 'styled-components';

const LoadingBarContainer = styled.div`
  display: ${({ isLoading }) => (isLoading ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #007bff; /* Choose a loading bar color */
  z-index: 9999;
  animation: loading 2s linear infinite;
  
  @keyframes loading {
    0% { width: 0; }
    50% { width: 50%; }
    100% { width: 0; }
  }
`;

function LoadingBar({ isLoading }) {
  return <LoadingBarContainer isLoading={isLoading} />;
}

export default LoadingBar;
