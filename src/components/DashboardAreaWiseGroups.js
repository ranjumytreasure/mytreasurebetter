// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import DashboardAreaWiseAccounts from './DashboardAreaWiseAccounts';
// import DashboardSubscriberGroupWiseAccounts from './DashboardSubscriberGroupWiseAccounts';


// const DashboardAreaWiseGroups = () => {
//     return (<section className='section'>
//         <Wrapper className='section-center' >
//             <DashboardAreaWiseAccounts />
//             <DashboardSubscriberGroupWiseAccounts />
//         </Wrapper>
//     </section>

//     );
// };
// const Wrapper = styled.div`
//   padding-top: 2rem;
//   display: grid;
//   gap: 3rem 2rem;
//   @media (min-width: 992px) {
//     grid-template-columns: 1fr 1fr;
//   }
//   /* align-items: start; */
// `;

// export default DashboardAreaWiseGroups;

import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardAreaWiseAccounts from './DashboardAreaWiseAccounts';
import DashboardSubscriberGroupWiseAccounts from './DashboardSubscriberGroupWiseAccounts';

const DashboardAreaWiseGroups = () => {
  const [showAreaWise, setShowAreaWise] = useState(false);
  const [showSubscriberWise, setShowSubscriberWise] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Detailed Analytics</h2>
        <p className="text-blue-100 text-sm">Area-wise and subscriber-wise receivables breakdown</p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {/* Area Wise Receivables */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button 
              className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between text-left"
              onClick={() => setShowAreaWise(!showAreaWise)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Area Wise Receivables</h3>
                  <p className="text-sm text-gray-600">Breakdown by geographical areas</p>
                </div>
              </div>
              <span className="text-gray-400 text-xl">{showAreaWise ? '−' : '+'}</span>
            </button>
            {showAreaWise && (
              <div className="border-t border-gray-200 p-6 bg-white">
                <DashboardAreaWiseAccounts />
              </div>
            )}
          </div>

          {/* Subscriber Group Wise Receivables */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button 
              className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between text-left"
              onClick={() => setShowSubscriberWise(!showSubscriberWise)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">👥</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Subscriber Group Wise Receivables</h3>
                  <p className="text-sm text-gray-600">Breakdown by subscriber groups</p>
                </div>
              </div>
              <span className="text-gray-400 text-xl">{showSubscriberWise ? '−' : '+'}</span>
            </button>
            {showSubscriberWise && (
              <div className="border-t border-gray-200 p-6 bg-white">
                <DashboardSubscriberGroupWiseAccounts />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionWrapper = styled.section`
  display: flex;
  justify-content: center;
  padding: 1rem;

  .accordion-wrapper {
    width: 100%;
    max-width: 800px; /* About half screen width */
  }

  .accordion-section {
    margin-bottom: 2rem;
    border-radius: var(--radius);
    overflow: hidden;
    background-color: var(--clr-white);
    box-shadow: var(--light-shadow);
    border: 1px solid var(--clr-grey-10);
  }

 .accordion-header {
  background-color: #cd3240;
  color: white;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.accordion-header h3 {
  color: #f7f7f5ff; /* Replace with your desired color (e.g., yellow) */
  margin: 0;
}

.accordion-header:hover {
  background-color: #b02a34;
}

  .accordion-body {
    padding: 1.5rem;
    background-color: white;
    animation: slideDown 0.3s ease-in-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .accordion-wrapper {
      width: 100%;
      padding: 0 1rem;
    }
  }
`;

export default DashboardAreaWiseGroups;



