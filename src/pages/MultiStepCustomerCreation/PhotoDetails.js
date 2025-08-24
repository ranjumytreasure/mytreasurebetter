import React, { useContext, useEffect, useState } from "react";
import AppContext from "./Context";
import AvatarUploader from '../../components/AvatarUploader';
import "./Multistepdesignstyles.css";
import ReactFlagsSelect from "react-flags-select";

// Define countries array
const countries = [
  { value: "IN", label: "India", countryCode: "+91" },
  { value: "GB", label: "United Kingdom", countryCode: "+44" },
  { value: "LK", label: "Srilanka", countryCode: "+94" },
  { value: "NP", label: "Nepal", countryCode: "+977" },
  { value: "MY", label: "Malaysia", countryCode: "+60" },
  { value: "AE", label: "United Arab Emirates", countryCode: "+971" },
  { value: "SG", label: "Singapore", countryCode: "+65" },
  { value: "PK", label: "Pakistan", countryCode: "+92" },
  { value: "NG", label: "Nigeria", countryCode: "+234" },
  { value: "GH", label: "Ghana", countryCode: "+233" },
  { value: "TT", label: "Trinidad and Tobago", countryCode: "+1-868" },
  { value: "KE", label: "Kenya", countryCode: "+254" },
  { value: "ZA", label: "South Africa", countryCode: "+27" },
];

const PhotoDetails = () => {
  const { photoDetails = {}, stepDetails = {}, personalDetails = {} } = useContext(AppContext);
  const { image, setImage } = photoDetails; // Use context
  const { setStep } = stepDetails;
  const { setNationality } = personalDetails;

  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [previewUrl, setPreviewUrl] = useState(image?.previewUrl || "https://i.imgur.com/ndu6pfe.png");

  useEffect(() => {
    // Sync preview image when coming back to the page
    if (image?.previewUrl) {
      setPreviewUrl(image.previewUrl);
    }
  }, [image]);

  const handleCountryChange = (countryCode) => {
    setSelectedCountry(countryCode);
    setNationality(countryCode);
  };

  const handleNext = () => setStep((prevStep) => prevStep + 1);

  const handleSetImage = (file) => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPreviewUrl(fileURL);
      setImage({ file, previewUrl: fileURL }); // ✅ Store both file & preview URL
    }
  };

  return (
    <div className="multistepcontainer">
      <h2>Photo Details</h2>
      <div className="formContain">
        <form className="form">
          <label htmlFor="country-select">Select your nationality:</label>
          <ReactFlagsSelect
            id="country-select"
            selected={selectedCountry}
            onSelect={handleCountryChange}
            countries={countries.map((country) => country.value)}
            showSelectedLabel={true}
            searchable={true}
          />
          <p>
            Selected Country: {countries.find((c) => c.value === selectedCountry)?.label} (
            {countries.find((c) => c.value === selectedCountry)?.countryCode})
          </p>

          {/* AvatarUploader Component */}
          <AvatarUploader handleSetImage={handleSetImage} currentImage={previewUrl} />

          <button type="button" className="formSubmit" onClick={handleNext}>
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default PhotoDetails;
