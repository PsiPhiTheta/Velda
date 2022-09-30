import React, {useEffect, useState} from 'react';
import './App.css';

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

  console.log(fetchedData.clients);

  return (
    <div className="App">
      <header className="App-header">
        <h1>{`Welcome #${fetchedData.visitorCount}`}</h1>
        {fetchedData.clients.map((client, idx) => {
          const date = new Date(client.timestamp).toLocaleDateString();
          const time = new Date(client.timestamp).toLocaleTimeString();
          return (
            <p key={idx}>{`#${fetchedData.visitorCount - idx} · ${client.ip} · ${date} ${time}`}</p>
          )})}
      </header>
    </div>
  );
}

export default App;
