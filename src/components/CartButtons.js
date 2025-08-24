import React, { useState, useEffect } from 'react';
import { FaUserMinus, FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useUserContext } from "../context/user_context";
import { useHistory } from "react-router-dom";
import { API_BASE_URL } from '../utils/apiConfig';
import { hasPermission } from '../rbacPermissionUtils';
import { downloadImage } from "../utils/downloadImage";

const CartButtons = ({ scrolled }) => {
    const history = useHistory();
    const { user, logout, userRole } = useUserContext();
    const { closeSidebar } = useUserContext();
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [image, setImage] = useState('');
    const [previewUrl, setPreviewUrl] = useState('https://i.imgur.com/ndu6pfe.png'); // Default image

    const getImageSrc = (userImage) => {
        if (!userImage) return "default-avatar.png"; // Fallback image
        return userImage.startsWith("data:image/") || userImage.startsWith("http")
            ? userImage
            : `data:image/jpeg;base64,${userImage}`;
    };

    /** ✅ Load User Data */
    useEffect(() => {
        console.log("🔥 useEffect triggered! Checking user image...");

        if (user?.results?.user_image) {


            const userImage = user.results.user_image;
            console.log("✅ user_image from DB:", userImage);

            if (userImage.includes("s3.ap-south-1.amazonaws.com")) {
                console.log("🔹 Fetching from AWS S3...");
                fetchImage(userImage);
            } else {
                console.log("✅ Using direct image URL:", userImage);
                setPreviewUrl(userImage); // Directly set image preview
            }
        } else {
            console.warn("⚠️ No user image found, using default.");
            setPreviewUrl('https://i.imgur.com/ndu6pfe.png');
        }
    }, [user?.results?.user_image]);

    /** ✅ Fetch Image from AWS */
    const fetchImage = async (user_image) => {
        if (!user_image) return;


        try {
            const imageKey = user_image.split('/').pop();
            console.log("🔹 Fetching image for key:", imageKey);
            const imageUrl = await downloadImage(imageKey, API_BASE_URL);

            console.log("✅ Downloaded Image URL:", imageUrl);

            if (imageUrl) {
                setPreviewUrl(imageUrl);
            } else {
                console.warn("⚠️ No valid image found, using default.");
                setPreviewUrl('https://i.imgur.com/ndu6pfe.png');
            }
        } catch (error) {
            console.error("❌ Error fetching image:", error);
            setPreviewUrl('https://i.imgur.com/ndu6pfe.png');
        }

    };

    const handleLogout = () => {
        logout();
        history.push("/");
    };

    const showTooltip = () => setIsTooltipVisible(true);
    const hideTooltip = () => setIsTooltipVisible(false);

    return (
        <Wrapper className="cart-btn-wrapper">
            {user ? (
                <>
                    <div className={`user-provider ${scrolled ? 'scrolled' : ''}`}>
                        <div className="user-info">
                            <p>Hi {user.results.firstname || user.results.name || "Guest"}</p>
                        </div>
                        <div className="avatar" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
                            <img src={image || previewUrl} alt={user.results.firstname || "User Avatar"} />
                            {isTooltipVisible && (
                                <Tooltip>
                                    <ul>
                                        {hasPermission(userRole, 'viewPersonalSettings') && (
                                            <li>
                                                <Link to="/personal-settings" onClick={closeSidebar}>
                                                    Personal Settings
                                                </Link>
                                            </li>
                                        )}
                                        {hasPermission(userRole, 'viewSubscribers') && (
                                            <li>
                                                <Link to="/subscribers" onClick={closeSidebar}>
                                                    Subscribers
                                                </Link>
                                            </li>
                                        )}
                                        {hasPermission(userRole, 'viewDashboard') && (
                                            <li>
                                                <Link to="/dashboard" onClick={closeSidebar}>
                                                    Dashboard
                                                </Link>
                                            </li>
                                        )}
                                        {hasPermission(userRole, 'viewReceivables') && (
                                            <li>
                                                <Link to="/receivables" onClick={closeSidebar}>
                                                    Receivables
                                                </Link>
                                            </li>
                                        )}
                                        {hasPermission(userRole, 'viewPayables') && (
                                            <li>
                                                <Link to="/payables" onClick={closeSidebar}>
                                                    Payables
                                                </Link>
                                            </li>
                                        )}
                                        {hasPermission(userRole, 'viewAdminSettings') && (
                                            <li>
                                                <Link to="/admin-settings" onClick={closeSidebar}>
                                                    Admin Settings
                                                </Link>
                                            </li>
                                        )}
                                        {hasPermission(userRole, 'viewAdminSettings') && (
                                            <li>
                                                <Link to="/ledger" onClick={closeSidebar}>
                                                    Ledger
                                                </Link>
                                            </li>
                                        )}

                                    </ul>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout <FaUserMinus />
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login" className="login-btn" onClick={closeSidebar}>
                        Login <FaUserPlus />
                    </Link>
                    <Link to="/signup" className="signup-btn" onClick={closeSidebar}>
                        Signup
                    </Link>
                </>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    justify-content: center;

    .user-provider {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
    }

    .user-info {
        margin-right: 10px;
        color: ${(props) => (props.scrolled ? 'green' : 'yellow')};
    }

    .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        background-color: #2c303a;
        border: 2px solid #2c303a;

        img {
            object-fit: cover;
            width: 100%;
            height: 100%;
        }

        &:hover {
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        }
    }

    .logout-btn,
    .login-btn,
    .signup-btn {
        padding: 0.5rem 1rem;
        background: var(--clr-red-dark);
        border: none;
        color: var(--clr-white);
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s;
        margin-left: 16px;

        &:hover {
            background: var(--clr-red-light);
        }
    }
`;

const Tooltip = styled.div`
    position: absolute;
    background: white;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    padding: 5px;
    border-radius: 10px;
    z-index: 1;

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        padding: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    li:hover {
        background-color: var(--clr-red-light);
        color: white;
    }
`;

export default CartButtons;
