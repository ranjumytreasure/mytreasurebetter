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
    <SectionWrapper className="section">
      <div className="accordion-wrapper">
        <div className="accordion-section">
          <div className="accordion-header" onClick={() => setShowAreaWise(!showAreaWise)}>
            <h3>📍 Area Wise Receivables</h3>
            <span>{showAreaWise ? '−' : '+'}</span>
          </div>
          {showAreaWise && (
            <div className="accordion-body">
              <DashboardAreaWiseAccounts />
            </div>
          )}
        </div>

        <div className="accordion-section">
          <div className="accordion-header" onClick={() => setShowSubscriberWise(!showSubscriberWise)}>
            <h3>👤 Subscriber Groupwise Receivables</h3>
            <span>{showSubscriberWise ? '−' : '+'}</span>
          </div>
          {showSubscriberWise && (
            <div className="accordion-body">
              <DashboardSubscriberGroupWiseAccounts />
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
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



