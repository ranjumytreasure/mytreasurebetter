import React, { createContext, useState, useContext, useReducer, useEffect } from 'react';
import reducer from '../reducers/user_reducer'
import { SIDEBAR_CLOSE, SIDEBAR_OPEN } from '../actions'
const initialState = {
  isSidebarOpen: false,
}
const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user details here
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [userRole, setUserRole] = useState(null); // Store user role here

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateUserDetails = async (responseData) => {
    setUser({
      ...user,
      results: {
        ...user.results,
        firstname: responseData.results.firstname,
        lastname: responseData.results.lastname,
        dob: responseData.results.dob,
        gender: responseData.results.gender,
        user_image:responseData.results.user_image,
      },
    });
    
  };

  const updateUserCompany = (newUserCompany) => {

        setUser({
      ...user,
      results: {
        ...user.results,
        userCompany: newUserCompany,
      },
    });

    console.log('After update');
    console.log(user);
  };
  useEffect(() => {
    console.log('After update');
    console.log(user);
  }, [user]);


  const [state, dispatch] = useReducer(reducer, initialState)

  const openSidebar = () => {
    dispatch({ type: SIDEBAR_OPEN })
  }

  const closeSidebar = () => {
    dispatch({ type: SIDEBAR_CLOSE })
  }

   // Function to update user role (for future role selection)
   const updateUserRole = (role) => {
    setUserRole(role);
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn,isLoading,setIsLoading, login, logout, ...state, openSidebar, closeSidebar, updateUserCompany, userRole, updateUserRole,updateUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};
