import React, { useState, useEffect } from 'react';
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


  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {items.map((item) => {
            return <Item key={item.id} {...item}></Item>
          })}
        </div>
      </div>
    </section>
  );
};

const Item = ({ icon, label, value, color }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'pink':
        return 'bg-pink-100 text-pink-600';
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <article className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-4">
        <span className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClasses(color)}`}>
          <span className="text-xl">{icon}</span>
        </span>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{value}</h3>
          <p className="text-sm text-gray-600 capitalize">{label}</p>
        </div>
      </div>
    </article>
  );
}

export default UserInfo;
