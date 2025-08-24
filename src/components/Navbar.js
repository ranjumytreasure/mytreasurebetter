import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import logo from '../assets/logo.png'
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { links } from '../utils/constants';
import CartButtons from './CartButtons';
import { useUserContext } from '../context/user_context';
import { hasPermission } from '../rbacPermissionUtils';




const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, isSidebarOpen, openSidebar, closeSidebar, userRole } = useUserContext();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 80);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <NavContainer scrolled={scrolled}>

      <div className="nav-center">
        <div className="nav-header">
          <Link to='/'>
            <img src={logo} alt="treasure" />
          </Link>
          <button type='button' className='nav-toggle' onClick={openSidebar}>
            <FaBars />
          </button>

        </div>


        <ul className="nav-links">
          {isLoggedIn && hasPermission(userRole, 'viewHome') && (
            <li>
              <Link to="/home">Home</Link>
            </li>
          )}
          {links.map((link) => {
            const { id, text, url } = link;
            return <li key={id}>
              <Link to={url}>{text}</Link>
            </li>
          })}
        </ul>

        <CartButtons scrolled={scrolled} />
      </div>
    </NavContainer>
  );
};


const NavContainer = styled.nav`
  height: 5rem;
  background-color:var(--clr-white);
  //background-color:blue;
  display: flex;
  align-items: center;
  justify-content: center;

  .nav-center {
    //background-color:red;
    width: 90vw;
    margin: 10 auto;
    max-width: var(--max-width);
   
  }
  .nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 175px;
     // margin-left: -15px;//
    }
  }
  .nav-toggle {
    background: transparent;
    border: transparent;
    color: var(--clr-red-dark);
    cursor: pointer;
    svg {
      font-size: 2rem;
    }
  }
  .nav-links {
    display: none;
  }
  .cart-btn-wrapper {
    display: none;
  }
  @media (min-width: 992px) {
    .nav-toggle {
      display: none;
    }
    .nav-center {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
    }
   
    .nav-links {
      display: flex;
      justify-content: center;
      li {
        margin: 0 0.5rem;
      }
      a {
        color: var(--clr-grey-7);
        font-size: 1rem;
        text-transform: capitalize;
        letter-spacing: var(--spacing);
        padding: 0.5rem;
        &:hover {
          border-bottom: 2px solid var(--clr-primary-7);
        }
      }
    }
    .cart-btn-wrapper {
      display: grid;
    }
  }
  /* fixed navbar */

  /* fixed navbar styles based on scrolled state */
  ${({ scrolled }) =>
    scrolled &&
    `
    position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: var(--clr-red-dark);
  z-index: 2;
  box-shadow: var(--light-shadow);
  .nav-links {  
    a {
    color: var(--clr-white);
  }
  
}
    `
  }
  
`

export default Nav



