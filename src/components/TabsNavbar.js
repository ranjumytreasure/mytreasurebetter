import React, { useState, useEffect } from 'react'; // Import React and necessary hooks
import styled from 'styled-components';

const TabsNavbar = ({ selectedTab, onSelectTab, groups }) => {
  // Use state to store the counts
  const [readyCount, setReadyCount] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [closedCount, setClosedCount] = useState(0);
  // Use useEffect to update the counts when the groups prop changes
  useEffect(() => {
    // Calculate the counts based on the groups data
    const readyGroupsCount = groups.filter(group => group.Status === 'Ready').length;
    const newGroupsCount = groups.filter(group => group.Status === 'New').length;
    const closedGroupsCount = groups.filter(group => group.Status === 'Closed').length;

    // Update the state with the counts
    setReadyCount(readyGroupsCount);
    setNewCount(newGroupsCount);
    setClosedCount(closedGroupsCount);
  }, [groups]);

  return (
    <Wrapper>
      <ul className='grid'>
        <li
          onClick={() => onSelectTab('ready')}
          className={selectedTab === 'ready' ? 'active' : ''}
        >
          Ready for auction ({readyCount})
        </li>
        <li
          onClick={() => onSelectTab('new')}
          className={selectedTab === 'new' ? 'active' : ''}
          style={{ marginLeft: "12px" }}
        >
          Preping for auction({newCount})
        </li>
        <li
          onClick={() => onSelectTab('closed')}
          className={selectedTab === 'closed' ? 'active' : ''}
          style={{ marginLeft: "12px" }}
        >
          Closed Groups ({closedCount})
        </li>
      </ul>
    </Wrapper>
  );
};
// const Wrapper = styled.div`


// .grid {
//   display: flex;
//   flex-direction: row;
//   align-items: center;
// }

// li {
//   flex: 1;
//   max-width: 250px;
//   text-align: center;
//   padding: 5px 10px;
//   cursor: pointer;
//   border-radius: 10rem;
//   background-color: grey;

//   color: white;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }

// li.active {
//   background-color: var(--clr-red-dark);
//   font-weight: bold; /* You can also make the text bold for the active tab */
// }
// li.active:hover {
//   background-color: var(--clr-red-dark);
// }

// li:hover {
//   background-color: #999;
// }
// `;

const Wrapper = styled.div`
  margin: 1.5rem 0;

  .grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    padding: 0;
  }

  li {
    list-style: none;
    padding: 10px 20px;
    border-radius: 20px;
    background-color: #dee2e6;
    color: #333;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.95rem;
  }

  li:hover {
    background-color: #ced4da;
  }

  li.active {
    background-color: var(--clr-red-dark);
    color: white;
    font-weight: 600;
    box-shadow: 0 0 6px rgba(0,0,0,0.15);
  }
`;

export default TabsNavbar;
