import Appbar from '../components/Appbar.js'
import React, { useState, useEffect } from 'react';
import './ReadClient.css';

const EditClient = () => {
  const userEmail = localStorage.getItem('userEmail');
  const [client, setClient] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/client/mail/${userEmail}`);
        if (response.ok) {
          const data = await response.json();
          setClient(data);
        } else {
          console.error('Error al obtener el cliente');
        }
      } catch (error) {
        console.error('Error de red al obtener el cliente', error);
      }
    };

    fetchData();
  }, [userEmail]);




 

  return (
    <div>
      <Appbar />
      <div className="client-list-container">
        <div className="client-box">
          <h2>Información del Cliente</h2>
          {client && 
            <div>
                <table className="client-table">
                  <tbody>
                    <tr>
                      <td className="label">Nombre :</td>
                      <td>{client.name}</td>
                    </tr>
                    <tr>
                      <td className="label">Apellido :</td>
                      <td>{client.surname}</td>
                    </tr>
                    <tr>
                      <td className="label">E-Mail :</td>
                      <td>{client.mail}</td>
                    </tr>
                    <tr>
                      <td className="label">DNI :</td>
                      <td>{client.dni}</td>
                    </tr>
                  </tbody>
                </table>
                </div>
              }
            </div>
        </div>
      </div>
    
  );
};

export default EditClient;
