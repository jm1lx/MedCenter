import './Informes.css'
import Appbar from '../components/Appbar.js'
import {useState,useEffect} from 'react';
import { isAfter } from 'date-fns';
import jsPDF from 'jspdf';
import medcenterimg from '../images/medcenter.png'


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

      function renderizarInformeVisita(appointment) {
        if (appointment.informe === null) {
          return <span>Informe no disponible.</span>;
        }
    
        // Aquí podrías tener el código para generar el PDF
        return (
          <button class="btn-informe" onClick={() => generarPDF(appointment.id)}>
            Descargar Informe
          </button>
        );
      }
    
      const generarPDF = (appointmentId) => {
        const citaSeleccionada = appointments.find((appointment) => appointment.id === appointmentId);
      
        if (!citaSeleccionada) {
          console.error(`No se encontró ninguna cita con el ID ${appointmentId}`);
          return;
        }
      
        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: 'letter',
        });
      
     
        pdf.setFontSize(20);
        pdf.setFont('normal','bold')
        pdf.text(`INFORME DE CONSULTA EN MEDCENTER`, 40, 20);
        pdf.setFontSize(14);
        pdf.setFont('normal','normal');
        pdf.text(`Identificador #${citaSeleccionada.id}`, 20, 40);
        pdf.text(`_________________________________________________________________`, 20, 50);
        pdf.setFont('normal','bold')
        pdf.text(`DATOS DE LA CONSULTA`, 20, 60);
        pdf.setFont('normal','normal');
        pdf.text('', 20, 70);
        pdf.text(`Fecha de la consulta: ${citaSeleccionada.fecha} ${citaSeleccionada.hora}`, 20, 80);
        pdf.text(`Doctor: ${citaSeleccionada.doctor.name} ${citaSeleccionada.doctor.surname}`, 20, 90);
        pdf.text(`Consulta sobre la Especialidad: ${citaSeleccionada.doctor.especialidad.especialidad}`, 20, 100);
        pdf.text(`Aseguradora Asociada: ${citaSeleccionada.doctor.aseguradora.aseguradora}`, 20, 110);
        pdf.text(`Motivo de la Consulta: ${citaSeleccionada.motivo}`, 20, 120);
        
        // Salto de línea antes de "Informe de la visita"
        pdf.text(`_________________________________________________________________`, 20, 130);
        
        // Cambia el tamaño de la fuente para el informe
        pdf.setFont('normal','bold');
        pdf.text(`Informe de la visita:`, 20, 140);
        pdf.setFont('normal','normal');
        pdf.text(`${citaSeleccionada.informe.replace(/\\n/g, '\n').replace(/"/g, '')}`, 20, 150);

        pdf.setFontSize(10);
        pdf.text(`Le agradecemos su visita a MedCenter. En caso de duda, no dude en contactar con Nosotros. 2023 MedCenter`, 20, 260);

        const imageSrc = medcenterimg;  // Ruta de tu imagen
        pdf.addImage(imageSrc, 'PNG', 5, 12.5, 30,10);
      
        const nombreArchivo = `Informe_MedCenter_${citaSeleccionada.client.dni}_${citaSeleccionada.id}.pdf`;
        pdf.save(nombreArchivo);
      
        console.log(`PDF generado y guardado como ${nombreArchivo}`);
      };

  
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
                  <th>Motivo de la Consulta</th>
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
                      <td><textarea class="input-motivo" disabled>{appointment.motivo}</textarea></td>
                      <td>{renderizarEstadoCita(appointment)}</td>
                      <td>{renderizarInformeVisita(appointment)}</td>
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