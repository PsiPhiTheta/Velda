import React, {useEffect, useState} from 'react';
import './App.css';
import mainLogo from './assets/ticket-transparent.png';
import button from './assets/download-white-icon-button.png';

function App() {
  const [fetchedData, setFetchedData] = useState();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://europe-west3-similarmind-e9f01.cloudfunctions.net/app/getClients');

      setFetchedData(await response.json());
    }

    fetchData();
  }, []);

  if (fetchedData == null) {
    return;
  }

  console.log(navigator.userAgent);

  const firstClientDate = new Date(fetchedData.clients[0].timestamp);
  const updatedVisitorCount = fetchedData.visitorCount - 658

  return (
    <div className="App">
      <header className="App-header">   
        <div className="background-image">
          <img src={mainLogo} alt="ticket" />
        </div>

        <div className="overlay-content">
          <div className="text-overlay-1">
            Godcasting <br/> S2
          </div>

          <a href={mainLogo} download="mainLogo.png">
            <div className="download-button">
              <img src={button} alt="download" />
            </div>
          </a>

          <div className="text-overlay-2">
              {`${firstClientDate.toLocaleDateString()} ${firstClientDate.toLocaleTimeString()}`}
          </div>

          <div className="text-overlay-3">
              {`#${String(updatedVisitorCount).padStart(3, '0')}`}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
