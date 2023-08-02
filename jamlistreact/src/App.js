import './App.css';
import FrontPage from './main/FrontPage.js'
import AdminPage from './admin/AdminPage';
import React, { useEffect, useState } from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const baseurl = 'http://localhost:5000'

let flag = false;
function App() {

  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  //removeCookie('user')

  useEffect(() => {
    const requestUserID = async () => {
      if (!cookies.user && !flag) {
          flag = true;
          fetch(baseurl + '/api/logon/', { mode: 'cors' })
            .then((response) => response.json())
            .then((userid) => { setCookie('user', userid, { path: '/' }) })
            .catch(()=> console.error("Could not reach server!"));
      }
    }
    requestUserID();
  }, [])

  return (
    <CookiesProvider>
      {cookies.user}
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<FrontPage user={cookies.user || "default"} />} />
      <Route path="/admin" element={<AdminPage user={cookies.user || "default"} />} />
      </Routes>
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
