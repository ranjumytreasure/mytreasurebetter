import React, { useState, useEffect } from 'react';
// import { SubContext } from '../context/subscribecontext';
import styled from 'styled-components';
import { GoRepo, GoGist, GoArrowBoth } from 'react-icons/go';
import { FiUsers, FiUserPlus } from 'react-icons/fi';

const UserInfo = ({ data }) => {
  const [groupName, setGroupName] = useState([]);
  const [amount, setAmount] = useState([]);
  const [type, setType] = useState([]);
  //  const [type, setType] = useState([]);
  const [commisionType, setCommisionType] = useState([]);
  const [commissionAmount, setCommisionAmt] = useState([]);


  useEffect(() => {
    if (data && data.results) {
      // Set groupTransactionInfo when data is available
      const { amount, type, commisionType, commissionAmount, groupName } = data.results;
      setAmount(amount);
      setType(type);
      setCommisionType(commisionType);
      setCommisionAmt(commissionAmount);
      setGroupName(groupName);

    }
  }, [data]);


  const items = [
    {
      id: 1, icon: <GoRepo className='icon' />, label: 'Group Amount', value: `${groupName}:${amount}`, color: 'pink',
    },

    {
      id: 2, icon: <FiUsers className='icon' />, label: 'Group Type', value: type, color: 'green',
    },
    //value: data.type
    {
      id: 3, icon: <FiUserPlus className='icon' />, label: 'Commision Type', value: commisionType, color: 'purple',
    },
    //value: data.commisionType
    {
      id: 4, icon: <GoArrowBoth className='icon' />, label: 'Comm Amount', value: commissionAmount, color: 'yellow',
    },
    //value: data.commissionAmount

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
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
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

export default UserInfo;
