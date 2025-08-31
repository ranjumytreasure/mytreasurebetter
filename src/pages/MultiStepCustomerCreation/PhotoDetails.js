import React, { useContext, useEffect, useState } from "react";
import AppContext from "./Context";
import AvatarUploader from '../../components/AvatarUploader';
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
    <div className="max-w-2xl mx-auto my-4 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
      <div className="bg-red-600 text-white p-6 text-center">
        <h2 className="text-2xl font-bold font-['Poppins']">Photo Details</h2>
      </div>
      <div className="p-8">
        <div className="flex flex-col p-4 w-full max-w-lg mx-auto">
          <form className="flex flex-col">
            <label htmlFor="country-select" className="text-sm font-medium text-gray-700 mb-2">
              Select your nationality:
            </label>
            <div className="mb-4">
              <ReactFlagsSelect
                id="country-select"
                selected={selectedCountry}
                onSelect={handleCountryChange}
                countries={countries.map((country) => country.value)}
                showSelectedLabel={true}
                searchable={true}
                className="w-full"
              />
            </div>
            <p className="text-sm text-gray-600 mb-6 p-3 bg-gray-50 rounded-lg">
              Selected Country: {countries.find((c) => c.value === selectedCountry)?.label} (
              {countries.find((c) => c.value === selectedCountry)?.countryCode})
            </p>

            {/* AvatarUploader Component */}
            <div className="mb-6">
              <AvatarUploader handleSetImage={handleSetImage} currentImage={previewUrl} />
            </div>

            <button
              type="button"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:from-red-700 hover:to-red-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-600/30"
              onClick={handleNext}
            >
              Next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetails;
