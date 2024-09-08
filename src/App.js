import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import DashboardPage from "./components/DashboardPage";
import Footer from "./components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";

const FetchedContext = createContext();

function App() {
  const [tasks, setTasks] = useState([]);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [descriptionData, setDescriptionData] = useState({});
  const [openUserAccount, setOpenUserAccount] = useState(false);
  const [isAuth, setAuth] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token && !userProfile) { // Only fetch if not already available
          const response = await fetch("https://quadbserver-mdzg.onrender.com/api/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserProfile(data);
          } else {
            console.log("Failed to fetch profile");
          }
        }
      } catch (error) {
        // console.error("Error fetching profile:", error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos");
        const data = await response.json();
        setTasks(data);
        localStorage.setItem("tasks", JSON.stringify(data));
      } catch (error) {
        notify("Error Fetching Tasks from API!", "error");
        console.log("Error Fetching Tasks!", error);
      }
    };

    // Retrieve tasks from localStorage
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks && storedTasks.length > 0) {
      setTasks(storedTasks);
    } else {
      fetchTasks(); // Only fetch if no tasks in localStorage
    }

    const token = localStorage.getItem("token");
    if (token) {
      setAuth(true);
      fetchProfileData(); // Fetch profile data if authenticated
    }
  }, [userProfile]); // Depend on userProfile to avoid refetching

  const deleteTask = async (id) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: "DELETE",
      });
      const updatedTasks = tasks.filter((task) => task.id !== id);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      notify("Task Deleted Successfully!", "success");
      if (isDescriptionOpen) setIsDescriptionOpen(false);
    } catch (error) {
      notify("Error Deleting Task!", "error");
      console.log("Error Deleting Task!", error);
    }
  };

  const showDescription = (id) => {
    setIsDescriptionOpen(!isDescriptionOpen);
    const updatedDesc = tasks.find((task) => task.id === id);
    setDescriptionData(updatedDesc);
  };

  const notify = (msg, type) => {
    type === "success" ? toast.success(msg) : toast.error(msg);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    setUserProfile(null); // Clear user profile on logout
    notify("Logged out successfully!", "success");
  };

  const ProtectedRoute = ({ children }) => {
    return isAuth ? children : <Navigate to="/login" />;
  };

  return (
    <FetchedContext.Provider
      value={{
        tasks,
        setTasks,
        deleteTask,
        isDescriptionOpen,
        setIsDescriptionOpen,
        showDescription,
        descriptionData,
        setDescriptionData,
        notify,
        openUserAccount,
        setOpenUserAccount,
        isAuth,
        setAuth,
        logout,
        userProfile, // Provide user profile data
      }}
    >
      <div className="App">
        <ToastContainer />
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to login */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
        
      </div>
    </FetchedContext.Provider>
  );
}

export default App;
export { FetchedContext };
