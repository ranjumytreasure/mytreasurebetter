import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AppContext from './Context';
import GroupDetails from './GroupDetails';
import GroupType from './GroupType';
import CommisionDetails from './CommissionDetails';
import AuctionDetails from './AuctionDetails';
import PreviewAndSubmit from './PreviewAndSubmit';
import Finish from './Finish';
import ProgressBar from './ProgressBar';
import { useLocation } from 'react-router-dom';

const GroupStepForm = () => {
    const location = useLocation();
    const { storedGroupData } = location.state || {};
    const history = useHistory();

    const [step, setStep] = useState(0);
    const [focusTrigger, setFocusTrigger] = useState(0);
    const [groupname, setGroupName] = useState("");
    const [groupamt, setGroupAmt] = useState("");
    const [noofsub, setNoOfSub] = useState("");
    const [noofmonths, setNoOfMonths] = useState("");
    const [grouptype, setGroupType] = useState("");
    const [commtype, setCommType] = useState("");
    const [commpercentage, setCommPercent] = useState("");
    const [commamt, setCommAmt] = useState("");
    const [auctfreq, setAuctFreq] = useState("");
    const [firstauctdt, setFirstAuctdt] = useState("");
    const [auctstarttime, setAuctStartTime] = useState("");
    const [auctendtime, setAuctEndTime] = useState("");
    const [auctplace, setAuctPlace] = useState("");
    const [groupid, setGroupId] = useState("");

    // Scroll to top whenever step changes
    useEffect(() => {
        // Small delay to ensure DOM has updated
        const timer = setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);

        return () => clearTimeout(timer);
    }, [step]);

    useEffect(() => {
        if (storedGroupData) {
            setStep(storedGroupData.step);
            setGroupName(storedGroupData.groupName);
            setGroupAmt(storedGroupData.groupAmt);
            setNoOfSub(storedGroupData.groupNoOfSub);
            setNoOfMonths(storedGroupData.groupNoOfMonths);
            setGroupType(storedGroupData.groupType);
            setCommType(storedGroupData.commissionType);
            setCommAmt(storedGroupData.commissionAmount);
            setAuctFreq(storedGroupData.auctionMode);
            setFirstAuctdt(storedGroupData.firstAuctDate);
            setAuctStartTime(storedGroupData.auctStartTime);
            setAuctEndTime(storedGroupData.auctEndTime);
            setAuctPlace(storedGroupData.auctionPlace);
        }
    }, [storedGroupData]);

    // Handle back to home navigation
    const handleBackToHome = () => {
        history.push('/chit-fund/user/home');
    };

    const groupDetails = {
        currentPage: step,
        groupName: groupname,
        groupAmt: groupamt,
        groupNoOfSub: noofsub,
        groupNoOfMonths: noofmonths,
        groupType: grouptype,
        commType: commtype,
        commPercentage: commpercentage,
        commAmt: commamt,
        auctFreq: auctfreq,
        firstAuctDate: firstauctdt,
        auctStartTime: auctstarttime,
        auctEndTime: auctendtime,
        auctPlace: auctplace,
        groupId: groupid,
        setGroupName,
        setGroupAmt,
        setNoOfSub,
        setNoOfMonths,
        setStep: (newStep) => {
            setStep(newStep);
            setFocusTrigger(prev => prev + 1); // Trigger focus on step change
        },
        setGroupType,
        setCommType,
        setCommPercent,
        setCommAmt,
        setAuctFreq,
        setFirstAuctdt,
        setAuctStartTime,
        setAuctEndTime,
        setAuctPlace,
        setGroupId,
        focusTrigger
    };

    return (
        <AppContext.Provider value={{ groupDetails }}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-4">
                <div className="flex flex-col items-center p-4 max-w-6xl mx-auto">
                    {/* Back to Home Button */}
                    <div className="w-full max-w-4xl mb-4">
                        <button
                            onClick={handleBackToHome}
                            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg"
                        >
                            <span className="text-lg">←</span>
                            Back to Home
                        </button>
                    </div>

                    <div className="flex flex-col justify-between items-center w-full max-w-4xl">
                        <ProgressBar />
                        {step === 0 && <GroupType />}
                        {step === 1 && <GroupDetails />}
                        {step === 2 && <CommisionDetails />}
                        {step === 3 && <AuctionDetails />}
                        {step === 4 && <PreviewAndSubmit />}
                        {step === 5 && <Finish />}
                    </div>
                </div>
            </div>
        </AppContext.Provider>
    );
};

export default GroupStepForm;
