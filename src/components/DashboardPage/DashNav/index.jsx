import React, { useContext } from "react";
import "./DashNav.styles.css";
import userImg from "../../../assets/images/userImg.png";
import { DashContext } from "..";
import { FetchedContext } from "../../../App";

const DashNav = () => {
  const { isDash, setIsDash } = useContext(DashContext);
  const { openUserAccount, setOpenUserAccount, userProfile } = useContext(FetchedContext); // Get userProfile from context

  const dashClick = () => {
    setIsDash(true);
  };

  const taskClick = () => {
    setIsDash(false);
  };

  return (
    <div className="dash-nav">
      <div className="dash-logo">
        <span>t</span>odoList
      </div>
      {/* Dash/Tasks Toggler */}
      <div className="dash-tasks-togg">
        <div
          className={`dash-tog-btn dash-btn ${isDash ? "active-toggle" : ""}`}
          onClick={dashClick}
        >
          Dashboard
        </div>
        <div
          className={`dash-tog-btn tasks-btn ${isDash ? "" : "active-toggle"}`}
          onClick={taskClick}
        >
          Tasks
        </div>
      </div>

      <div className="user-account-name">
        {/* For Responsiveness */}
        <div
          className="user-img-state"
          onClick={() => {
            setOpenUserAccount(!openUserAccount);
          }}
        >
          <img className="user-img-img" src={userImg} alt="" />
        </div>
        {/* For Regular Use */}

      </div>
    </div>
  );
};

export default DashNav;
