import './App.css';
import FrontPage from './main/FrontPage.js'
import React, { useEffect, useState } from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';


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
      <FrontPage user={cookies.user || "default"} />
    </CookiesProvider>
  );
}

export default App;
