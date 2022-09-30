import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/similarmind-e9f01/europe-west3/app/getClients',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const fetchedClients = await response.json();
      console.log(fetchedClients);
    }

    fetchData();
  })
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
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
