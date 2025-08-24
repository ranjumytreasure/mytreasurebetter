import React from "react";
import { useProductsContext } from "../context/products_context";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Error from "./Error";
import Loading from "./Loading";
import Product from "./Product";

const FeaturedProducts = () => {
    return (
        <Wrapper className="section">
            <div className="title" style={{ marginTop: "32px" }}>
                <h2 style={{ padding: "0 20px" }}>How it works-just 3 steps away</h2>
                <div className="underline"></div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>

                <div className="section-center featured" style={{ maxWidth: "350px", margin: "40px 20px 0" }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ height: "140px", position: "relative" }}>
                            <svg style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, margin: "auto" }} xmlns="http://www.w3.org/2000/svg" width="134" height="132" viewBox="0 0 134 132" fill="none">
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M46.4031 20.8161C43.1421 23.9695 35.9745 21.9429 31.3061 21.9429C21.8075 21.9429 11.983 22.5677 4.79791 29.7536C2.99605 31.5555 1.78632 34.6683 1.24759 37.0909C0.53514 40.2954 -0.524764 43.7293 0.300853 47.031C3.06141 58.074 18.0197 61.4036 22.7854 70.9356C24.7338 74.8318 15.4393 77.9661 13.5553 79.2197C1.83255 87.016 0.621218 97.082 1.48429 103.124C3.00244 113.75 11.1502 122.662 21.8386 124.189C28.5838 125.152 35.5195 121.996 41.7196 119.928C46.9012 118.201 54.5437 112.021 60.4178 114.958C65.6911 117.595 70.958 124.079 75.0917 128.212C78.8516 131.972 87.7038 131.334 92.3691 130.816C94.7495 130.551 97.8687 129.601 99.9431 128.212C117.864 116.217 99.9279 101.346 100.18 98.8639C100.593 94.7924 109.204 96.6445 115.327 94.6036C127.07 90.6891 135.853 77.4537 132.368 65.2551C130.045 57.1257 121.611 52.9912 114.38 50.5813C111.411 49.5915 102.22 50.7853 100.89 46.7943C100.114 44.4657 101.985 28.0123 101.471 22.7638C99.5286 2.94021 78.8165 -2.6893 65.6298 1.11364C55.5247 4.0272 50.7232 16.6378 46.4031 20.8161Z"
                                    fill="#DE1738"
                                />
                            </svg>
                            <svg style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, margin: "auto" }} xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
                                <path
                                    d="M3.66797 40.333C3.66797 32.2328 10.2345 25.6663 18.3346 25.6663C26.4349 25.6663 33.0013 32.2328 33.0013 40.333H29.3346C29.3346 34.2579 24.4098 29.333 18.3346 29.333C12.2595 29.333 7.33464 34.2579 7.33464 40.333H3.66797ZM18.3346 23.833C12.2571 23.833 7.33464 18.9105 7.33464 12.833C7.33464 6.75551 12.2571 1.83301 18.3346 1.83301C24.4121 1.83301 29.3346 6.75551 29.3346 12.833C29.3346 18.9105 24.4121 23.833 18.3346 23.833ZM18.3346 20.1663C22.3863 20.1663 25.668 16.8847 25.668 12.833C25.668 8.78134 22.3863 5.49967 18.3346 5.49967C14.283 5.49967 11.0013 8.78134 11.0013 12.833C11.0013 16.8847 14.283 20.1663 18.3346 20.1663ZM33.5214 26.9548C38.6194 29.2525 42.168 34.3783 42.168 40.333H38.5013C38.5013 35.867 35.8399 32.0227 32.0164 30.2994L33.5214 26.9548ZM32.261 6.25723C35.9244 7.76756 38.5013 11.373 38.5013 15.583C38.5013 20.845 34.4757 25.1625 29.3346 25.6253V21.9348C32.4453 21.4904 34.8346 18.817 34.8346 15.583C34.8346 13.0518 33.3709 10.8641 31.2431 9.81965L32.261 6.25723Z"
                                    fill="white"
                                />
                            </svg>
                        </div>
                        <h4 style={{ marginTop: "16px" }}>Start a Group</h4>
                        <p style={{ maxWidth: "350px", margin: "10px auto 0" }}>Transform Your Financial Landscape: Launch Your Group Now!</p>
                    </div>
                </div>
                <div className="section-center featured" style={{ maxWidth: "350px", margin: "40px 20px 0" }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ height: "140px", position: "relative" }}>
                            <svg style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, margin: "auto" }} xmlns="http://www.w3.org/2000/svg" width="134" height="119" viewBox="0 0 134 119" fill="none">
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M29.0752 14.4541C34.1047 9.42459 45.4206 4.2086 47.8569 3.72102C48.9163 3.50922 51.159 3.05092 53.4319 2.58646C55.73 2.11683 58.059 1.6409 59.2266 1.40714C66.3696 -0.0212925 74.9534 -0.607963 82.1306 0.827486C84.0076 1.20295 85.8636 1.50794 87.6972 1.80925C94.1614 2.87151 100.347 3.88804 106.194 7.78552C113.566 12.7007 116.47 18.9336 119.788 26.0558C120.533 27.6537 121.298 29.2964 122.139 30.979C133.554 53.8081 141.529 92.1065 117.5 110.128C110.668 115.251 103.064 115.373 95.3929 115.496C91.7346 115.555 88.0614 115.614 84.45 116.216C71.882 118.31 55.5826 119.13 42.701 117.376C32.2854 115.957 18.1931 105.685 7.91088 93.8922C4.33969 89.7959 2.37758 81.9228 1.09271 76.7672C1.04518 76.5765 0.998573 76.3895 0.952846 76.2065C-4.4691 54.5195 14.3712 29.1573 29.0752 14.4541Z"
                                    fill="#DE1738"
                                />
                            </svg>
                            <svg style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, margin: "auto" }} xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
                                <path
                                    d="M25.6654 26.1283V29.9589C24.5184 29.5536 23.2844 29.333 21.9987 29.333C15.9236 29.333 10.9987 34.2579 10.9987 40.333H7.33203C7.33203 32.2328 13.8985 25.6663 21.9987 25.6663C23.2648 25.6663 24.4935 25.8268 25.6654 26.1283ZM21.9987 23.833C15.9212 23.833 10.9987 18.9105 10.9987 12.833C10.9987 6.75551 15.9212 1.83301 21.9987 1.83301C28.0762 1.83301 32.9987 6.75551 32.9987 12.833C32.9987 18.9105 28.0762 23.833 21.9987 23.833ZM21.9987 20.1663C26.0504 20.1663 29.332 16.8847 29.332 12.833C29.332 8.78134 26.0504 5.49967 21.9987 5.49967C17.947 5.49967 14.6654 8.78134 14.6654 12.833C14.6654 16.8847 17.947 20.1663 21.9987 20.1663ZM32.9987 31.1663V25.6663H36.6654V31.1663H42.1654V34.833H36.6654V40.333H32.9987V34.833H27.4987V31.1663H32.9987Z"
                                    fill="white"
                                />
                            </svg>
                        </div>
                        <h4 style={{ marginTop: "16px" }}>Add Subscribers</h4>
                        <p style={{ maxWidth: "350px", margin: "10px auto 0" }}>Time to welcome subscribers! Invite friends, family, and peers to join your financial circle. The more subscribers, the greater the potential rewards.</p>
                    </div>
                </div>
                <div className="section-center featured" style={{ maxWidth: "350px", margin: "40px 20px 0" }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ height: "140px", position: "relative" }}>
                            <svg style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, margin: "auto" }} xmlns="http://www.w3.org/2000/svg" width="133" height="116" viewBox="0 0 133 116" fill="none">
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M7.50597 1.58869C5.90452 2.17401 3.03696 13.8994 2.48267 19.1791C1.50429 28.51 1.66798 33.8043 1.14392 41.1444C-0.0642702 58.0695 1.39497 75.4446 1.87831 92.469C1.95912 95.3154 1.32721 107.186 3.31309 109.062C7.3712 112.896 31.9019 100.38 37.5 101.018C55.5476 103.075 59.7315 116.138 77.9871 115.62C89.0199 115.306 100.321 116.464 111.24 115.158C115.57 114.64 120.825 113.945 123.89 110.701C125.388 109.115 125.159 103.017 125.302 101.018C126.049 90.5521 126.916 80.019 128.508 69.5894C130.539 56.2808 130.599 42.611 131.702 29.2418C132.172 23.5302 133.651 13.9471 130.88 8.77523C129.881 6.91187 126.505 7.01367 124.796 6.77813C116.52 5.63894 72.9055 19.5406 64.5 19.1791C39.5635 18.1084 49.5749 2.49796 24.8183 0.456199C20.18 0.074057 11.7503 0.0389955 7.50597 1.58869Z"
                                    fill="#DE1738"
                                />
                            </svg>
                            <svg style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, margin: "auto" }} xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
                                <path
                                    d="M36.6719 12.8333V9.16667H7.33854V34.8333H36.6719V31.1667H22.0052C20.9927 31.1667 20.1719 30.3459 20.1719 29.3333V14.6667C20.1719 13.6542 20.9927 12.8333 22.0052 12.8333H36.6719ZM5.50521 5.5H38.5052C39.5178 5.5 40.3386 6.32082 40.3386 7.33333V36.6667C40.3386 37.6792 39.5178 38.5 38.5052 38.5H5.50521C4.49269 38.5 3.67188 37.6792 3.67188 36.6667V7.33333C3.67188 6.32082 4.49269 5.5 5.50521 5.5ZM23.8386 16.5V27.5H36.6719V16.5H23.8386ZM27.5052 20.1667H33.0052V23.8333H27.5052V20.1667Z"
                                    fill="white"
                                />
                            </svg>
                        </div>
                        <h4 style={{ marginTop: "16px" }}>Earn Money</h4>
                        <p style={{ maxWidth: "350px", margin: "10px auto 0" }}>Monetize Your Chit Group turn Collaboration into Earnings</p>
                    </div>
                </div>
            </div>

            <Link to="/signup" className="btn" style={{ maxWidth: "200px", width: "100%", marginBottom: "40px", marginTop: "50px" }}>
                Join Treasure
            </Link>
        </Wrapper>
    );
};

const Wrapper = styled.section`
    background: var(--clr-grey-10);
    .title {
        text-align: center;
    }
    .featured {
        margin: 4rem auto;
        display: grid;
        gap: 2.5rem;
        img {
            height: 225px;
        }
    }
    .btn {
        display: block;
        width: 148px;
        margin: 0 auto;
        text-align: center;
    }

    @media (min-width: 576px) {
        .featured {
            grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
        }
    }
`;

export default FeaturedProducts;
