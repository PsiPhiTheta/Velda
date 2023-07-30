import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import mainLogo from './assets/ticket-transparent.png';
import button from './assets/download-white-icon-button.png';
import domtoimage from 'dom-to-image';

function App() {
  const ticketRef = useRef();
  const [isButtonFlashing, setIsButtonFlashing] = useState(true);
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
    setFadeIn(true);
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsButtonFlashing(currentButtonFlashing => !currentButtonFlashing);
    }, 800);

    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    const onResize = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
    }
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
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
  const updatedVisitorCount = fetchedData.visitorCount - 1000

  return (
    <div className="App">
      <div
        ref={ticketRef}
        className={fadeIn ? 'fade-in' : ''}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '300px',
          maxWidth: '300px',
          position: 'relative',
          flexDirection: 'column'
        }}
      >
        <img alt='Ticket Background' src={mainLogo} style={{ width: '80%' }} />

        <div style={{ position: 'absolute', top: 0, zIndex: 100 }}>
          <div className="text-overlay-1">
            GODCASTING <br /> S2
          </div>

          {isButtonVisible && isButtonFlashing ? (
            <div className='button-dummy'>
              <img className='download-button' onClick={() => exportAsImage(ticketRef.current, "ticket")} src={button} alt="download" />
            </div>
          ) : (
            <div onClick={() => exportAsImage(ticketRef.current, "ticket")} className='button-dummy' />
          )}

          <div className="text-overlay-2">
            {`${firstClientDate.toLocaleDateString()} ${firstClientDate.toLocaleTimeString()}`}
          </div>

          <div className="text-overlay-3">
            {`# ${String(updatedVisitorCount).padStart(3, '0')}`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
