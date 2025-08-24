import React, { useState, useEffect } from 'react';
// import { SubContext } from '../context/subscribecontext';
import styled from 'styled-components';
import { GoRepo, GoArrowDown, GoArrowBoth } from 'react-icons/go';
import { FiUsers, FiUserPlus, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useDashboardContext } from '../context/dashboard_context';
const DashboardMasterInfo = () => {

  const { dashboardDetails } = useDashboardContext();
  // Destructure nested data from dashboardDetails object
  const {
    userMembershipTotalDue,
    userMembershipTotalGroups,
    userMembershipGroupsByStatus,
    userMembershipNoofSubscribers,
  } = dashboardDetails.results || {};

  // Extract specific properties from nested objects
  const total = userMembershipTotalDue?.[0]?.total;
  const paid = userMembershipTotalDue?.[0]?.paid;
  const due = userMembershipTotalDue?.[0]?.due;
  const totalGroups = userMembershipTotalGroups?.[0]?.no_of_groups;
  const totalNoOfSubscribers = userMembershipNoofSubscribers?.[0]?.no_of_subscribers

  console.log(dashboardDetails);

  const items = [
    {
      id: 1, icon: <GoRepo className='icon' />, label: 'Total Groups', value: totalGroups, color: 'pink',
    },
    {
      id: 2, icon: <FiUserPlus className='icon' />, label: 'Total Subscribers', value: totalNoOfSubscribers, color: 'purple',
    },
    {
      id: 3, icon: <GoArrowBoth className='icon' />, label: 'Total Outstanding', value: total, color: 'pink',
    },

    {
      id: 4, icon: <FiArrowUp className='icon' />, label: 'Paid', value: paid, color: 'green',
    },
    //value: data.type
    {
      id: 5, icon: <FiArrowDown className='icon' />, label: 'Due', value: due, color: 'purple',
    },


  ]


  return <section className='section'>
    <Wrapper className='section-center'>
      {items.map((item) => {
        return <Item key={item.id} {...item}></Item>
      })}
    </Wrapper>
  </section>;
};

const Item = ({ icon, label, value, color }) => {
  return <article className="item">
    <span className={color}>{icon}</span>
    <div>
      <h3>{value}</h3>
      <p>{label}</p>
    </div>

  </article>
}

const Wrapper = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem 2rem;
  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  .item {
    border-radius: var(--radius);
    padding: .5rem 1rem;
    background: var(--clr-white);   

    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 3rem;
    align-items: center;
    span {
      width: 3rem;
      height: 3rem;
      display: grid;
      place-items: center;
      border-radius: 50%;
    }
    .icon {
      font-size: 1.5rem;
    }
    h3 {
      margin-bottom: 0;
      letter-spacing: 0;
    }
    p {
      margin-bottom: 0;
      text-transform: capitalize;
    }
    .pink {
      background: #ffe0f0;
      color: #da4a91;
    }
    .green {
      background: var(--clr-primary-10);
      color: var(--clr-primary-5);
    }
    .purple {
      background: #e6e6ff;
      color: #5d55fa;
    }
    .yellow {
      background: #fffbea;
      color: #f0b429;
    }
  }
`;

export default DashboardMasterInfo;
