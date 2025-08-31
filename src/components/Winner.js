import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Confetti from "react-confetti";
import { useHistory } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';

const Winner = ({ location }) => {
    const history = useHistory();
    const [previewImage, setPreviewImage] = useState('https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true');
    const [error, setError] = useState(null);
    const [altText, setAltText] = useState('');

    const winningSub = location.state.winningSub;
    // Extract image URL and amount from winningSub
    const imageUrl = winningSub.winnerObject.userImage;
    useEffect(() => {
        fetchCompanyLogoUrl(imageUrl);
    }, [imageUrl]);

    const amount = winningSub.winnerObject.winnerAmount;
    console.log(imageUrl);
    console.log(amount);
    const [height, setHeight] = useState(null);
    const [width, setWidth] = useState(null);
    const confetiRef = useRef(null);
    useEffect(() => {
        setHeight(confetiRef.current.clientHeight);
        setWidth(confetiRef.current.clientWidth);
    }, []);
    const handleContinueClick = () => {
        // Redirect to the home page
        history.push('/home');
    };

    const fetchCompanyLogoUrl = async (logoKey) => {
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/get-signed-url?key=${encodeURIComponent(logoKey)}`, {
                method: 'GET',
                headers: {
                    // Include any headers if needed
                    // 'Authorization': 'Bearer YourAccessToken',
                },
            });

            if (response.ok) {
                const responseBody = await response.json();
                const signedUrl = responseBody.results;

                setPreviewImage(signedUrl);
            } else {
                console.error(`Failed to fetch signed URL for company logo: ${logoKey}`);
            }
        } catch (error) {
            console.error('Error fetching signed URL for company logo:', error);
            setError('Error fetching signed URL for company logo');
        }
    };

    return (
        <Wrapper className='section-center' >
            <div className='contain'>
                <div className="confettie-wrap" ref={confetiRef}>
                    <Confetti numberOfPieces={100} width={600} height={200} />

                    <img src={previewImage} alt={altText} style={{ height: '100px', width: '100px' }} />

                    <p>Amount: {amount}</p>
                    <h2>Congratulations!</h2>
                    <p>You are all set. Well done!</p>

                    {/* <div className="checkmark-circle">
                        <div className="background"></div>
                        <div className="checkmark draw">
                        </div>
                    </div> */}

                    <button className="submit-btn" type="submit" onClick={handleContinueClick}>Continue</button>
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
  max-width: 40rem;
    margin-top: 2rem;
    margin-bottom: 4rem;
padding: 35px;
display: flex;
flex-direction: column;
background: var(--clr-white);
border-radius: var(--radius);
box-shadow: var(--light-shadow);
transition: var(--transition);

width: 90vw;
height: 500px;
margin: 10 auto;
align-items: center;
position: relative;
}



.contain:hover {
    box-shadow: var(--dark-shadow);
  }
  .confettie-wrap {
    display:flex;
    flex-direction: column; /* Set flex-direction to column */
    align-items: center;
    justify-content: center;
    padding: 35px;
}


  @media (min-width: 992px) 
  {
    height: 100vh;
    
  }
 
  

  /* Checkmark */
.checkmark-circle {
    width: 150px;
    height: 150px;
    position: relative;
    display: inline-block;
    vertical-align: top;
    margin-left: auto;
    margin-right: auto;
    align-items: center;
    justify-content: center;
}

.checkmark-circle .background {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: #00C09D;
    position: absolute;
}

.checkmark-circle .checkmark {
    border-radius: 5px;
}

.checkmark-circle .checkmark.draw:after {
    -webkit-animation-delay: 100ms;
    -moz-animation-delay: 100ms;
    animation-delay: 100ms;
    -webkit-animation-duration: 3s;
    -moz-animation-duration: 3s;
    animation-duration: 3s;
    -webkit-animation-timing-function: ease;
    -moz-animation-timing-function: ease;
    animation-timing-function: ease;
    -webkit-animation-name: checkmark;
    -moz-animation-name: checkmark;
    animation-name: checkmark;
    -webkit-transform: scaleX(-1) rotate(135deg);
    -moz-transform: scaleX(-1) rotate(135deg);
    -ms-transform: scaleX(-1) rotate(135deg);
    -o-transform: scaleX(-1) rotate(135deg);
    transform: scaleX(-1) rotate(135deg);
    -webkit-animation-fill-mode: forwards;
    -moz-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
}

.checkmark-circle .checkmark:after {
    opacity: 1;
    height: 75px;
    width: 37.5px;
    -webkit-transform-origin: left top;
    -moz-transform-origin: left top;
    -ms-transform-origin: left top;
    -o-transform-origin: left top;
    transform-origin: left top;
    border-right: 15px solid white;
    border-top: 15px solid white;
    border-radius: 2.5px !important;
    content: '';
    left: 25px;
    top: 75px;
    position: absolute;
}

@-webkit-keyframes checkmark {
    0% {
        height: 0;
        width: 0;
        opacity: 1;
    }

    20% {
        height: 0;
        width: 37.5px;
        opacity: 1;
    }

    40% {
        height: 75px;
        width: 37.5px;
        opacity: 1;
    }

    100% {
        height: 75px;
        width: 37.5px;
        opacity: 1;
    }
}

@-moz-keyframes checkmark {
    0% {
        height: 0;
        width: 0;
        opacity: 1;
    }

    20% {
        height: 0;
        width: 37.5px;
        opacity: 1;
    }

    40% {
        height: 75px;
        width: 37.5px;
        opacity: 1;
    }

    100% {
        height: 75px;
        width: 37.5px;
        opacity: 1;
    }
}

@keyframes checkmark {
    0% {
        height: 0;
        width: 0;
        opacity: 1;
    }

    20% {
        height: 0;
        width: 37.5px;
        opacity: 1;
    }

    40% {
        height: 75px;
        width: 37.5px;
        opacity: 1;
    }

    100% {
        height: 75px;
        width: 37.5px;
        opacity: 1;
    }
}



.submit-btn {
    height: 45px;
    width: 200px;
    font-size: 15px;
    background-color: #00c09d;
    border: 1px solid #00ab8c;
    color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(87, 71, 81, .2);
    cursor: pointer;
    transition: all 2s ease-out;
    transition: all .2s ease-out;
}

.submit-btn:hover {
    background-color: #2ca893;
    transition: all .2s ease-out;
}

  
`
export default Winner
