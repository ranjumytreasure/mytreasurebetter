import { useState } from "react";
import OtpInput from '../components/OtpInput';
import styled from 'styled-components';
import { API_BASE_URL } from '../utils/apiConfig';
import { Link } from 'react-router-dom';

const ForgetPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePhoneNumber = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handlePhoneSubmit = async (event) => {
    event.preventDefault();

    // Validate phone number
    const regex = /[^0-9]/g;
    if (phoneNumber.length < 10 || regex.test(phoneNumber)) {
      alert("Invalid Phone Number");
      return;
    }

    const apiUrl = `${API_BASE_URL}/users/send-otp`;
    setIsLoading(true);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (response.ok) {
        setShowOtpInput(true);
        alert("OTP sent successfully");
      } else {
        const responseData = await response.json();
        alert(`Failed to send OTP: ${responseData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Failed to send OTP due to a network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (otp) => {
    const apiUrl = `${API_BASE_URL}/users/forgot-password`;
    setIsLoading(true);

    console.log(apiUrl);
    console.log(phoneNumber);
    console.log(otp);
    console.log(password);
    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber, otp, password }),
      });

      if (response.ok) {
        setIsSuccess(true);
        alert("Password reset successfully");
        // Redirect to login page or another appropriate action
      } else {
        const responseData = await response.json();
        alert(`Failed to reset password: ${responseData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Failed to reset password due to a network error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper className='section-center'>
      <div className="contain">
        <div>
          {!isSuccess ? (
            !showOtpInput ? (
              <form className="form" onSubmit={handlePhoneSubmit}>
                <h3>Forgotten Password:</h3>
                <input
                  className="formInput"
                  type="text"
                  value={phoneNumber}
                  onChange={handlePhoneNumber}
                  placeholder="Enter Phone Number"
                  disabled={isLoading}
                  autocomplete="tel"
                />
                <button
                  className="formSubmit"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending OTP..." : "Get Otp"}
                </button>
              </form>
            ) : (
              <form className="form" onSubmit={(e) => { e.preventDefault(); handleOtpSubmit(otp); }}>
                <h4>Enter OTP sent to {phoneNumber}</h4>
                <OtpInput length={6} onOtpSubmit={setOtp} />
                <input
                  className="formInput"
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autocomplete="new-password"
                />
                <button
                  className="formSubmit"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting Password..." : "Reset"}
                </button>
              </form>
            )
          ) : (
            <div className="success-message">
              <p><strong>{phoneNumber}</strong></p>
              <p> Password reset has been success</p>
              <img className="done" src="https://www.svgrepo.com/show/13650/success.svg" alt="successful" />
              <Link to="/login">Go to Login</Link>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

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
    background-color: #cd3240;
    border: 2px solid transparent;
    color: var(--clr-white); 
    width: 330px;
    padding-top: 8px;
    margin-top: 20px;
    align-items: center;
    cursor: pointer;
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

  @media (min-width: 992px) {
    height: calc(100vh - 5rem);
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
  .success-message {
    text-align: center;
    display: flex;
    padding: 10px;
    flex-direction: column;
    width: 350px;
    height: 200px;
    align-items: center;
  }

  .done {
    
    width: 50px;
    height: 50px;
   
  }

`;

export default ForgetPassword;
