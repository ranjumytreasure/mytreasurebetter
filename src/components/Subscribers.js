

// const Subscribers = () => {
//   const history = useHistory();
//   const { state } = useCompanySubscriberContext();
//   const { companySubscribers } = state;
//   const { user } = useUserContext();

//   const [nameFilter, setNameFilter] = useState('');

//   const handleBackButtonClick = () => {
//     history.goBack();
//   };

//   const handleMultiStepSubscriber = () => {
//     history.push(`/addcompanymultisubscriber/${user.results.userAccounts[0].parent_membership_id}`);
//   };

//   const filteredSubscribers = companySubscribers.filter((subscriber) =>
//     subscriber.name.toLowerCase().includes(nameFilter.toLowerCase())
//   );

//   if (!companySubscribers) {
//     return (
//       <>
//         <img src={loadingImage} className="loading-img" alt="loading" />
//         <div className="placeholder" style={{ height: '50vh' }}></div>
//       </>
//     );
//   }

//   return (
//     <Wrapper>
//       <div className="section-center">
//         <div className="header">
//           <h2 className="section-title">Company Subscribers ({filteredSubscribers.length})</h2>
//         </div>
//         <div className="smallheader">
//           <input
//             type="text"
//             placeholder="Filter by name"
//             value={nameFilter}
//             onChange={(e) => setNameFilter(e.target.value)}
//           />
//           <div className="button-group">
//             <button onClick={handleMultiStepSubscriber}>Add Subscriber Multistep</button>
//             <button onClick={handleBackButtonClick}>Back</button>
//           </div>
//         </div>
//         <div className="cocktails-center">
//           {filteredSubscribers.map((item) => (
//             <Subcriber key={item.id} {...item} />
//           ))}
//         </div>
//       </div>
//     </Wrapper>
//   );
// };

// const Wrapper = styled.section`
//   padding: 2rem 0;
//   background: var(--clr-white);

//   .header {
//     margin-bottom: 1rem;
//     text-align: center;
//   }

//   .section-title {
//     font-size: 1.75rem;
//     text-transform: capitalize;
//     letter-spacing: var(--mainSpacing);
//     margin-bottom: 2rem;
//     margin-top: 1rem;
//   }

//   .smallheader {
//     display: flex;
//     flex-direction: column;
//     gap: 1rem;
//     margin-bottom: 1.5rem;
//     padding: 0 1rem;
//   }

//   .smallheader input[type='text'] {
//     width: 100%;
//     height: 2.5rem;
//     padding: 0.5rem 1rem;
//     background: var(--clr-grey-10);
//     border-radius: 8px;
//     border: 1px solid transparent;
//     font-size: 1rem;
//     color: var(--clr-grey-5);
//   }

//   .smallheader input[type='text']::placeholder {
//     color: var(--clr-grey-5);
//   }

//   .button-group {
//     display: flex;
//     flex-direction: column;
//     gap: 0.5rem;
//   }

//   .button-group button {
//     background-color: var(--clr-primary-1);
//     color: var(--clr-white);
//     padding: 0.6rem 1rem;
//     border: none;
//     cursor: pointer;
//     font-size: 1rem;
//     border-radius: 8px;
//     width: 100%;
//   }
//   @media screen and (min-width: 768px) {
//     .smallheader {
//       flex-direction: row;
//       align-items: center;
//       justify-content: space-between;
//     }

//     .smallheader input[type='text'] {
//       width: 60%;
//     }

//     .button-group {
//       flex-direction: row;
//       gap: 1rem;
//       width: auto;
//     }

//     .button-group button {
//       width: auto;
//     }
//   }

//   .cocktails-center {
//     display: grid;
//     gap: 1.5rem;
//     padding: 0 1rem;
//   }

//   @media screen and (min-width: 576px) {
//     .cocktails-center {
//       grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
//     }
//   }

//   @media screen and (min-width: 992px) {
//     .section-title {
//       font-size: 2rem;
//     }
//   }
// `;

import { useState } from 'react';
import Subcriber from './Subcriber';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useCompanySubscriberContext } from '../context/companysubscriber_context';
import loadingImage from '../images/preloader.gif';
import { useUserContext } from '../context/user_context';
import { Grid, List } from 'lucide-react'; // For toggle icons

const Subscribers = () => {
  const history = useHistory();
  const { companySubscribers, isLoading, error } = useCompanySubscriberContext();

  const { user } = useUserContext();

  const [nameFilter, setNameFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const handleBackButtonClick = () => {
    history.goBack();
  };

  const handleMultiStepSubscriber = () => {
    history.push(`/addcompanymultisubscriber/${user.results.userAccounts[0].parent_membership_id}`);
  };

  const searchTerm = (nameFilter || "").toLowerCase();

  const filteredSubscribers = companySubscribers?.filter((subscriber) =>
    (subscriber?.name || "").toLowerCase().includes(searchTerm)
  );

  if (isLoading) {
    return (
      <>
        <img src={loadingImage} className="loading-img" alt="loading" />
        <div className="placeholder" style={{ height: '50vh' }}></div>
      </>
    );
  }

  return (
    <Wrapper>
      <div className="section-center">
        <div className="header">
          <h2 className="section-title">
            Company Subscribers ({filteredSubscribers.length})
          </h2>
          <div className="toggle-view">
            <button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'active' : ''}>
              <Grid size={18} />
            </button>
            <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'active' : ''}>
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="actions">
          <input
            type="text"
            placeholder="Search by name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
          <div className="button-group">
            <button onClick={handleMultiStepSubscriber}>+ Add Subscriber</button>
            <button onClick={handleBackButtonClick}>← Back</button>
          </div>
        </div>

        <div className={`subscribers-view ${viewMode}`}>
          {filteredSubscribers.map((item) => (
            <Subcriber key={item.id} {...item} view={viewMode} />
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default Subscribers;

const Wrapper = styled.section`
  padding: 2rem 1rem;
  background: #f9f9fb;

  .section-center {
    max-width: 1200px;
    margin: 0 auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .section-title {
    font-size: 1.75rem;
    font-weight: bold;
    color: #343a40;
  }

  .toggle-view {
    display: flex;
    gap: 0.5rem;
  }

  .toggle-view button {
    background: #e4e6eb;
    border: none;
    border-radius: 5px;
    padding: 0.4rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .toggle-view button.active,
  .toggle-view button:hover {
    background: #cd3240;
    color: white;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .actions input[type='text'] {
    padding: 0.75rem 1rem;
    border: 1px solid #ccc;
    border-radius: 10px;
    font-size: 1rem;
    width: 100%;
  }

  .button-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .button-group button {
    padding: 0.6rem 1rem;
    border: none;
    border-radius: 8px;
    background-color: #cd3240;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .button-group button:hover {
    background-color: #cd3240;
  }

  .subscribers-view.grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  .subscribers-view.list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .actions {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .actions input[type='text'] {
      flex: 1;
    }

    .button-group {
      flex-shrink: 0;
    }
  }
`;


