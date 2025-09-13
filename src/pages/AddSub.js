import { useEffect, useState } from "react";
import { useGroupDetailsContext } from "../context/group_context";
import { useCompanySubscriberContext } from "../context/companysubscriber_context";
import { useParams, useHistory } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import { FiTrash2 } from "react-icons/fi";
import { FaMagic } from "react-icons/fa";
import loadingImage from "../images/preloader.gif";
import { ToastContainer, toast } from "react-toastify";

const AddSub = () => {
  const history = useHistory();
  const { groupId } = useParams();
  const {
    data,
    isLoading,
    fetchGroups,
    deleteGroupSubscriber,
    noofCompanySubscriber,
  } = useGroupDetailsContext();

  const { companySubscribers } = useCompanySubscriberContext();

  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchGroups(groupId);
  }, [groupId]);

  // --- Subscriber Counts ---
  const totalSubscribers =
    data?.results?.type === "FIXED"
      ? data?.results?.totalTenture ?? 0
      : data?.results?.noOfSubcribers ?? 0;

  const addedSubscribers = data?.results?.groupSubcriberResult?.length ?? 0;
  const outstandingSubscribers = totalSubscribers - addedSubscribers;

  // Get company subscriber count from context
  const actualCompanySubscriberCount = companySubscribers?.length ?? 0;

  // --- Handlers ---
  const handleOpenPopup = () => setOpen(true);
  const handleAddNewClick = () => {
    history.push(`/addgroupsubscriber/${groupId}/addnew`);
    setOpen(false);
  };
  const handleCompanySubscriberClick = () => {
    history.push(`/addgroupsubscriber/${groupId}/addcompanysubcriber`);
    setOpen(false);
  };
  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  if (isLoading) {
    return (
      <>
        <img
          src={loadingImage}
          className="loading-img"
          alt="loading"
          style={{ display: "block", margin: "2rem auto" }}
        />
        <div style={{ height: "50vh" }}></div>
      </>
    );
  }

  return (
    <Wrapper>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Header>Add Subscribers</Header>

      <SummaryBar>
        <SummaryCard>
          <strong>Total:</strong> {totalSubscribers}
        </SummaryCard>
        <SummaryCard>
          <strong>Added:</strong> {addedSubscribers}
        </SummaryCard>

        {/* Outstanding with Genie Effect */}
        <OutstandingCard highlight={outstandingSubscribers > 0}>
          {outstandingSubscribers > 0 && (
            <GenieBubble>
              🧞 Genie says: Add {outstandingSubscribers} subscriber to complete the group!
            </GenieBubble>
          )}
          <strong>Outstanding:</strong> {outstandingSubscribers}
          {outstandingSubscribers > 0 && <FaMagic style={{ marginLeft: "6px" }} />}
        </OutstandingCard>
      </SummaryBar>

      <TopBar>
        <BackButton onClick={() => history.goBack()}>Back</BackButton>
        <AddButton onClick={handleOpenPopup}>
          + Add {outstandingSubscribers ?? 0} Subscriber
        </AddButton>
        <ToggleViewBtn onClick={toggleViewMode}>
          {viewMode === "grid" ? "List View" : "Grid View"}
        </ToggleViewBtn>
      </TopBar>

      <AddSubSubscriberList viewMode={viewMode}>
        {data?.results?.groupSubcriberResult?.length > 0 ? (
          data?.results?.groupSubcriberResult?.map((sub) => (
            <AddSubSubscriberCard key={sub.group_subscriber_id} viewMode={viewMode}>
              <img src={sub?.user_image_from_s3 || "default-image.jpg"} alt={sub.name} />
              <div className="info">
                <p className="name">{sub.name}</p>
                <p className="phone">{sub.phone || "No phone"}</p>
              </div>

              <DeleteBtn
                onClick={async (e) => {
                  e.stopPropagation();
                  console.log("Deleting:", sub.group_subscriber_id, groupId);

                  const result = await deleteGroupSubscriber(sub.group_subscriber_id, groupId);

                  if (result.success) {
                    toast.success(result.message);
                    await fetchGroups(groupId);
                  } else {
                    toast.error(result.message);
                  }
                }}
              >
                <FiTrash2 />
              </DeleteBtn>
            </AddSubSubscriberCard>
          ))
        ) : (
          <p>No subscribers found.</p>
        )}
      </AddSubSubscriberList>

      {open && (
        <PopupOverlay>
          <PopupCard>
            <CloseBtn onClick={() => setOpen(false)}>&times;</CloseBtn>
            <PopupTitle>
              Add Subscribers <span>({outstandingSubscribers ?? 0})</span>
            </PopupTitle>
            <PopupActions>
              <PopupBtnPrimary onClick={handleAddNewClick}>➕ Add New</PopupBtnPrimary>
              <PopupBtnCompany onClick={handleCompanySubscriberClick}>
                🏢 Company Subscribers ({actualCompanySubscriberCount})
              </PopupBtnCompany>
            </PopupActions>
          </PopupCard>
        </PopupOverlay>
      )}
    </Wrapper>
  );
};

