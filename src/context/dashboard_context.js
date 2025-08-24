// DashboardContext.js
import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const useDashboardContext = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [dashboardDetails, setDashboardDetails] = useState(null);

  const updateDashboardDetails = (details) => {
    setDashboardDetails(details);
  };

  return (
    <DashboardContext.Provider value={{ dashboardDetails, updateDashboardDetails }}>
      {children}
    </DashboardContext.Provider>
  );
};
