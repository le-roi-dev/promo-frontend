import React, { useState, useCallback, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';
import ImportPage from './ImportPage';
import PromotionPage from './PromotionPage';
import HistoryPage from './HistoryPage';
import RequestPage from './RequestPage';
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState(null);
  const baseUrl = import.meta.env.VITE_REACT_APP_NODE_ENV === 'development'
    ? import.meta.env.VITE_REACT_APP_API_URL_DEV
    : import.meta.env.VITE_REACT_APP_API_URL_PROD;

  const handleLoginClick = useCallback(() => {
    window.location.href = `${baseUrl}/auth/google`;
  }, [baseUrl]);
  const location = useLocation();
  const handleLogoutClick = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/logout`, { credentials: 'include' });
      if (response.ok) {
        setUser(null);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, [baseUrl]);

  useEffect(() => {
    console.log('user: ', user);
  }, [user]);
  // useEffect(() => {
  //   // Log the current URL whenever the location changes
  //   console.log('Current URL:', location.pathname.slice(1));
  //   const nowUrl = location.pathname.slice(1);
  //   // if (nowUrl == "promotion" && user && user.type == 2) {
  //   //   window.location.href = `${baseUrl}/request`;
  //   // }
  //   // if (nowUrl == "request" && user && user.type == 1) {
  //   //   window.location.href = `${baseUrl}/promotion`;
  //   // }
  // }, [location]);
  const fetchUser = async () => {
    console.log('I am running from React frontend...');
    try {
      const response = await fetch(`${baseUrl}/api/user`, { credentials: 'include' });
      if (response.ok) {
        const userData = await response.json();

        fetchUserType(userData);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchUserType = (ud) => {
    axios
      .get("api/user-type?email=" + ud.email)
      .then((res) => {
        console.log("data->", res.data.data);
        const isUser1 = res.data.data;
        setUser({
          ...ud,
          type: isUser1 ? 1 : 0
        });
      })
      .catch(() => {
        console.log("Error while loading store data from google spreadsheet.");
      });
  }

  useEffect(() => {
    fetchUser();
    console.log('fetch call...');
    console.log(user);
  }, [baseUrl]);

  if (!user) {
    return <LoginPage onLoginClick={handleLoginClick} />;
  }
  // if (user.type == 1 && location.pathname == `/request`) {
  //   window.location.href = `/promotion`;
  // }

  // if (user.type == 2 && location.pathname == `/promotion`) {
  //   window.location.href = `/request`;
  // }
  // if (user.type == 2) {
  //   window.location.href = `/request`;
  // }
  return (
    <div>
      <Routes>
        <Route path="/import" element={<ImportPage userData={user} onLogoutClick={handleLogoutClick} />} />
        <Route path="/promotion" element={<PromotionPage userData={user} onLogoutClick={handleLogoutClick} />} />
        <Route path="/history" element={<HistoryPage userData={user} onLogoutClick={handleLogoutClick} />} />
        <Route path="/request" element={<RequestPage userData={user} onLogoutClick={handleLogoutClick} />} />
        <Route path="*" element={<Navigate to="/import" />} />
      </Routes>
    </div>
  );
};

export default App;
