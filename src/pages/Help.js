import React, { useState } from 'react';
import people from '../components/HelpData';
import { FaChevronLeft, FaChevronRight, FaQuoteRight, FaPhone, FaEnvelope } from 'react-icons/fa';

const Help = () => {
  const [index, setIndex] = useState(0);
  const { name, job, image, text, phone } = people[index];

  const checkNumber = (number) => {
    if (number > people.length - 1) {
      return 0;
    }
    if (number < 0) {
      return people.length - 1;
    }
    return number;
  };

  const nextPerson = () => {
    setIndex((index) => {
      let newIndex = index + 1;
      return checkNumber(newIndex);
    });
  };

  const prevPerson = () => {
    setIndex((index) => {
      let newIndex = index - 1;
      return checkNumber(newIndex);
    });
  };

  const randomPerson = () => {
    let randomNumber = Math.floor(Math.random() * people.length);
    if (randomNumber === index) {
      randomNumber = index + 1;
    }
    setIndex(checkNumber(randomNumber));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Contact Our <span className="text-red-600">Support Team</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto">
            Get in touch with our dedicated support team members who are here to help you with any questions or concerns.
          </p>
        </div>

        {/* Support Team Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
          <div className="p-8 md:p-12">
            {/* Profile Image Section */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-full transform rotate-6"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <FaQuoteRight className="text-white text-sm" />
              </div>
            </div>

            {/* Content Section */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{name}</h3>
              <div className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold mb-6 uppercase tracking-wide">
                {job}
              </div>

              <p className="text-gray-600 leading-relaxed mb-8 text-lg max-w-2xl mx-auto">
                {text}
              </p>

              {/* Navigation Buttons */}
              <div className="flex justify-center items-center space-x-4 mb-8">
                <button
                  onClick={prevPerson}
                  className="w-12 h-12 bg-gray-100 hover:bg-red-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                >
                  <FaChevronLeft className="text-lg" />
                </button>

                <div className="flex space-x-2">
                  {people.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setIndex(idx)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === index ? 'bg-red-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextPerson}
                  className="w-12 h-12 bg-gray-100 hover:bg-red-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                >
                  <FaChevronRight className="text-lg" />
                </button>
              </div>

              {/* Contact Button */}
              <button
                onClick={randomPerson}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-6"
              >
                Contact {name}
              </button>

              {/* Phone Number */}
              {phone && (
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <FaPhone className="text-red-500" />
                  <span className="font-medium">{phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPhone className="text-red-500 text-xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Phone Support</h3>
            <p className="text-gray-600 text-sm">Available 24/7 for urgent queries</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-red-500 text-xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm">Get detailed responses within 24 hours</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaQuoteRight className="text-red-500 text-xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm">Instant support during business hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Help
