import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import ReactFlagsSelect from "react-flags-select";
import "./flags.css";
import { Link } from 'react-router-dom';
import LoadingBar from './LoadingBar';
import Alert from '../components/Alert';
import { API_BASE_URL } from '../utils/apiConfig';

function SignUp() {


    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        password: '',
        country: 'Auto-detect', // Default to Auto-detect
        countryCode: 'auto',  // Default to 'auto'
        sourceSystem: 'WEB',
    });

    const [otp, setOtp] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('auto');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State for controlling loading bar

    const showSelectedLabel = true; // Change this to true or false based on your requirement
    const searchable = true;
    const [list, setList] = useState([]);
    const [alert, setAlert] = useState({ show: false, msg: '', type: '' });
    const [showSuccess, setShowSuccess] = useState(false);

    const countries = [
        { value: "IN", label: "India", countryCode: "+91" },
        { value: "GB", label: "United Kingdom", countryCode: "+44" },
        { value: "LK", label: "Srilanka", countryCode: "+94" },
        { value: "NP", label: "Nepal", countryCode: "+977" },
        { value: "MY", label: "Malaysia", countryCode: "+60" },
        { value: "AE", label: "United Arab Emirates", countryCode: "+971" },
        { value: "SG", label: "Singapore", countryCode: "+65" },
        { value: "PK", label: "Pakistan", countryCode: "+92" }, // Corrected country code to PK
        { value: "NG", label: "Nigeria", countryCode: "+234" }, // Corrected country code to NG
        { value: "GH", label: "Ghana", countryCode: "+233" }, // Corrected country code to GH
        { value: "TT", label: "Trinidad and Tobago", countryCode: "+1-868" }, // Corrected country code to TT
        { value: "KE", label: "Kenya", countryCode: "+254" }, // Corrected country code to KE
        { value: "ZA", label: "South Africa", countryCode: "+27" }
    ];

    const detectUserCountry = async () => {
        try {
            const response = await fetch('https://ip-api.com/json/');
            if (response.ok) {
                const data = await response.json();
                console.log('Detected Country Data:', data);
                // Find the corresponding country object in the countries array
                const detectedCountry = countries.find(
                    (country) => country.value === data.countryCode
                );

                if (detectedCountry) {
                    // Update the selectedCountry state with the detected country code
                    setSelectedCountry(detectedCountry.value);
                    // Update the formData with the detected country details
                    setFormData((prevData) => ({
                        ...prevData,
                        country: detectedCountry.label,
                        countryCode: detectedCountry.countryCode,
                    }));

                }
            }
        } catch (error) {
            console.error('Error detecting user country:', error);
        }
    };

    useEffect(() => {
        // Detect user's country if not auto-detected
        if (selectedCountry === 'auto') {
            detectUserCountry();
        }
    }, [selectedCountry]);

    const handleSubmit = async (e) => {
        const apiUrl = `${API_BASE_URL}/signup`;

        e.preventDefault();
        setIsLoading(true); // Show loading bar when data fetching starts
        console.log(formData);
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const responseData = await response.json();
            console.log('nmani');
            console.log(responseData);
            if (response.ok) {

                setShowSuccess(true); // show success message & animation
                return;
                // showAlert(true, 'success', responseData.message || 'Registered Successfully. Try Login');
                // console.log('Sign up success');
                // console.log(responseData);
                // // Sign-up successful, update the message state
                // setSignupMessage('Sign-up successful');
                // if (responseData && responseData.results && responseData.results.otp) {
                //     setOtp(responseData.results.otp);
                // }
                // const mobileNumber = formData.phone; // Replace with actual mobile number
                // history.push(`/verify-otp?mobile=${mobileNumber}`);

            } else {

                // Sign-up failed, update the message state

                showAlert(true, 'danger', responseData.message);

            }
        } catch (error) {
            // Handle network or fetch error, update the message state

        } finally {
            setIsLoading(false); // Hide loading bar when data fetching is complete
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCountryChange = (value) => {
        setSelectedCountry(value);

        // Find the selected country object from the countries array
        const selectedCountryObj = countries.find((country) => country.value === value);

        if (selectedCountryObj) {
            // Reset the formData state with the country code and label from the selected country
            setFormData((prevData) => ({
                ...prevData,
                country: selectedCountryObj.label,
                countryCode: selectedCountryObj.countryCode,
            }));

        }
    };

    const showAlert = (show = false, type = '', msg = '') => {

        setAlert({ show, type, msg });
    };


    const handleCheckboxChange = (e) => {
        setAgreedToTerms(e.target.checked);
    };
    const isButtonDisabled = !agreedToTerms || !formData.phone || !formData.email || !formData.password;
    return (
        <Wrapper className='section-center'>

            <div className="contain">
                {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}

                {!showSuccess && (
                    <>
                        <h3>Lets get started</h3>
                        <ReactFlagsSelect
                            selected={selectedCountry}
                            onSelect={handleCountryChange}
                            countries={countries.map((country) => country.value)}
                            showSelectedLabel={showSelectedLabel}
                            searchable={searchable}
                        />
                        <form className="form" onSubmit={handleSubmit}>

                            <input className="formInput" type="text" placeholder="Phone" name="phone" onChange={handleChange} />
                            <input className="formInput" type="email" placeholder="Email" name="email" onChange={handleChange} />
                            <input className="formInput" type="password" placeholder="Password" name="password" onChange={handleChange} />
                            <div className="terms-checkbox">
                                <input type="checkbox" id="termsCheckbox" onChange={handleCheckboxChange} />
                                <label htmlFor="termsCheckbox">
                                    By continuing, you agree to our Terms of Use, Privacy Policy, E-sign & communication Authorization.
                                </label>
                            </div>
                            <button
                                className={`formSubmit ${isButtonDisabled || isLoading ? 'disabled' : ''}`}
                                type="submit"
                                disabled={isButtonDisabled || isLoading}
                            >
                                {isLoading ? 'Signing Up...' : 'Sign Up'}
                            </button>

                        </form>



                        <p>
                            Already a user? <Link to="/login">Sign in</Link>
                        </p>

                        {/* {signupMessage && <p>{signupMessage}</p>} */}
                        {otp && <p>OTP sent to your mobile: {otp}</p>}
                    </>
                )}

                {showSuccess && (
                    <div className="success-container">
                        <div className="success-icon">&#10004;</div> {/* Unicode checkmark */}
                        <p className="success-message">Signup successful!</p>
                        <p className="success-subtext">Try logging in below</p>
                        <Link to="/login" className="login-button">Login</Link>
                    </div>
                )}
            </div>
        </Wrapper>
    );
}
const Wrapper = styled.section`
display: flex;
flex-direction: column;
justify-content: space-between;
align-items: center;

.contain {  
    max-width: 30rem;
      margin-top: 2rem;
      margin-bottom: 4rem;
  padding-top: 35px;
  display: flex;
  flex-direction: column;
  background: var(--clr-white);
  border-radius: var(--radius);
  box-shadow: var(--light-shadow);
  transition: var(--transition);
  padding: 2rem;
  width: 90vw;
  height: 500px;
  margin: 10 auto;
  align-items: center;
  }
  
  
  .contain:hover {
      box-shadow: var(--dark-shadow);
    }
  

.form {
    display: flex;
    padding: 10px;
    flex-direction: column;
    width: 350px;
    height: 300px;
}

.formInput {
    border-radius: 5px;
    border-color: #e5e5e5;
    border-style: solid;
    border-width: 0.5px;
    margin-bottom: 10px;
    padding: 10px;
}
.custom-button {
    background-color: #FF5733; /* Change to your desired background color */
    /* You can also add other styles like text color, padding, etc. */
  }
.formSubmit {
    cursor:pointer;
    border-radius: 5px;
    background-color:#cd3240;
    border: 2px solid transparent;
    color: white; 
    width: 330px;
    padding-top: 8px;
margin-top:20px;
align-items: center;
}
/* Disabled button style */
.formSubmit.disabled {
    background-color: #ccc; /* Change the background color when disabled */
    cursor: not-allowed; /* Change cursor to not-allowed when disabled */
}

.terms-checkbox {
    display: flex;
    align-items: center;
    margin-top: 10px; /* Adjust the margin as needed */
  }
  
  .terms-checkbox input[type="checkbox"] {
    margin-right: 10px; /* Adjust the margin between the checkbox and label */
  }
  
  .terms-checkbox label {
    font-size: 14px; /* Adjust the font size as needed */
    color: #333; /* Adjust the text color */
  }   
  
  .p {
    margin-top:1rem;
  }
  @media (min-width: 992px) 
  {
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
    .success-container {
  text-align: center;
  margin-top: 2rem;
  animation: fadeIn 0.6s ease-in-out;
}

.success-icon {
  font-size: 4rem;
  color: green;
  animation: pop 0.6s ease;
  margin-bottom: 0.5rem;
}

.success-message {
  font-size: 1.5rem;
  color: green;
  margin-bottom: 0.25rem;
}

.success-subtext {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.login-button {
  display: inline-block;
  background-color: #28a745;
  color: white;
  padding: 0.5rem 1.2rem;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #218838;
}

/* Tick animation */
@keyframes pop {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

`
export default SignUp;
