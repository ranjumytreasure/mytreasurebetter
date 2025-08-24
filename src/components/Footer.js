import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FontAwesomeIcon } from "react-icons/fa";
const Footer = () => {
  return (
    <Wrapper>
      <div className='aboutus'>
        <Link to='/'>
          <img src={logo} alt="treasure" />
        </Link>

        <div className='socialicons'>

        </div>
      </div>
      <div className='quicklinks'>
        <h3>Mytreasure</h3>
        <ul>
          <li><a href="/" >Home</a></li>
          <li><a href="/login" >Login</a></li>
          <li><a href="/signup" >Signup</a></li>
          <li><a href="/startagroup" >Start a group</a></li>
          <li><a href="/help" >Help</a></li>
          <li><a href="/faq" >Faq</a></li>

        </ul>
      </div>
      <div className='legal'>
        <h3>Legal</h3>
        <ul>
          <li><a href="/Terms&Conditions" >Terms & Conditions</a></li>
          <li><a href="/Privacy&Policy" >Privacy Policy</a></li>
        </ul>
      </div>
      <div className='contactus'>

      </div>

    </Wrapper>
  )
}
const Wrapper = styled.footer`
  
  display: grid;
  grid-template-columns:1fr;
  height:auto;
  background-color:var(--clr-black);
  padding: 4em;

  .aboutus{
    padding:50px ;
    color:var(--clr-white);
  

  }
  .aboutus p{
    color:var(--clr-white);
  }
  .aboutus img{
    width: 175px;
  }

  .quicklinks{
      display:flex;
      flex-direction: column;
      justify-content: center;  
      align-items: left;   
      padding:20px;        
               
  }
  .quicklinks ul {     
    padding: 0;
    margin: 0;    
  }

  .quicklinks li {
   
    margin: 10px;
    transition: color 0.3s;  // Transition for smooth color change
  }

  .quicklinks li a {
    color:var(--clr-grey-9);
    text-decoration: none;  /* Optional: Remove underline */
  }
  
  .quicklinks li:hover a {
    color: var(--clr-red-dark);
  }
  .quicklinks h3{
    border-bottom:3px solid var(--clr-red-dark);
    width:140px;
    align-items:center;
    color: var(--clr-white);
  }
  .legal{
    display:flex;
    flex-direction: column;    
    align-items: left;   
    padding:20px;   
               
    }
.legal ul {     
  padding: 0;
  margin: 0;    
}
.legal li { 
  margin: 10px;
  transition: color 0.3s;  
}
.legal li a {
  color:var(--clr-grey-9);
  text-decoration: none;  /* Optional: Remove underline */
}

.legal li:hover a {
  color: var(--clr-red-dark);
}
.legal h3{
  border-bottom:3px solid var(--clr-red-dark);
  width:70px;
  align-items:center;
  color: var(--clr-white);
}

 
  .contactus{
    padding:20px;
    color:var(--clr-white);
  }
  
  @media (min-width: 776px) {
    grid-template-columns:1fr 1fr 1fr 1fr;
    
  }
`

export default Footer
