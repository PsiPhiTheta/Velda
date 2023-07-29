import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import mainLogo from './assets/ticket-transparent.png';
import button from './assets/download-white-icon-button.png';
import domtoimage from 'dom-to-image';

function App() {
  const ticketRef = useRef();
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [fetchedData, setFetchedData] = useState();
  const [fadeIn, setFadeIn] = useState(false); // State to control the fade-in effect

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://europe-west3-similarmind-e9f01.cloudfunctions.net/app/getClients');
      setFetchedData(await response.json());
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Trigger the fade-in effect after a delay
    setTimeout(() => {
      setFadeIn(true);
    }, 100); // Adjust the delay value as needed
  }, []);

  if (fetchedData == null) {
    return;
  }

  const exportAsImage = async (element, imageFileName) => {
    setIsButtonVisible(false);
    domtoimage.toPng(element)
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = `${imageFileName}.png`;
        link.href = dataUrl;
        link.click();
        setIsButtonVisible(true);
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });

  };

  const firstClientDate = new Date(fetchedData.clients[0].timestamp);
  const updatedVisitorCount = fetchedData.visitorCount - 700

  return (
    <div className="App">
      <div
        ref={ticketRef}
        className={`ticket ${fadeIn ? 'fade-in' : ''}`}
        style={{
          height: '722px',
          width: '343px',
          backgroundImage: `url(${mainLogo})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}>
        <div className="text-overlay-1">
          GODCASTING <br /> S2
        </div>

        {isButtonVisible ? (
          <div className="download-button">
            <img onClick={() => exportAsImage(ticketRef.current, "ticket")} src={button} alt="download" />
          </div>
        ) : (
          <div className='button-dummy' />
        )}

        <div className="text-overlay-2">
          {`${firstClientDate.toLocaleDateString()} ${firstClientDate.toLocaleTimeString()}`}
        </div>

        <div className="text-overlay-3">
          {`#${String(updatedVisitorCount).padStart(3, '0')}`}
        </div>
      </div>
    </div>
  );
}

export default App;
