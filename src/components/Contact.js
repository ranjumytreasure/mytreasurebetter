import React, { useState } from 'react'
import { FaEnvelope, FaPaperPlane, FaGift, FaCheckCircle } from 'react-icons/fa'

const Contact = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      // Here you would typically send the email to your backend
      setTimeout(() => {
        setIsSubmitted(false)
        setEmail('')
      }, 3000)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white rounded-full opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
              <FaGift className="w-4 h-4 mr-2" />
              Special Offer
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join our newsletter and get 20% off
            </h2>

            <p className="text-lg text-red-100 leading-relaxed mb-8">
              Stay updated with the latest news, promotions, and exclusive offers from our platform. Join our newsletter today and receive a special 20% discount on your next subscription. Don't miss out on the opportunity to save on our premium features.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-red-100">Exclusive updates and news</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-red-100">Special promotions and discounts</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-red-100">Early access to new features</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            {isSubmitted ? (
              <div className="text-center py-8">
                <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600">You've successfully subscribed to our newsletter.</p>
              </div>
            ) : (
              <div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaEnvelope className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Started Today</h3>
                  <p className="text-gray-600">Enter your email to receive your discount</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <FaPaperPlane className="w-5 h-5" />
                    <span>Subscribe & Get 20% Off</span>
                  </button>
                </form>

                <p className="text-xs text-gray-500 text-center mt-4">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
