import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactFlagsSelect from "react-flags-select";
import "./flags.css";
import Alert from '../components/Alert';
import { API_BASE_URL } from '../utils/apiConfig';
import { useUserContext } from '../context/user_context';
import { uploadImage } from "../utils/uploadImage";
import AvatarUploader from '../components/AvatarUploader';


function Company() {
    const { user, updateUserCompany, userRole } = useUserContext();
    console.log(user);
    const [editMode, setEditMode] = useState(false);
    const [image, setImage] = useState('');
    const [formData, setFormData] = useState({
        companyName: '',
        companyLogo: '',
        registrationNo: '',
        tagLine: '',
        companySince: '',
        companyStreetAddress: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
        latitude: '',
        longitude: '',
        phone: '',
        email: '',
        countryCode: '',  // Default to 'auto'
        sourceSystem: 'WEB',
        companyId: '',
    });
    const [previewUrl, setPreviewUrl] = useState(image?.previewUrl || "https://i.imgur.com/ndu6pfe.png");
    const [errorMessage, setErrorMessage] = useState('')
    const [selectedCountry, setSelectedCountry] = useState('IN');
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

    
    useEffect(() => {
        const defaultCountry = countries.find((c) => c.value === selectedCountry);
        if (defaultCountry) {
            setFormData((prevData) => ({
                ...prevData, // ✅ Preserve existing form data
                country: defaultCountry.label,
                countryCode: defaultCountry.countryCode,
            }));
        }
    
        console.log("We are from useEffect");
        console.log(defaultCountry?.label); // ✅ Logs the correct country
        console.log(defaultCountry?.countryCode); // ✅ Logs the correct countryCode
    }, [selectedCountry]); // ✅ Added `countries` and `setFormData` to dependencies
    useEffect(() => {
        console.log("FormData updated:", formData);
    }, [formData]);
    
    useEffect(() => {
        if (user?.results?.userCompany) {
            setEditMode(true);
            const companyData = user.results.userCompany;
            console.log('Kandrul');
            console.log(companyData);
    
            // Find the country object based on the country name from DB
            const countryObj = countries.find((c) => c.countryCode === companyData.country_code) || {};
    
            // ✅ Set all form data in one go to prevent overwrites
            setFormData(prev => ({
                ...prev,
                companyName: companyData.name || '',
                companyLogo: companyData.logo || '',
                tagLine: companyData.tagline || '',
                registrationNo: companyData.registration_no || '',
                companySince: companyData.company_since ? companyData.company_since.split('-')[0] : '',
                companyStreetAddress: companyData.street_address || '',
                city: companyData.city || '',
                state: companyData.state || '',
                country: companyData.country || '',
                countryCode: companyData.country_code || countryObj.countryCode || '',
                zipcode: companyData.zipcode || '',
                latitude: companyData.latitude || 0,
                longitude: companyData.longitude || 0,
                phone: companyData.phone || '',
                    email: companyData.email || '',
                companyId: companyData.id || '',
                sourceSystem: 'WEB',
            }));
    
            // ✅ Set preview URL for company logo
            if (companyData.logo_s3_image) {
                setPreviewUrl(companyData.logo_s3_image);
            }
    
            // ✅ Ensure selected country is updated
            if (selectedCountry !== (countryObj.value || '')) {
                setSelectedCountry(countryObj.value || '');
            }
        } else {
            setEditMode(false); // Reset edit mode if no company data
            setFormData((prevData) => ({
                ...prevData, // ✅ Preserve previous values
                companyName: '',
                registrationNo: '',
                companyLogo: '',
                tagLine: '',
                companySince: '',
                companyStreetAddress: '',
                city: '',
                state: '',
                zipcode: '',
                latitude: 0,
                longitude: 0,
                phone: '',
                email: '',
                companyId: '',
                sourceSystem: 'WEB',
            }));
        }
    }, [user]); // Include countries in dependency array if needed
    

    
    



    const [signupMessage, setSignupMessage] = useState('');
    const [membershipId, setMembershipId] = useState(user.results.userAccounts[0]?.parent_membership_id
    );


    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State for controlling loading bar

    const showSelectedLabel = true; // Change this to true or false based on your requirement
    const searchable = true;

    const [list, setList] = useState([]);
    const [alert, setAlert] = useState({ show: false, msg: '', type: '' });







    const extractImageNumber = (url) => {
        if (!url) return '';
        const match = url.match(/compressed-(\d+)\.jpg$/);
        return match ? match[1] : ''; // Extracts only the number after "compressed-"
    };
    const handleCountryChange = (value) => {
        setSelectedCountry(value);

        // Find the selected country object from the countries array
        const selectedCountryObj = countries.find((country) => country.value === value);
        console.log(value);
        console.log(selectedCountryObj);
        console.log(selectedCountryObj.label);
        console.log(selectedCountryObj.countryCode);
        if (selectedCountryObj) {
            // Reset the formData state with the country code and label from the selected country
            setFormData((prevData) => ({
                ...prevData,
                country: selectedCountryObj.label,
                countryCode: selectedCountryObj.countryCode,

            }));

        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setIsLoading(true); // Show loading bar when data fetching starts

     


        try {
            console.log('Pannipaya');
            let companyLogoUrl = formData.companyLogo;
            console.log('companyLogoUrl', formData.companyLogo);
            console.log( formData.companyLogo);
            if(!editMode)
            {
                console.log('came to insert')
                    companyLogoUrl = await uploadImage(image.file, API_BASE_URL, setErrorMessage)
             } else 
                {
                    console.log(image?.file)
                    console.log('came to edit')
                    if (image && typeof image === "object" && image.file) {
                        console.log('inside about to upload')
                        companyLogoUrl = await uploadImage(image.file, API_BASE_URL, setErrorMessage);
                    }
            //         console.log('came to edit')
            // console.log('Original Image URL:', formData.companyLogo);
            

            // console.log('Selected Image:', image?.file);
            // console.log('step 1')
           
            
            // if (image?.file ) {
               
            //     console.log('step 2')
               
            //     console.log(image?.file)
            //     console.log(user?.results?.userCompany?.logo )

            //     const existingImageNumber = user?.results?.userCompany?.logo 
            //     ? extractImageNumber(user.results.userCompany.logo) 
            //     : "";
            //     console.log('Extracted Existing Image Number:', existingImageNumber);

            //     const newFileName = image.file.name;
            //     const newImageNumber = newFileName ? extractImageNumber(newFileName) : "";

            //     console.log('Extracted New Image Number:', newImageNumber);

            //     if (existingImageNumber !== newImageNumber) {
            //         console.log('Uploading new image...');
            //         // companyLogoUrl = await uploadImage(image.file, API_BASE_URL, setErrorMessage);
            //     } 
            
            // } else {
            //     console.log('No new image selected, preserving old image.');
            //     companyLogoUrl = user.results.userCompany.logo;
            // }
            // console.log('mani')
                }
            // Include membershipId in the formData
            const updatedFormData = {
                ...formData,
                membershipId: membershipId,
                companyLogo: companyLogoUrl,
            };

            const apiUrl = `${API_BASE_URL}/company`;
            const method = editMode ? 'PUT' : 'POST';
            const response = await fetch(apiUrl, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${user?.results?.token}`, // Include the Bearer token
                    'Content-Type': 'application/json',
                    'X-User-Role': userRole, // Include the user role in a custom header
                },
                body: JSON.stringify(updatedFormData),
            });

            const responseData = await response.json();
            if (response.ok) {


                // Assuming you have received the updated company data in the `responseData` from your API call
                const updatedUserCompanyData = responseData.results;

                console.log('Vakaoli');
                console.log(updatedUserCompanyData);
                // Use the `updateUserCompany` function from the user context to update the user's company data
                updateUserCompany(updatedUserCompanyData);

                // updateUserCompany(updatedUserCompanyData);
                showAlert(true, 'success', responseData.message);
            } else {

                // Handle error response        
                showAlert(true, 'danger', responseData.errors || responseData.message || "An error occurred");

            }
        } catch (error) {
            // Handle network or fetch error, update the message state
            setSignupMessage('An error occurred');
        } finally {
            setIsLoading(false); // Hide loading bar when data fetching is complete
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    
   

    const showAlert = (show = false, type = '', msg = '') => {
        console.log('hi');
        setAlert({ show, type, msg });
    };


    const handleCheckboxChange = (e) => {
        setAgreedToTerms(e.target.checked);
    };


    const requiredFields = [
        "phone", "email", "companyName", "tagLine", "companySince",
        "companyStreetAddress", "city", "state", "zipcode"
    ];
    const isButtonDisabled = !agreedToTerms || requiredFields.some(field => !formData[field]);





    const handleSetImage = (file) => {
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setPreviewUrl(fileURL);
            setImage({ file, previewUrl: fileURL }); // ✅ Store both file & preview URL
            console.log('New image');
            console.log(file);
            console.log(fileURL);
            console.log(previewUrl);
            setFormData(prev => ({ ...prev, companyLogo: fileURL }));
        }
    };

    return (
        <Wrapper className='section-center'>
            <div className="contain">
                <h3>{editMode ? 'Edit Company' : 'New Company'}</h3>
                <ReactFlagsSelect
                    selected={selectedCountry}
                    onSelect={handleCountryChange}
                    countries={countries.map((country) => country.value)}
                    showSelectedLabel={showSelectedLabel}
                    searchable={searchable}
                />

                <form className="form" onSubmit={handleSubmit}>


                    {/* AvatarUploader Component */}
                    <AvatarUploader handleSetImage={handleSetImage} currentImage={previewUrl} />

                    <input className="formInput" type="text" placeholder="Company Name" name="companyName" onChange={handleChange} value={formData.companyName} />
                    <input className="formInput" type="text" placeholder="Company Tagline" name="tagLine" onChange={handleChange} value={formData.tagLine} />
                    <input className="formInput" type="text" placeholder="Registration No" name="registrationNo" onChange={handleChange} value={formData.registrationNo} />
                    <input className="formInput" type="text" placeholder="Company Since" name="companySince" onChange={handleChange} value={formData.companySince} />
                    <input className="formInput" type="text" placeholder="Company Street Address" name="companyStreetAddress" onChange={handleChange} value={formData.companyStreetAddress} />
                    <input className="formInput" type="text" placeholder="City" name="city" onChange={handleChange} value={formData.city} />
                    <input className="formInput" type="text" placeholder="State" name="state" onChange={handleChange} value={formData.state} />

                    <input className="formInput" type="text" placeholder="Zipcode" name="zipcode" onChange={handleChange} value={formData.zipcode} />

                    <input className="formInput" type="text" placeholder="Company Phone" name="phone" onChange={handleChange} value={formData.phone} />
                    <input className="formInput" type="email" placeholder="Company Email" name="email" onChange={handleChange} value={formData.email} />

                    <div className="terms-checkbox">
                        <input type="checkbox" id="termsCheckbox" onChange={handleCheckboxChange} />
                        <label htmlFor="termsCheckbox">
                            By continuing, you agree to our Terms of Use, Privacy Policy, E-sign & communication Authorization.
                        </label>
                    </div>
                    {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}

                    {editMode ? (
                        <button
                            className={`formComSubmit ${isButtonDisabled || isLoading ? 'disabled' : ''}`}
                            type="submit"
                            disabled={isButtonDisabled || isLoading}
                        >
                            {isLoading ? 'Editing...' : 'Edit'}
                        </button>
                    ) : (
                        <button
                            className={`formComSubmit ${isButtonDisabled || isLoading ? 'disabled' : ''}`}
                            type="submit"
                            disabled={isButtonDisabled || isLoading}
                        >
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </button>
                    )}

                </form>
            </div>
        </Wrapper>
    );
}
const Wrapper = styled.section`
display: flex;
flex-direction: column;
align-items: center;

.contain {  
    width: 35rem;
    margin-top: 2rem;
    margin-bottom: 4rem;
padding-top: 35px;
display: flex;
flex-direction: column;
background: var(--clr-white);
border-radius: var(--radius);
box-shadow: var(--light-shadow);
transition: var(--transition);
min-height: 900px; 
align-items: center;
  }
  .contain:hover {
      box-shadow: var(--dark-shadow);
    }
  

.form {
    display:flex;
    flex-direction: column;
align-items: center;      
width:35rem;
    @media (max-width: 768px) {
        width: 90%; /* Adjust the width for screens with a max-width of 768px */
        height: 90vh; /* Adjust the height for smaller screens */
        padding: 0.5rem; /* Reduce padding for smaller screens */
      }
    
      @media (max-width: 480px) {
        width: 95%; /* Further adjust the width for screens with a max-width of 480px */
        height: 85vh; /* Further adjust the height for smaller screens */
        padding: 0.25rem; /* Reduce padding for smaller screens */
      }
}

.formInput {
    border-radius: 5px;
    border-color: #e5e5e5;
    border-style: solid;
    border-width: 0.5px;
    margin-bottom: 10px;
    padding: 10px;
    width:250px;
}
.custom-button {
    background-color: #FF5733; 
    width:250px;
  }
.formComSubmit {
    cursor:pointer;
    border-radius: 5px;
    background-color:#cd3240;
    border: 2px solid transparent;
    color: white; 
    width: 300px;
    padding: 8px;
margin-top:20px;
align-items: center;
}
/* Disabled button style */
.formComSubmit.disabled {
    background-color: #ccc; 
    cursor: not-allowed;
    width: 250px;
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
`
export default Company;
