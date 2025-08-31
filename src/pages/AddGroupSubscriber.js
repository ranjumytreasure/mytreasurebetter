import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { Section, SubscriberList } from '../components'
import styled from 'styled-components'

const AddGroupSubscriber = () => {
  const { groupId } = useParams();
  // Define a state variable to trigger a refresh of SubscriberList
  const [refreshSubscriberList, setRefreshSubscriberList] = useState(false);

  // Callback function to trigger a refresh of SubscriberList
  const handleRefreshSubscriberList = () => {
    setRefreshSubscriberList(!refreshSubscriberList);
  };
  return (<Wrapper className='section-center'>
    <div className="contain">
      <div>
        <h3>Add Subscribers</h3>
        <Section groupId={groupId} onRefresh={handleRefreshSubscriberList} />
        <SubscriberList groupId={groupId} refresh={refreshSubscriberList} />
      </div>
    </div>
  </Wrapper>
  );
}
const Wrapper = styled.section`
display: flex;
flex-direction: column;
justify-content: space-between;
align-items: center;


.contain {
    
    text-align: center;
    border-radius: 15px;
margin-top:1rem;
padding-top: 25px;
display: flex;
flex-direction: column;
box-shadow: 0 10px 10px rgb(0 0 0 / 0.2);
height: 900px;
width: 500px;
align-items: center;
}


  
  @media (min-width: 992px) 
  {
    height: 100vh;
    
  }
  `

export default AddGroupSubscriber
