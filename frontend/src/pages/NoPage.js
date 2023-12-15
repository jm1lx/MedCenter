import React from 'react';
import { useNavigate } from 'react-router-dom';
import Appbar from '../components/Appbar';
import './NoPage.css'; // Asegúrate de tener tu archivo CSS correspondiente

function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    // Manejar lógica antes de navegar si es necesario
    navigate('/home');
  };

  return (
    <div className="Home">
      <Appbar />
      <h2>Error 404: Page Not Found </h2>
      <button className="custom-button" onClick={handleClick}>
        Go Home
      </button>
    </div>
  );
}

export default Home;
