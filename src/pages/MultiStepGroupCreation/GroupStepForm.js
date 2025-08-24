import React, { useState, useEffect } from 'react';
import './styles.css';
import AppContext from './Context';
import GroupDetails from './GroupDetails';
import GroupType from './GroupType';
import CommisionDetails from './CommisionDetails';
import AuctionDetails from './AuctionDetails';
import PreviewAndSubmit from './PreviewAndSubmit';
import Finish from './Finish';
import ProgressBar from './ProgressBar';
import { useLocation } from 'react-router-dom'; // Import useLocation

const GroupStepForm = () => {
    const location = useLocation(); // Use useLocation hook to access location state
    const { storedGroupData } = location.state || {}; // Access the data from location.state

    console.log('before entering into multistepform');
    console.log(storedGroupData);
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

   
    const [step, setStep] = useState(0);
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
        setStep,
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
    };



    return (
        <AppContext.Provider value={{ groupDetails }}>
            <div className="main">
                <div className="body">
                    {/* <h3>Create the group</h3> */}
                    <div className="wrapper">
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