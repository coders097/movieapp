import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';


class ERRORGLOBALHANDLER extends React.Component{
  componentDidCatch=(e:any)=>{
    window.location.reload();
  }
  render=()=>{
    return <App/>;
  }
}


ReactDOM.render(
  <React.StrictMode>    
    <ERRORGLOBALHANDLER/>
  </React.StrictMode>,
  document.getElementById('root')
);
