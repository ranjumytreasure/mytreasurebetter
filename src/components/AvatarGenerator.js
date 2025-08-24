import React, { useEffect, useState } from 'react';

const AvatarGenerator = ({ seed, width, height, setUserImageUrl }) => {
    const [url, setUrl] = useState('');
    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await fetch(`https://api.multiavatar.com/${seed}.png`, {
                    headers: {
                        'Accept': 'image/png',
                    },
                });


                if (!response.ok) {
                    throw new Error('Failed to fetch avatar');
                }

                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);

                // Ensure setUserImageUrl is called after setting the URL
                setUrl(imageUrl);
                setUserImageUrl(imageUrl);

                console.log('lollu saba');
                console.log(imageUrl);
            } catch (error) {
                console.error(error);
                // Handle the error as needed
            }
        };
        fetchAvatar();
    }, [seed, setUserImageUrl]);



    const avatarStyles = {
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: '#2c303a',
        border: '2px solid #2c303a',
        transition: 'transform 0.3s ease',
    };

    const imgStyles = {
        objectFit: 'cover',
        width: '100%',
        height: '100%',
    };

    return (
        <div style={avatarStyles}>
            <img
                src={url}
                alt="Avatar"
                style={imgStyles}
            />
        </div>
    );
};

export default AvatarGenerator;



// import React from 'react';
// import multiavatar from '@multiavatar/multiavatar';


// const AvatarGenerator = ({ seed, width, height, setUserImageUrl }) => {
//     const avatarUrl = multiavatar(seed);
//     console.log('avatarUrl');
//     console.log(avatarUrl);
//     setUserImageUrl(avatarUrl);

//     // Convert CSS styles into an inline style object
//     const avatarStyles = {
//         width: `${width}px`,
//         height: `${height}px`,
//         borderRadius: '50%',
//         overflow: 'hidden',
//         backgroundColor: '#2c303a',
//         border: '2px solid #2c303a',
//         transition: 'transform 0.3s ease',
//     };

//     // Use inline styles to set width and height
//     const imgStyles = {
//         objectFit: 'cover',
//         width: '100%',
//         height: '100%',
//     };

//     return (
//         <div style={avatarStyles}>
//             <img
//                 src={`data:image/svg+xml;utf8,${encodeURIComponent(avatarUrl)}`}
//                 alt="Avatar"
//                 style={imgStyles}
//             />
//         </div>
//     );
// }

// export default AvatarGenerator;
