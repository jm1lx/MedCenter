import './Doctor.css'
import Appbar from '../components/Appbar.js'
import {useState,useEffect} from 'react';



const Doctor = () => {
    const dni = localStorage.getItem('dni');

    const [doctorData, setDoctorData] = useState(null);
    const [appointments, setAppointments] = useState([]);


    useEffect(() => {
      // Obtener el número de registro del cliente usando el mail
      fetch(`http://localhost:8080/doctor/dni/${dni}`)
        .then((response) => response.json())
        .then((data) => {
          setDoctorData(data);
          // Obtener las citas del cliente usando el dni
          return fetch(`http://localhost:8080/citas/doctor/${data.registrationNumber}`);
        })
        .then((response) => response.json())
        .then((appointmentsData) => {
          const currentDate = new Date();
      
          // Filtrar solo las citas futuras
          const futureAppointments = appointmentsData.filter((appointment) => {
            const fechaHoraCita = new Date(`${appointment.fecha}T${appointment.hora}`);
            return fechaHoraCita >= currentDate;
          });
    
          // Ordenar las citas futuras por fecha y hora
          const sortedFutureAppointments = futureAppointments.sort((a, b) => {
            const fechaHoraA = new Date(`${a.fecha}T${a.hora}`);
            const fechaHoraB = new Date(`${b.fecha}T${b.hora}`);
            return fechaHoraA - fechaHoraB;
          });
    
          // Establecer las citas futuras ordenadas en el estado
          setAppointments(sortedFutureAppointments);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }, [dni]);
  

    return(
      <div>
      <Appbar />
      <body className="doctormain-page">
            <h2>Proximas Consultas</h2>
            {appointments.length === 0 ? (
              <p>No tienes pacientes programados.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Paciente</th>
                    <th>DNI</th>
                    <th>Motivo de la Consulta</th>
                    {/* Otras columnas de citas */}
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.id}</td>
                      <td>{appointment.fecha}</td>
                      <td>{appointment.hora}</td>
                      <td>{appointment.client.name} {appointment.client.surname}</td>
                      <td>{appointment.client.dni}</td>
                      <td><textarea class="input-motivo" disabled>{appointment.motivo}</textarea></td>
                      {/* Otras celdas de citas */}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
      </body>
    </div>
  );
};

export default Doctor