import './Main.css'
import Appbar from '../components/Appbar.js'
import React, { useEffect } from 'react';




const Refresh = () => {
    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        const dni = localStorage.getItem('dni');
    
        // Realiza el refresh de la página
        window.location.reload();
    
        // Redirige según la existencia del dni en el localStorage
        if (dni) {
          window.location.href = '/home'; // Redirige a /main si hay un dni
        } else {
          window.location.href = '/home'; // Redirige a /doctor si no hay un dni
        }
      }, []);

    return(
      <div>
        <Appbar/>
  </div>
    )
}

export default Refresh