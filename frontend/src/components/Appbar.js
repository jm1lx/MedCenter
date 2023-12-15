import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import logo from '../images/medcenter.png';
import './Appbar.css'
import person from '../images/person.png'
import cerrarsesionlogo from '../images/cerrarsesion.png'

export default function Appbar() {
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');
  const dni = localStorage.getItem('dni');
  const navigate=useNavigate();
 

  const handleLogout = () => {
    // Elimina el token del localStorage u otro almacenamiento
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('dni');
    
    // Redirige al usuario a la página de inicio de sesión o a la página principal
    navigate('/home');
  };


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <div>
            <a href="/home"><img src={logo} alt="medcenter" onClick={()=>navigate("/home")} /></a>
         </div>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          </Typography>
          {userEmail ? (
            //CLIENT
            // Si hay un token, no mostrar el botón de inicio de sesión
            <div class="dropdown">
              <button class="dropbtn"><img src={person} class="dropdown-icon"alt="icon" />{userEmail}</button>
              <div class="dropdown-content">
                <a href="/client_data">Perfil</a>
                <a href="/main">Citas</a>
                <a href="/informes">Informes</a>
                <a href="#logged_out" onClick={handleLogout}><img src={cerrarsesionlogo} alt="Cerrarsesion" class="cerrarsesion-logo"/> Cerrar Sesión</a>
              </div>
            </div>
          ) : dni ?(
            //DOCTOR
            // Si no hay un token, mostrar el botón de inicio de sesión
            <div class="dropdown">
            <button class="dropbtn"><img src={person} class="dropdown-icon"alt="icon" />{dni}</button>
            <div class="dropdown-content">
            <a href="/doctor">Citas</a>
            <a href="/informesdoctor">Informes</a>
              <a href="#logged_out" onClick={handleLogout}><img src={cerrarsesionlogo} alt="Cerrarsesion" class="cerrarsesion-logo"/> Cerrar Sesión</a>
            </div>
          </div>
          ):(
            // Si no hay un token, mostrar el botón de inicio de sesión
            <button class="log-btn" classname="but1" color="inherit" onClick={()=>navigate("/login")}><img src={person} class="login-icon"alt="icon" /> Log In</button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
