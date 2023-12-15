import './Informes.css'
import Appbar from '../components/Appbar.js'
import {useState,useEffect} from 'react';
import { isAfter } from 'date-fns';


const Informes = () => {
    const userEmail = localStorage.getItem('userEmail');
    const [userData, setUserData] = useState(null);
    const [appointments, setAppointments] = useState([]);


    useEffect(() => {
      // Obtener el número de registro del cliente usando el mail
      fetch(`http://localhost:8080/client/mail/${userEmail}`)
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
          // Obtener las citas del cliente usando el dni
          return fetch(`http://localhost:8080/citas/client/${data.dni}`);
        })
        .then((response) => response.json())
        .then((appointmentsData) => {
           // Separar las citas en dos listas: futuras y pasadas
        const currentDate = new Date();
        const futureAppointments = [];
        const pastAppointments = [];

        appointmentsData.forEach((appointment) => {
          const fechaHoraCita = new Date(`${appointment.fecha}T${appointment.hora}`);
          if (fechaHoraCita >= currentDate) {
            futureAppointments.push(appointment);
          } else {
            pastAppointments.push(appointment);
          }
        });

        // Ordenar las citas futuras por fecha y hora
        const sortedFutureAppointments = futureAppointments.sort((a, b) => {
          const fechaHoraA = new Date(`${a.fecha}T${a.hora}`);
          const fechaHoraB = new Date(`${b.fecha}T${b.hora}`);
          return fechaHoraA - fechaHoraB;
        });

        // Ordenar las citas pasadas por fecha y hora en orden descendente
        const sortedPastAppointments = pastAppointments.sort((a, b) => {
          const fechaHoraA = new Date(`${a.fecha}T${a.hora}`);
          const fechaHoraB = new Date(`${b.fecha}T${b.hora}`);
          return fechaHoraB - fechaHoraA;
        });

        // Concatenar las listas para mostrar primero las futuras y luego las pasadas
        const allAppointments = [...sortedFutureAppointments, ...sortedPastAppointments];

        setAppointments(allAppointments);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [userEmail]);


    function renderizarEstadoCita(cita) {
        const fechaHoraCita = new Date(`${cita.fecha}T${cita.hora}`);
        const fechaHoraActual = new Date();
      
        // Verificar si la cita es anterior a la fecha actual
        if (isAfter(fechaHoraActual, fechaHoraCita)) {
          return <span style={{ color: 'green' }}>✅ Realizada</span>; // Mostrar tick verde
        }
      
        // Verificar si la hora de la cita es posterior a la hora actual
        if (isAfter(fechaHoraCita, fechaHoraActual)) {
          return <span style={{ color: 'orange' }}>🕛 Pendiente</span>; // Mostrar tick rojo
        }
      
        return null; // En otros casos, no mostrar ningún tick
      }


  
    return(
      <div>
      <Appbar />
          <main class="informesmain-page">
            <br/>
            <h2>Todas las citas: {userData && userData.name} {userData && userData.surname} {userData && userData.dni}</h2>
            {appointments.length === 0 ? (
              <p>No tienes citas programadas.</p>
            ) : (
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Doctor</th>
                  <th>Especialidad</th>
                  <th>Aseguradora</th>
                  <th>Estado de la Cita</th>
                  <th>Informe de Visita</th>
                  {/* Otras columnas de citas */}
                </tr>
              </thead>
              <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.fecha}</td>
                      <td>{appointment.hora}</td>
                      <td>{appointment.doctor.name} {appointment.doctor.surname}</td>
                      <td>{appointment.doctor.especialidad.especialidad}</td>
                      <td>{appointment.doctor.aseguradora.aseguradora}</td>
                      <td>{renderizarEstadoCita(appointment)}</td>
                      <td>"Archivo"</td>
                      {/* Otras celdas de citas */}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </main>
        </div>
    
  );
}
export default Informes