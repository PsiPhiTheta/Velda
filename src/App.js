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
  const [fadeIn, setFadeIn] = useState(false);
  const [base64Image, setBase64Image] = useState(); // State to store the base64 image

  useEffect(() => {
    fetch(mainLogo)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => setBase64Image(reader.result);
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://europe-west3-similarmind-e9f01.cloudfunctions.net/app/getClients');
      setFetchedData(await response.json());
    }

    fetchData();
  }, []);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsButtonFlashing(currentButtonFlashing => !currentButtonFlashing);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onResize = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (fetchedData == null) {
    return null; // Return null if fetchedData is not loaded yet
  }

  const exportAsImage = async (element, imageFileName) => {
    setIsButtonVisible(false);

    const captureImage = (attempts = 0) => {
      if (attempts >= 20) {
        console.error('Failed to capture image after 20 attempts');
        return Promise.reject('Failed to capture image');
      }

      return domtoimage.toPng(element)
        .then(dataUrl => {
          const sizeInBytes = Math.round(dataUrl.length * 3 / 4);
          const sizeInKB = sizeInBytes / 1024;

          // Check if the size is over 100KB
          if (sizeInKB > 100) {
            return dataUrl;
          } else {
            console.log("Attempts:", attempts)
            // If not, try capturing the image again, incrementing the attempts counter
            return captureImage(attempts + 1);
          }
        });
    };

    captureImage()
      .then(dataUrl => {
        var link = document.createElement('a');
        link.download = `${imageFileName}.png`;
        link.href = dataUrl;

        // Append the link to the body
        document.body.appendChild(link);

        // Trigger the click
        link.click();

        // Remove the link from the body after the download starts
        document.body.removeChild(link);

        setIsButtonVisible(true);
      })
      .catch(error => {
        console.error('oops, something went wrong!', error);
      });
  };


  const firstClientDate = new Date(fetchedData.clients[0].timestamp);
  const updatedVisitorCount = fetchedData.visitorCount - 1200;

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
          flexDirection: 'column',
        }}
      >
        <img alt='Ticket Background' src={base64Image} style={{ width: '80%', height: 'auto' }} />
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
