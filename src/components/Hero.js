import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import heroBcg from "../assets/hero-bcg.jpeg";
import heroBcg2 from "../assets/hero-bcg-2.jpeg";

const Hero = () => {
    return (
        <Wrapper className="section-center">
            <article className="content">
                <h2 style={{ marginBottom: "16px" }}> Chit Fund Software & Apps </h2>
                <h3 style={{ marginBottom: "16px" }}> (Call @ +91 9942393237)</h3>
                <h4 style={{ marginBottom: "12px", fontWeight: "500" }}>Experience the Power of Technology with MyTreasure.in!</h4>
                <p style={{ fontSize: "18px" }}>
                    At Mytreasure.in, we understand the unique challenges faced by chit fund companies, and we're here to simplify and empower your business journey. As your dedicated technology partner, we provide innovative solutions to enhance efficiency, transparency, and overall business performance
                </p>
                <Link to="/startagroup" className="hero-btn">
                    Start group
                </Link>
            </article>
            <article className="img-container">
                {/* <img src={heroBcg2} alt='person working' className='accent-img' /> */}
                <svg width="449" height="449" viewBox="0 0 449 449" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M56.125 149.662C56.125 108.333 89.629 74.8291 130.958 74.8291H318.042C359.37 74.8291 392.875 108.333 392.875 149.662V374.162H56.125V149.662Z" fill="#DE1738" />
                    <mask id="mask0_2071_6239" maskUnits="userSpaceOnUse" x="168" y="196" width="112" height="112">
                        <path d="M279.222 196.438H168.375V307.284H279.222V196.438Z" fill="white" />
                    </mask>
                    <g mask="url(#mask0_2071_6239)">
                        <path d="M168.375 196.438H279.222V259.779L223.798 307.284L168.375 259.085V196.438Z" fill="white" />
                        <path d="M218.753 270.333V226.515H201.977V217.127H245.578V226.515H228.801V270.333H218.753Z" fill="#DE1738" />
                    </g>
                    <path d="M355.452 336.75H93.5352V374.167H355.452V336.75Z" fill="white" />
                    <path
                        d="M397.552 152.473H51.4477C45.2483 152.473 40.2227 157.498 40.2227 163.698C40.2227 169.897 45.2483 174.923 51.4477 174.923H397.552C403.751 174.923 408.777 169.897 408.777 163.698C408.777 157.498 403.751 152.473 397.552 152.473Z"
                        fill="white"
                        stroke="white"
                        stroke-width="0.3"
                    />
                    <path
                        d="M142.073 224.5H77.763C76.1486 224.5 74.8398 226.594 74.8398 229.177C74.8398 231.76 76.1486 233.854 77.763 233.854H142.073C143.687 233.854 144.996 231.76 144.996 229.177C144.996 226.594 143.687 224.5 142.073 224.5Z"
                        fill="white"
                    />
                    <path
                        d="M371.237 224.5H306.927C305.313 224.5 304.004 226.594 304.004 229.177C304.004 231.76 305.313 233.854 306.927 233.854H371.237C372.851 233.854 374.16 231.76 374.16 229.177C374.16 226.594 372.851 224.5 371.237 224.5Z"
                        fill="white"
                    />
                </svg>
            </article>
        </Wrapper>
    );
};

const Wrapper = styled.section`
    min-height: 60vh;
    display: grid;
    place-items: center;
    .img-container {
        display: none;
        object-fit: cover;
    }

    p {
        line-height: 2;
        max-width: 45em;
        margin-bottom: 2rem;
        color: var(--clr-grey-5);
        font-size: 1rem;
    }
    .hero-btn {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        background: var(--clr-red-dark);
        color: var(--clr-white);
        border-radius: var(--radius);

    }
    @media (min-width: 992px) {
        height: 100vh;
        grid-template-columns: 1fr 1fr;
        gap: 8rem;
        h1 {
            margin-bottom: 2rem;
        }
        p {
            font-size: 1.25rem;
        }
        .hero-btn {
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            background: var(--clr-red-dark);
        }
        .img-container {
            display: block;
            position: relative;
        }
        .main-img {
            width: 100%;
            height: 550px;
            position: relative;
            border-radius: var(--radius);
            display: block;
            object-fit: cover;
        }
        .accent-img {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 350px;
            padding-top: 10px;
            transform: translateX(-50%);
            border-radius: var(--radius);
        }
    }
`;

export default Hero;
