import React from 'react';

function Menu({ onSelect, selectedMenu }) {
    const menuItems = [
        // 'Personal Settings',
        'Area of Business',
        // 'Subscribers',
        'Employees',
        'Manage Groups',


    ];

    return (
        <div>
            <p className='menuheading'>Menu</p>
            <ul>
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        onClick={() => onSelect(item.toLowerCase().replace(' ', ''))}
                        className={selectedMenu === item.toLowerCase().replace(' ', '') ? 'active' : ''}
                        style={{ height: "36px", marginBottom: "4px", padding: "5px 12px" }}>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Menu;
