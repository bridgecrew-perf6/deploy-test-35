import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { authenticate,getUri,} from './deployer';
// import { deploy_contracts, callBuy } from './tobedeployed';


function App() {
  useEffect(()=>{
    
  })
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button
          onClick={authenticate}
        >Click to auth</button>
        <button
          onClick={()=>{
            getUri();
          }}
        >deploy</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
