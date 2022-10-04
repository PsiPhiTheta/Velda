import React, {useEffect, useState} from 'react';
import './App.css';
import ProgressTimer from 'react-progress-bar-timer';

function App() {
  const [fetchedData, setFetchedData] = useState();
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="App">
      <header className="App-header">
      
      {/* todo add logo background */}

      {loading && (<ProgressTimer label="Loading" duration={3} color='#596e79' fontColor='#fff' started={true} onFinish={() => setLoading(false)} />)}

      {!loading && (
        <h1>
          {`Captured:  #${fetchedData.visitorCount} · ${fetchedData.clients[0].ip} · ${firstClientDate.toLocaleDateString()} ${firstClientDate.toLocaleTimeString()}`}
        </h1>
      )}

      {fetchedData.clients.slice(1).map((client, idx) => {
        const date = new Date(client.timestamp).toLocaleDateString();
        const time = new Date(client.timestamp).toLocaleTimeString();
        return (
          <p key={idx}>{`#${fetchedData.visitorCount - idx - 1} · ${client.ip} · ${date} ${time}`}</p>
        )})}

      </header>
    </div>
  );
}

export default App;
