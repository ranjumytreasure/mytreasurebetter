import React, { useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

const Question = ({ title, info }) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div
        className="p-6 cursor-pointer"
        onClick={() => setShowInfo(!showInfo)}
      >
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800 pr-4 leading-relaxed">
            {title}
          </h4>
          <button
            className="flex-shrink-0 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo(!showInfo);
            }}
          >
            {showInfo ? (
              <AiOutlineMinus className="text-lg" />
            ) : (
              <AiOutlinePlus className="text-lg" />
            )}
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="pt-4">
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {info}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
