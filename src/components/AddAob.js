import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useUserContext } from "../context/user_context";
import { useAobContext } from "../context/aob_context";
import loadingImage from '../images/preloader.gif';

import Alert from '../components/Alert';
import { FaTrash } from 'react-icons/fa';

function AddAob() {

  const { user } = useUserContext();
  const { aobs, isLoading, addAob, deleteAob, fetchAobs } = useAobContext();


  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });
  const [isEditing, setIsEditing] = useState(false);

  const [list, setList] = useState([]);
  const [formData, setFormData] = useState({
    area: '',
    membershipId: user.results.userAccounts[0].membershipId,
    sourceSystem: 'WEB',
  });





  const removeItem = async (id) => {
    const result = await deleteAob(id);

    // `result.success` determines if the deletion was successful
    showAlert(true, result.success ? 'success' : 'danger', result.message);
  };




  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.area) {
      showAlert(true, 'danger', 'Please enter a value');
      return;
    }



    const result = await addAob(formData);

    if (result.success) {
      showAlert(true, 'success', result.message || 'AOB added successfully');
      fetchAobs();

      setFormData({
        area: '',
        membershipId: user.results.userAccounts[0].membershipId,
        sourceSystem: 'WEB',
      });
    } else {
      showAlert(true, 'danger', result.message || 'An error occurred');
    }
  };


  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  //const isButtonDisabled = !formData.firstName;
  return (
    <Wrapper >
      {isLoading ? (
        <div className="loading-container">
          <img src={loadingImage} alt="Loading..." className="loading-img" />
        </div>
      ) : (
        <>
          <form className='aob-form' onSubmit={handleSubmit} >
            {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
            <h3>Add Area of Business ({aobs.length}): </h3>

            <div className='form-control' >

              <input
                type='text'
                className='aob'
                placeholder='e.g. Coimbatore'
                name="area"
                value={formData.area} onChange={handleChange}

              />
              <button type='submit' className='submit-btn'>
                {isEditing ? 'edit' : 'add'}
              </button>
            </div>
          </form>
          {aobs.length > 0 && (
            <div className='aob-container'>
              <div className='aob-list'>
                {aobs.map((item) => {
                  // Add null check before attempting to destructure item
                  if (!item) return null;
                  const { id, aob } = item;
                  return (
                    <article className='aob-item' key={id}>
                      <p className='title'>{aob}</p>
                      <div className='btn-container'>

                        <button
                          type='button'
                          className='delete-btn'
                          onClick={() => removeItem(id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

            </div>
          )}
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;

  .aob-form {
    width: 100%;
    max-width: 600px;
    background-color: #f9f9ff;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .aob-form h3 {
    text-align: center;
    color: #333;
    margin-bottom: 1rem;
  }

  .form-control {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 0.5rem;
  }

  .aob {
    flex: 1;
    padding: 0.6rem 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    outline: none;
    transition: border 0.3s;
  }

  .aob:focus {
    border-color: #4f46e5; /* Indigo focus */
  }

  .aob::placeholder {
    color: #999;
    font-style: italic;
  }

  .submit-btn {
    background-color: #10b981; /* Green */
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.3s;
  }

  .submit-btn:hover {
    background-color: #059669;
  }

  .alert {
    margin-bottom: 1rem;
    text-align: center;
    font-size: 0.9rem;
    border-radius: 6px;
    padding: 0.75rem;
  }

  .alert-success {
    background-color: #d1fae5;
    color: #065f46;
  }

  .alert-danger {
    background-color: #fee2e2;
    color: #991b1b;
  }

  .aob-container {
    width: 100%;
    max-width: 600px;
    margin-top: 2rem;
  }

  .aob-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f1f5f9;
    padding: 0.6rem 1rem;
    border-radius: 6px;
    margin-bottom: 0.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .title {
    font-weight: 500;
    color: #1f2937;
  }

  .edit-btn, .delete-btn {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 0.85rem;
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
    transition: background 0.3s;
  }

  .edit-btn {
    color: #0ea5e9;
  }

  .edit-btn:hover {
    background-color: #e0f2fe;
  }

  .delete-btn {
    color: white;
    background-color: #ef4444;
  }

  .delete-btn:hover {
    background-color: #dc2626;
  }

  .clear-btn {
    margin-top: 1rem;
    display: block;
    background: transparent;
    color: #dc2626;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
    text-align: center;
    transition: color 0.3s;
  }

  .clear-btn:hover {
    color: #b91c1c;
  }
    .loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
}

.loading-img {
  width: 80px;
  height: 80px;
}


  @media (max-width: 768px) {
    .form-control {
      flex-direction: column;
      gap: 0.75rem;
    }

    .aob, .submit-btn {
      width: 100%;
    }

    .aob-form, .aob-container {
      padding: 1rem;
    }
  }
`;

export default AddAob;
