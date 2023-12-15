import Client from "../components/Client";
import {Navigate } from 'react-router-dom';

const Register = () => {
    const tokenPage = localStorage.getItem('token');




    return(
        <div className ="register-form">
            {tokenPage ? (
            // Si hay un token, no mostrar el botón de inicio de sesión
            <Navigate to="/home" />
          ) : (
            <Client/>
          )}
        </div>

    )
}

export default Register