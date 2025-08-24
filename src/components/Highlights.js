import { useState, useEffect } from 'react';
import { useUserContext } from '../context/user_context';
import { useLedgerAccountContext } from "../context/ledgerAccount_context";
import { useCompanySubscriberContext } from '../context/companysubscriber_context';
import { usePayablesContext } from '../context/payables_context';
import styled from 'styled-components';
import { useHistory, Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { useReceivablesContext } from '../context/receivables_context';

const Highlights = ({ groups, premium }) => {
  const history = useHistory();
  const { user } = useUserContext();
  const { ledgerAccounts } = useLedgerAccountContext();
  const { companySubscribers } = useCompanySubscriberContext();

  const [membershipId, setMembershipId] = useState('');
  const { receivables } = useReceivablesContext();
  const { payables } = usePayablesContext();

  useEffect(() => {
    if (user.results.userAccounts && user.results.userAccounts.length > 0) {
      const membership = user.results.userAccounts[0];
      setMembershipId(membership.parent_membership_id);
    }
  }, [user]);

  const handleMultiStepSubscriber = (membershipId) => {
    history.push(`/addcompanymultisubscriber/${membershipId}`);
  };

  const handleStartGroup = () => {
    history.push('/startagroup');
  };

  const goToLedger = () => history.push('/ledger');
  const goToReceivables = () => history.push('/receivables');
  const goToPayables = () => history.push('/payables');

  const totalCurrentBalance = Array.isArray(ledgerAccounts)
    ? ledgerAccounts.reduce((sum, acc) => sum + (parseFloat(acc.current_balance) || 0), 0)
    : 0;

  // ✅ Sum of rbdue values from receivables
  const totalRbDue = Array.isArray(receivables)
    ? receivables.reduce((sum, item) => sum + (parseFloat(item.rbdue) || 0), 0)
    : 0;

  // ✅ Sum of rbdue values from payables
  const totalPyDue = Array.isArray(payables)
    ? payables.reduce((sum, item) => sum + (parseFloat(item.pbdue) || 0), 0)
    : 0;

  const formatCurrency = (value) => {
    return value.toLocaleString('en-IN');
  };

  return (
    <Wrapper>
      <header>
        {/* Groups */}
        <div className='count-box'>
          <div className="circle">
            <p className="big-number">{groups.length}</p>
            <button className='add-circle-button' onClick={handleStartGroup}>+</button>
          </div>
          <p>Groups</p>
        </div>

        {/* Subscribers */}
        <div className='count-box'>
          <div className="circle">
            <p className="big-number">
              <Link to={{ pathname: '/subscribers', state: { companySubscribers } }}>
                {companySubscribers.length}
              </Link>
            </p>
            <button className='add-circle-button' onClick={() => handleMultiStepSubscriber(membershipId)}>+</button>
          </div>
          <p>Subscribers</p>
        </div>

        {/* Ledger */}
        <div className='count-box' onClick={goToLedger} style={{ cursor: 'pointer' }}>
          <div className="circle">
            <p className="big-number">₹{formatCurrency(totalCurrentBalance)}</p>
            <button className='goto-circle-button'><FaArrowRight /></button>
          </div>
          <p>Ledger</p>
        </div>

        {/* Receivable */}
        <div className='count-box' onClick={goToReceivables} style={{ cursor: 'pointer' }}>
          <div className="circle">
            <p className="big-number">₹{formatCurrency(totalRbDue)}</p>
            <button className='goto-circle-button'><FaArrowRight /></button>
          </div>
          <p>Receivable</p>
        </div>

        {/* Payable */}
        <div className='count-box' onClick={goToPayables} style={{ cursor: 'pointer' }}>
          <div className="circle">
            <p className="big-number">₹{formatCurrency(totalPyDue)}</p>
            <button className='goto-circle-button'><FaArrowRight /></button>
          </div>
          <p>Payable</p>
        </div>
      </header>

      <button className="start-group-button" onClick={handleStartGroup}>
        Start a group
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--clr-white);
  padding: 2rem;
  border-radius: var(--radius);
  position: relative;
  margin: 1rem;

  &::before {
    content: 'Highlights';
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, var(--clr-red-dark), var(--clr-red-light));
    color: white;
    font-weight: bold;
    border-radius: 20px;
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }

  header {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1.5rem;
    width: 100%;
    justify-items: center;
    margin-bottom: 2rem;
  }

  .circle {
    width: 7rem;
    height: 7rem;
    border-radius: 20px;
    background: #e0e0e0; /* grey background */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    // box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .big-number {
    font-size: 2.4rem; /* bigger */
    font-weight: 800;
    color: black; /* black for high visibility */
    margin: 0;
  }

  .add-circle-button,
  .goto-circle-button {
    position: absolute;
    bottom: -10px;
    right: -10px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--clr-red-dark);
    color: white;
    font-size: 1rem;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 6px rgba(0,0,0,0.2);
    cursor: pointer;
  }

  .goto-circle-button {
    background: var(--clr-red-dark); /* can be a blue shade */
  }

  .count-box {
    text-align: center;
  }

  .count-box p {
    margin-top: 0.5rem;
    font-size: 0.95rem;
    font-weight: 500;
    
  }

  .start-group-button {
    background: linear-gradient(135deg, var(--clr-red-dark), var(--clr-red-light));
    color: white;
    font-weight: bold;
    padding: 0.8rem 2rem;
    border-radius: 30px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  }

  @media (max-width: 768px) {
    header {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
`;

export default Highlights;
