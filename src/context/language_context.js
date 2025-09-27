import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [translations, setTranslations] = useState({});

    // Translation files
    const translationFiles = {
        en: {
            // Common
            app_name: 'Treasure',
            language: 'Language',
            english: 'English',
            tamil: 'தமிழ்',
            kannada: 'ಕನ್ನಡ',
            
            // Login
            sign_in: 'Sign In',
            password: 'Password',
            phone: 'Phone Number',
            welcome: 'Welcome to Treasure',
            forgot_password: 'Forgot Password?',
            
            // Dashboard
            dashboard: 'Dashboard',
            my_groups: 'My Groups',
            transactions: 'Transactions',
            profile: 'Profile',
            logout: 'Log Out',
            
            // Groups
            groups: 'Groups',
            in_progress: 'In Progress',
            completed: 'Completed',
            new: 'New',
            see_all: 'See All',
            due: 'Due',
            auction: 'Auction',
            auction_winner: 'Auction Winner',
            more: 'More',
            
            // Profile
            edit_profile: 'Edit Profile',
            personal_information: 'Personal Information',
            account_settings: 'Account Settings',
            first_name: 'First Name',
            last_name: 'Last Name',
            email: 'Email Address',
            phone_number: 'Phone Number',
            date_of_birth: 'Date of Birth',
            gender: 'Gender',
            change_password: 'Change Password',
            email_notifications: 'Email Notifications',
            sms_notifications: 'SMS Notifications',
            save_changes: 'Save Changes',
            cancel: 'Cancel',
            
            // Common actions
            submit: 'Submit',
            confirm: 'Confirm',
            cancel_editing: 'Cancel Editing',
            manage: 'Manage',
            configure: 'Configure',
            change: 'Change',
            
            // Status
            status: 'Status',
            balance: 'Balance',
            remaining: 'Remaining',
            amount: 'Amount',
            date: 'Date',
            profit: 'Profit',
            commission: 'Commission',
            total: 'Total',
            credit: 'Credit',
            
            // Messages
            no_data: 'No Data Available',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            welcome_message: 'Welcome',
            
            // Gender options
            select_gender: 'Select Gender',
            male: 'Male',
            female: 'Female',
            other: 'Other'
        },
        ta: {
            // Common
            app_name: 'Treasure',
            language: 'மொழி',
            english: 'English',
            tamil: 'தமிழ்',
            kannada: 'ಕನ್ನಡ',
            
            // Login
            sign_in: 'உள்நுழைவு',
            password: 'கடவுச்சொல்',
            phone: 'தொலைபேசி எண்',
            welcome: 'Treasure-க்கு வரவேற்கிறோம்',
            forgot_password: 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?',
            
            // Dashboard
            dashboard: 'கட்டுப்பாட்டு பலகை',
            my_groups: 'என் குழுக்கள்',
            transactions: 'பரிவர்த்தனைகள்',
            profile: 'சுயவிவரம்',
            logout: 'வெளியேறு',
            
            // Groups
            groups: 'குழுக்கள்',
            in_progress: 'நடப்பில்',
            completed: 'முடிந்தது',
            new: 'புதியது',
            see_all: 'அனைத்தையும் பார்',
            due: 'செலுத்த வேண்டியவை',
            auction: 'ஏலம்',
            auction_winner: 'ஏல வெற்றியாளர்',
            more: 'மேலும்',
            
            // Profile
            edit_profile: 'சுயவிவரத்தை திருத்து',
            personal_information: 'தனிப்பட்ட தகவல்கள்',
            account_settings: 'கணக்கு அமைப்புகள்',
            first_name: 'முதல் பெயர்',
            last_name: 'கடைசி பெயர்',
            email: 'மின்னஞ்சல் முகவரி',
            phone_number: 'தொலைபேசி எண்',
            date_of_birth: 'பிறந்த தேதி',
            gender: 'பாலினம்',
            change_password: 'கடவுச்சொல்லை மாற்று',
            email_notifications: 'மின்னஞ்சல் அறிவிப்புகள்',
            sms_notifications: 'SMS அறிவிப்புகள்',
            save_changes: 'மாற்றங்களை சேமி',
            cancel: 'ரத்து செய்',
            
            // Common actions
            submit: 'சமர்ப்பி',
            confirm: 'உறுதிப்படுத்து',
            cancel_editing: 'திருத்துதலை ரத்து செய்',
            manage: 'நிர்வகி',
            configure: 'கட்டமை',
            change: 'மாற்று',
            
            // Status
            status: 'நிலை',
            balance: 'இருப்பு',
            remaining: 'மீதமுள்ள',
            amount: 'தொகை',
            date: 'தேதி',
            profit: 'லாபம்',
            commission: 'தரகு',
            total: 'மொத்தம்',
            credit: 'கடன்',
            
            // Messages
            no_data: 'தரவு இல்லை',
            loading: 'ஏற்றுகிறது...',
            error: 'பிழை',
            success: 'வெற்றி',
            welcome_message: 'வரவேற்கிறோம்',
            
            // Gender options
            select_gender: 'பாலினத்தை தேர்ந்தெடு',
            male: 'ஆண்',
            female: 'பெண்',
            other: 'மற்றவை'
        },
        kn: {
            // Common
            app_name: 'Treasure',
            language: 'ಭಾಷೆ',
            english: 'English',
            tamil: 'தமிழ்',
            kannada: 'ಕನ್ನಡ',
            
            // Login
            sign_in: 'ಸೈನ್ ಇನ್',
            password: 'ಪಾಸ್‌ವರ್ಡ್',
            phone: 'ಫೋನ್ ಸಂಖ್ಯೆ',
            welcome: 'Treasure ಗೆ ಸ್ವಾಗತ',
            forgot_password: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?',
            
            // Dashboard
            dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
            my_groups: 'ನನ್ನ ಗುಂಪುಗಳು',
            transactions: 'ವಹಿವಾಟುಗಳು',
            profile: 'ಪ್ರೊಫೈಲ್',
            logout: 'ಲಾಗ್ ಔಟ್',
            
            // Groups
            groups: 'ಗುಂಪುಗಳು',
            in_progress: 'ಪ್ರಗತಿಯಲ್ಲಿದೆ',
            completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
            new: 'ಹೊಸದು',
            see_all: 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ',
            due: 'ಬಾಕಿ',
            auction: 'ನಲ್ಲಿ',
            auction_winner: 'ನಲ್ಲಿ ಗೆದ್ದವರು',
            more: 'ಇನ್ನಷ್ಟು',
            
            // Profile
            edit_profile: 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ',
            personal_information: 'ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ',
            account_settings: 'ಖಾತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
            first_name: 'ಮೊದಲ ಹೆಸರು',
            last_name: 'ಕೊನೆಯ ಹೆಸರು',
            email: 'ಇಮೇಲ್ ವಿಳಾಸ',
            phone_number: 'ಫೋನ್ ಸಂಖ್ಯೆ',
            date_of_birth: 'ಜನ್ಮ ದಿನಾಂಕ',
            gender: 'ಲಿಂಗ',
            change_password: 'ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಿ',
            email_notifications: 'ಇಮೇಲ್ ಅಧಿಸೂಚನೆಗಳು',
            sms_notifications: 'SMS ಅಧಿಸೂಚನೆಗಳು',
            save_changes: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
            cancel: 'ರದ್ದುಗೊಳಿಸಿ',
            
            // Common actions
            submit: 'ಸಲ್ಲಿಸಿ',
            confirm: 'ದೃಢೀಕರಿಸಿ',
            cancel_editing: 'ಸಂಪಾದನೆಯನ್ನು ರದ್ದುಗೊಳಿಸಿ',
            manage: 'ನಿರ್ವಹಿಸಿ',
            configure: 'ಕಾನ್ಫಿಗರ್ ಮಾಡಿ',
            change: 'ಬದಲಾಯಿಸಿ',
            
            // Status
            status: 'ಸ್ಥಿತಿ',
            balance: 'ಬ್ಯಾಲೆನ್ಸ್',
            remaining: 'ಉಳಿದಿರುವ',
            amount: 'ಮೊತ್ತ',
            date: 'ದಿನಾಂಕ',
            profit: 'ಲಾಭ',
            commission: 'ಕಮಿಷನ್',
            total: 'ಒಟ್ಟು',
            credit: 'ಕ್ರೆಡಿಟ್',
            
            // Messages
            no_data: 'ದತ್ತಾಂಶ ಲಭ್ಯವಿಲ್ಲ',
            loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
            error: 'ದೋಷ',
            success: 'ಯಶಸ್ಸು',
            welcome_message: 'ಸ್ವಾಗತ',
            
            // Gender options
            select_gender: 'ಲಿಂಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
            male: 'ಪುರುಷ',
            female: 'ಸ್ತ್ರೀ',
            other: 'ಇತರೆ'
        }
    };

    // Load language from localStorage on mount
    useEffect(() => {
        const savedLanguage = localStorage.getItem('treasure_language') || 'en';
        setCurrentLanguage(savedLanguage);
        setTranslations(translationFiles[savedLanguage] || translationFiles.en);
    }, []);

    // Change language function
    const changeLanguage = (languageCode) => {
        setCurrentLanguage(languageCode);
        setTranslations(translationFiles[languageCode] || translationFiles.en);
        localStorage.setItem('treasure_language', languageCode);
    };

    // Get translation function
    const t = (key) => {
        return translations[key] || key;
    };

    return (
        <LanguageContext.Provider value={{
            currentLanguage,
            changeLanguage,
            t,
            translations
        }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

