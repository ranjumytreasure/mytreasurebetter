import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useUserContext } from "../context/user_context";
import ReactFlagsSelect from "react-flags-select";
import "./flags.css";
import { Link } from 'react-router-dom';
import LoadingBar from './LoadingBar';
import List from '../components/List';
import Alert from '../components/Alert';
import { API_BASE_URL } from '../utils/apiConfig';
import Menu from '../components/Menu';
import PersonalSettings from '../components/PersonalSettings';
import AddEmployee from '../components/AddEmployee';
import AddAob from '../components/AddAob';
import Subscribers from '../components/Subscribers';
import Company from '../components/Company'
import UsersPage from './UsersPage';
import ManageGroups from '../components/ManageGroups';

function AdminSettings() {

  const { isLoggedIn, user, login } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState('settings');

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    console.log(menu);
  };

  const renderComponent = () => {
    switch (selectedMenu) {
      case 'personalsettings':
        return <PersonalSettings />;
      case 'users':
        return <UsersPage />;
      case 'employees':
        return <AddEmployee />;
      case 'areaof business':
        return <AddAob />;
      case 'subscribers':
        return <Subscribers />;
      case 'company':
        return <Company />;
      case 'managegroups':
        return <ManageGroups />;

      // Add cases for other menu items as needed
      default:
        return null;
    }
  };

  return (
    <Wrapper className='section-center'>

      <div className="menu">
        <Menu onSelect={handleMenuClick} selectedMenu={selectedMenu} />
      </div>
      <div className="contain">
        <div>
          <div>{renderComponent()}</div>
        </div>
      </div>
    </Wrapper>
  );
}
const Wrapper = styled.section`
display: grid;
grid-template-columns: 1fr; /* Single column by default */

.menu {
  margin-top: 2rem;
  margin-bottom: 4rem;
  padding: 1rem;
  border-radius: var(--radius);
  box-shadow: var(--light-shadow);
  max-width: 30rem;
}

ul {
  list-style: none;
  padding: 1rem;
}

li {
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  color: var(--clr-black);
  transition: color 0.3s; /* Add a transition for smoother color change */
}
/* Add the hover styles */
li:hover {
  background-color: var(--clr-red-dark); 
  color: var(--clr-white); 
  border-radius:10px;
  padding :5px;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out; 
}
li.active {
    background-color: var(--clr-red-dark); 
  color: var(--clr-white); 
  border-radius:10px;
  padding :5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.menuheading {
    background-color: var(--clr-red-dark);
  padding: 5px ; /* Adjust padding as needed */
  font-size: 1rem;  
  color: white; /* Set the text color to white or another suitable color */  
  margin-bottom: 10px;
  border-radius: 10px; /* Adjust the radius to your liking */
  text-align: center;
}

.contain {      
margin-top: 2rem;
margin-bottom: 4rem;
padding-top:2rem; 
background: var(--clr-white);
border-radius: var(--radius);
box-shadow: var(--light-shadow);
transition: var(--transition);
height: auto; 
max-width: 30rem;

  } 

    .contain:hover {
      box-shadow: var(--dark-shadow);
    }
     
    @media screen and (min-width: 992px)
      {
        grid-template-columns: 15rem 60rem; /* Two columns with equal width */
        grid-gap: 10px; /* Grid gap of 1px between grid items */      
      }

      @media screen and (min-width: 992px)
      {
        .contain {  
          max-width: 60rem;
        }
      }
     
     
`
export default AdminSettings;
