import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {CV} from "./cv/cv"
import "./index.css"


function loginFailed(reason) {
  console.log(reason);
}

function loggedIn() {
	console.log("estoy logeado");
}

window.onload = ()=>{
  CV.init({
      baseUrl : 'https://cv10.panaccess.com',
      mode: "json",
      jsonpTimeout: 5000,
      username: localStorage.getItem('cvUser'),
      password: localStorage.getItem('cvPass'),
      apiToken: localStorage.getItem('cvToken'),
      loginSuccessCallback: loggedIn,
      loginFailedCallback: loginFailed
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);


