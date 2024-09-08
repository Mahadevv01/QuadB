import React, { useState, createContext, useContext, useEffect } from "react";
import "./DashboardPage.styles.css";
import DashNav from "./DashNav";
import DashboardContainer from "./DashboardContainer";
import TasksContainer from "./TasksContainer";
import UserAccount from "./UserAccount";
import { FetchedContext } from "../../App";
import userImg from "../../assets/images/userImg.png";
import { Link } from "react-router-dom";
import axios from "axios"; // Axios for API requests

const DashContext = createContext();

const DashboardPage = () => {
  const [isDash, setIsDash] = useState(true);
  const { openUserAccount, setOpenUserAccount, tasks, notify, setUserProfile } =
    useContext(FetchedContext);
  const [userProfile, setLocalUserProfile] = useState(null); // State to store user profile

  // Fetching user profile after login
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token"); // Get token from local storage

      if (!token) {
        notify("No token found, please login!", "error");
        return;
      }

      try {
        // API call to fetch user profile using the token
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profileData = response.data;
        setLocalUserProfile(profileData); // Set local user profile data
        setUserProfile(profileData); // Set user profile in context
        notify("Profile fetched successfully!", "success");
      } catch (error) {
        console.log("Error fetching user profile:", error);
        // notify("Error fetching user profile!", "error");
      }
    };

    fetchUserProfile();
  }, [notify, setUserProfile]);

  return (
    <>
      <DashContext.Provider value={{ isDash, setIsDash }}>
        <div className="dashboard-page">
          <DashNav />

          <div className="dash-container-content">
            {isDash ? <DashboardContainer /> : <TasksContainer />}
            <UserAccount />
          </div>
        </div>
      </DashContext.Provider>

      {openUserAccount && (
        <div
          className="user-box-background"
          onClick={() => {
            setOpenUserAccount(!openUserAccount);
          }}
        >
          <div className="user-account-container" id="user-account">
            <div className="user-image">
              <img src={userImg} alt="" />
            </div>
            <div className="user-profile-name">
              {userProfile ? `Hi, ${userProfile.username}` : "Loading..."}
            </div>
            <div className="notification-container">
              <div className="notification-heading">Notifications</div>
              <div className="notification-box">
                {tasks
                  .filter((task) => task.alert === true)
                  .map((task, index) => {
                    return (
                      <div className="notifications" key={index}>
                        <h5>{task.title}</h5>
                        <p>
                          {task.date}, {task.time}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>

            <Link
              className="logout"
              to="/"
              onClick={() => {
                localStorage.removeItem("token"); // Remove token on logout
                notify("Logged out successfully!", "success");
              }}
            >
              Logout
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export { DashContext };
export default DashboardPage;
