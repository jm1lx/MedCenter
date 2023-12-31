import './InformesDoctor.css'
import Appbar from '../components/Appbar.js'
import {useState,useEffect} from 'react';
import { isAfter} from 'date-fns';



const InformesDoctor = () => {
    const dni = localStorage.getItem('dni');
    const [doctorData, setDoctorData] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [informeInput, setInformeInput] = useState('');
    const [editMode, setEditMode] = useState(false); 
    const [editModeMap, setEditModeMap] = useState({}); // Para rastrear el modo de edición por cita
  const [informeInputMap, setInformeInputMap] = useState({}); // Para rastrear el informe por cita


  


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
  }, [dni]);


    function renderizarEstadoCita(cita) {
        const fechaHoraCita = new Date(`${cita.fecha}T${cita.hora}`);
        const fechaHoraActual = new Date();

        return (
          <td>
            {isAfter(fechaHoraActual, fechaHoraCita) ? (
              <span style={{ color: 'green' }}>✅ Realizada</span>
            ) : (
              <span style={{ color: 'orange' }}>🕛 Pendiente</span>
              
            )}
          </td>
        );
      };
    
      function renderizarInformeVisita(cita) {
        const id = cita.id;
      
    
        return (
          <td key={id}>
            {isAfter(new Date(), new Date(`${cita.fecha}T${cita.hora}`)) ? (
              <>
                {editModeMap[id] ? (
                  <>
                    <textarea
                      type="text"
                      value={informeInputMap[id] || ''}
                      onChange={(e) => handleInformeInputChange(e, id)}
                      placeholder="Introduzca mensaje visita"
                      className="input-informe"
                    /><br/>
                    <button className="btn-informedoc" onClick={() => handleInformeSubmit(id)}>
                      Guardar Informe
                    </button>
                  </>
                ) : (
                  <>
                    {cita.informe ? (
                      <>
                        <textarea class="input-informe" disabled>{cita.informe.replace(/\\n/g, '\n').replace(/"/g, '')}</textarea><br/>
                        <button className="btn-informedoc" onClick={() => handleEditButtonClick(id)}>
                          Editar Informe
                        </button>
                      </>
                    ) : (
                      <button className="btn-informedoc" onClick={() => handleEditButtonClick(id)}>
                        Agregar Informe
                      </button>
                    )}
                  </>
                )}
              </>
            ) : (
              <span>La visita aún no se ha realizado.</span>
            )}
          </td>
        );
      }
    
      const handleInformeInputChange = (e, id) => {
        // Actualizar el valor del informe para la cita específica
        setInformeInputMap((prevMap) => ({
          ...prevMap,
          [id]: e.target.value,
        }));
      };
    
      const handleInformeSubmit = (id) => {
        // Enviar el informe al servidor y actualizar el estado local
        fetch(`http://localhost:8080/citas/update-informe/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(informeInputMap[id]),
        })
          .then((response) => {
            if (response.ok) {
              console.log('Informe enviado exitosamente');
              setEditModeMap((prevMap) => ({
                ...prevMap,
                [id]: false, // Salir del modo de edición al guardar el informe
              }));
              window.location.reload()
              // Puedes querer actualizar el estado local aquí también
            } else {
              console.error('Error al enviar el informe');
            }
          })
          .catch((error) => {
            console.error('Error de red:', error);
          });
      };
    
      const handleEditButtonClick = (id) => {
        // Activar el modo de edición para la cita específica
        setEditModeMap((prevMap) => ({
          ...prevMap,
          [id]: true,
        }));
      };
    return(
      <div>
      <Appbar />
          <main class="docmain-page">
            <br/>
            <h2>Todas las citas: {doctorData && doctorData.name} {doctorData && doctorData.surname} {doctorData && doctorData.dni}</h2>
            {appointments.length === 0 ? (
              <p>No tienes citas programadas.</p>
            ) : (
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Paciente</th>
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
                      <td>{appointment.client.name} {appointment.client.surname}</td>
                      <td>{appointment.doctor.especialidad.especialidad}</td>
                      <td>{appointment.doctor.aseguradora.aseguradora}</td>
                      {renderizarEstadoCita(appointment)}
                      {renderizarInformeVisita(appointment)}
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
export default InformesDoctor