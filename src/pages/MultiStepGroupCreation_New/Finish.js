import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import AppContext from "./Context";
import WhatsNext from "../../components/WhatsNext";
import { useUserContext } from "../../context/user_context";

export default function Finish() {
  const { isLoggedIn } = useUserContext();
  const { groupDetails: updateContext } = useContext(AppContext);
  const history = useHistory();

  const name = updateContext.groupName;
  const groupId = updateContext.groupId;

  const handleBackButtonClick = () => {
    history.push("/chit-fund/user/home");
  };

  return (
    <div className="max-w-4xl mx-auto my-6 bg-white rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white p-8 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-3xl font-bold font-['Poppins'] mb-2">Group Created Successfully</h2>
          <p className="text-green-100 text-sm">Your group has been created and is ready to use</p>
        </div>
      </div>
      <div className="p-8 flex flex-col items-center">
        <div className="text-center mb-6">
          <p className="text-lg text-gray-700 mb-2">
            New Group <strong className="text-red-600 font-bold">{name}</strong> has been created successfully
          </p>
          <p className="text-gray-600">Thanks for your details</p>
        </div>

        <div className="mb-8">
          <img
            src="https://www.svgrepo.com/show/13650/success.svg"
            alt="successful"
            className="w-32 h-32 mx-auto"
          />
        </div>

        {isLoggedIn && (
          <button
            onClick={handleBackButtonClick}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-300 hover:from-red-700 hover:to-red-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-600/30 flex items-center justify-center gap-2 mb-8"
          >
            <span>←</span>
            Back to Home
          </button>
        )}

        <div className="w-full flex justify-center">
          <WhatsNext groupId={groupId} />
        </div>
      </div>
    </div>
  );
}
