import React, { useContext } from "react";
import "./UserAccount.styles.css";
import userImg from "../../../assets/images/userImg.png";
import { Link } from "react-router-dom";
import { FetchedContext } from "../../../App";

const UserAccount = () => {
  const { userProfile, logout } = useContext(FetchedContext); // Get userProfile from context

  return (
    <div className="user-account-container">
      <div className="user-image">
        <img src={userImg} alt="User" />
      </div>
      <div className="user-profile-name">
        {userProfile ? `Hi, ${userProfile.username}` : "Loading..."}
      </div>

      <Link
        className="logout"
        to="/"
        onClick={() => {
          logout(); // Call logout function
        }}
      >
        Logout
      </Link>
    </div>
  );
};

export default UserAccount;