/* ---------------- STYLED COMPONENTS ---------------- */

const Wrapper = styled.section`
  padding: 2rem;
`;

const Header = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.6rem;
  font-weight: bold;
  color: #a4161a;
`;

const SummaryBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SummaryCard = styled.div`
  flex: 1;
  min-width: 120px;
  background: #fff0f0;
  color: #cd3240;
  font-weight: bold;
  text-align: center;
  padding: 1rem 0;
  border-radius: 8px;
  box-shadow: var(--light-shadow);
  font-size: 1rem;

  @media (max-width: 600px) {
    flex: 1 1 100%;
  }
`;

/* Pulse animation */
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(205, 50, 64, 0.7); }
  70% { box-shadow: 0 0 0 12px rgba(205, 50, 64, 0); }
  100% { box-shadow: 0 0 0 0 rgba(205, 50, 64, 0); }
`;

/* Genie speech bubble */
const GenieBubble = styled.div`
  position: absolute;
  top: -45px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  color: #333;
  font-size: 0.8rem;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  animation: fadeInOut 3s ease-in-out infinite;

  @keyframes fadeInOut {
    0%,100% { opacity: 0; transform: translate(-50%, -10px); }
    20%,80% { opacity: 1; transform: translate(-50%, 0); }
  }
`;

const OutstandingCard = styled(SummaryCard)`
  position: relative;

  ${({ highlight }) =>
    highlight &&
    css`
      animation: ${pulse} 2s infinite;
    `}
`;

const TopBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const BackButton = styled.button`
  background-color: #cd3240;
  color: white;
  padding: 0.5rem 0.8rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
`;

const AddButton = styled.button`
  background-color: #cd3240;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
`;

const ToggleViewBtn = styled.button`
  background-color: #555;
  color: white;
  padding: 0.5rem 0.8rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
`;

const AddSubSubscriberList = styled.div`
  display: ${({ viewMode }) => (viewMode === "grid" ? "grid" : "flex")};
  flex-direction: ${({ viewMode }) => (viewMode === "grid" ? "initial" : "column")};
  grid-template-columns: ${({ viewMode }) =>
    viewMode === "grid" ? "repeat(auto-fill, minmax(220px, 1fr))" : "none"};
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: ${({ viewMode }) =>
    viewMode === "grid" ? "repeat(auto-fill, minmax(180px, 1fr))" : "none"};
  }
  @media (max-width: 480px) {
    grid-template-columns: ${({ viewMode }) =>
    viewMode === "grid" ? "repeat(auto-fill, minmax(150px, 1fr))" : "none"};
  }
`;

const AddSubSubscriberCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: var(--light-shadow);
  display: flex;
  flex-direction: ${({ viewMode }) => (viewMode === "grid" ? "column" : "row")};
  align-items: ${({ viewMode }) => (viewMode === "grid" ? "center" : "flex-start")};
  padding: 0.5rem 0.6rem;
  gap: 0.5rem;
  width: ${({ viewMode }) => (viewMode === "grid" ? "auto" : "100%")};

  img {
    width: ${({ viewMode }) => (viewMode === "grid" ? "40px" : "35px")};
    height: ${({ viewMode }) => (viewMode === "grid" ? "40px" : "35px")};
    border-radius: 50%;
    object-fit: cover;
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: ${({ viewMode }) => (viewMode === "grid" ? "0" : "0.5rem")};
    .name {
      font-weight: bold;
      margin: 0;
      font-size: 0.9rem;
    }
    .phone {
      font-size: 0.75rem;
      color: gray;
    }
  }
`;

const DeleteBtn = styled.button`
  background: transparent;
  border: none;
  color: #cd3240;
  font-size: 1.2rem;
  cursor: pointer;
`;

/* Popup styles */
const PopupOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
`;

const PopupCard = styled.div`
  position: relative;
  background: #fff;
  padding: 1.8rem;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: scaleIn 0.25s ease;
  @keyframes scaleIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: #888;
`;

const PopupTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
  color: #cd3240;
  span {
    font-weight: normal;
    color: #444;
  }
`;

const PopupActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const PopupBtnPrimary = styled.button`
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-size: 1rem;
  border: none;
  background: #cd3240;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
  &:hover {
    background: #a4161a;
  }
`;

const PopupBtnCompany = styled.button`
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-size: 1rem;
  border: none;
  background: #cd3240;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;

  &:hover {
    background: #a4161a;
  }
`;

export default AddSub;
