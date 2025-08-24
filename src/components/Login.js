import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components'
import { useHistory } from 'react-router-dom';
import { useUserContext } from '../context/user_context';
import { useLedgerAccountContext } from "../context/ledgerAccount_context";
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import { API_BASE_URL } from '../utils/apiConfig';
import Modal from "../components/Modal";

function Login() {
  const { login, updateUserRole } = useUserContext();
  const { resetLedgerAccounts } = useLedgerAccountContext();

  const [list, setList] = useState([]);
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

  const history = useHistory();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState(null); // State to hold user details
  // Access the AuthContext
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userObjectFromAPI, setUserObjectFromAPI] = useState(null);

  const handleLogin = async (e) => {
    const apiUrl = `${API_BASE_URL}/signin`;
    e.preventDefault();
    setIsLoading(true); // Show loading bar when login starts
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      if (response.ok) {
        //Clear all the previus data:
        resetLedgerAccounts();
        // Successful sign-in, navigate to home page
        //userObjectFromAPI = await response.json(); // Capture the user object from the API

        const data = await response.json();
        setUserObjectFromAPI(data);
        // Set the user object in the AuthContext
        login(data);
        setUserRole(data?.results?.userAccounts); // Set the captured user object in the state

        // This logic is not working nee dto revisit
        if (data?.results?.userAccounts.length === 1) {
          // Redirect to the role choosing page
          const selectedRole = data?.results?.userAccounts[0]?.accountName || 'User';

          updateUserRole(selectedRole);
          redirectPage(selectedRole);

        } else {
          setShowModal(true);

        }





      } else {
        const eresponseData = await response.json();
        // Handle sign-in error
        console.error('Sign-in failed');
        showAlert(true, 'danger', eresponseData.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false); // Hide loading bar when login is complete
    }
  };
  const showAlert = (show = false, type = '', msg = '') => {

    setAlert({ show, type, msg });
  };
  // Define the condition for button disablement
  const isButtonDisabled = !phone || !password || isLoading;

  const handleRoleSelect = (selectedRole) => {
    updateUserRole(selectedRole);
    setShowModal(false); // Close the modal after role selection
    redirectPage(selectedRole)
  };

  const redirectPage = (selectedRole) => {

    console.log(selectedRole);
    console.log(userObjectFromAPI?.results?.userId);

    if (selectedRole.includes('User') || selectedRole.includes('Manager')) {
      history.push('/home');
    } else if (selectedRole.includes('Subscriber')) {
      history.push('/subscriber');
    } else if (selectedRole.includes('Accountant')) {
      history.push('/accountant-page');
    } else if (selectedRole.includes('Collector')) {

      history.push(`/collector/${userObjectFromAPI?.results?.userId}`);
    } else {
      // Handle unknown account names
      history.push('/unknown-account-page');
    }
  };


  return (<Wrapper className='section-center'>
    <div className="contain">
      {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
      <h3>Login</h3>

      <form className="form" onSubmit={handleLogin}>
        <input
          className="formInput"
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          className="formInput"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className={`formSubmit ${isButtonDisabled ? 'disabled' : ''}`}
          type="submit"
          disabled={isButtonDisabled}
        >
          {isLoading ? 'Logging In...' : 'Login'}
        </button>

      </form>
      <p >
        New to Treasure? <Link to="/signup">Signup</Link>
      </p>
      <p >
        <Link to="/forgotpassword">Forgot Password</Link>
      </p>
    </div>
    {showModal && (<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <div className="modal-content">
        <button className="close-btn" onClick={() => setShowModal(false)}>X</button>
        <h2>Select Your Role</h2>
        <ul>
          {userRole && userRole.map((role) => (
            <li key={role.accountName}>
              <label className="role-label">
                <input
                  type="radio"
                  name="role"
                  value={role.accountName}
                  onChange={() => handleRoleSelect(role.accountName)}
                />
                {role.accountName}
              </label>
            </li>
          ))}
        </ul>

      </div>
    </Modal>
    )}
  </Wrapper>
  );
}
const Wrapper = styled.section`
display: flex;
flex-direction: column;
justify-content: space-between;
align-items: center;

.modal-content {
  position: relative;
}
.contain {
  max-width: 25rem;
  margin-top: 2rem;
  margin-bottom: 4rem;
padding-top: 10px;
display: flex;
flex-direction: column;
align-items: center;
background: var(--clr-white);
border-radius: var(--radius);
box-shadow: var(--light-shadow);
transition: var(--transition);
width: 90vw;
height: 400px;
position: relative;

}


.contain:hover {
    box-shadow: var(--dark-shadow);
  }

.form {
    display: flex;
    padding: 10px;
    flex-direction: column;
    width: 350px;
    height: 200px;
    
}

.formInput {
    border-radius: 5px;
    border-color: #e5e5e5;
    border-style: solid;
    border-width: 0.5px;
    margin-bottom: 10px;
    padding: 10px;
}

.formSubmit {
  border-radius: 5px;
  background-color:#cd3240;
  border: 2px solid transparent;
  color: var(--clr-white); 
  width: 330px;
  padding-top: 8px;
margin-top:20px;
align-items: center;
cursor:pointer;
}
.formSubmit.disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.formSelect {
    width: 380px;
    border-radius: 5px;
    border-color: #e5e5e5;
    border-style: solid;
    border-width: 0.5px;
    margin-bottom: 10px;
    padding: 10px;
    
}
  
  @media (min-width: 992px) 
  {
    height: calc(100vh - 5rem);
    
  }
  .role-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: 8px; /* Adjust as needed */
  }
  
  .role-label input[type="radio"] {
    margin-right: 8px; /* Adjust as needed */
  }
  .alert {
    margin-bottom: 1rem;
    height: 1.25rem;
    display: grid;
    align-items: center;
    text-align: center;
    font-size: 0.7rem;
    border-radius: 0.25rem;
    letter-spacing: var(--spacing);
    text-transform: capitalize;
  }
  
  .alert-danger {
    color: #721c24;
    background: #f8d7da;
  }
  
  .alert-success {
    color: #155724;
    background: #d4edda;
  }
  
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    color: #000;
  }
  
  .close-btn:hover {
    color: red; /* Change color on hover if desired */
  }
  `
export default Login;
