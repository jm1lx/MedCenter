import './Main.css'
import Appbar from '../components/Appbar.js'

import {useState,useEffect} from 'react';
import { addDays,isAfter,format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import emailjs from "@emailjs/browser";







const Main = () => {
    const userEmail = localStorage.getItem('userEmail');
    const [userData, setUserData] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [aseguradoras, setAseguradoras] = useState([]);
    const [doctores,setDoctores] = useState([]);
    const [aseguradoraSeleccionada,setAseguradoraSeleccionada] = useState('');
    const [doctorSeleccionado, setDoctorSeleccionado] = useState('');
    const [mostrarHoras, setMostrarHoras] = useState(false); 
    const [horasDisponibles, setHorasDisponibles] = useState([]);
    const [horaSeleccionada, setHoraSeleccionada] = useState('');
    const [citaAgregada, setCitaAgregada] = useState(false);
    // Añade esto junto a tus otros estados
    const [hayHorasDisponibles, setHayHorasDisponibles] = useState(true);
    const [loading, setLoading] = useState(false);
    const [fechaSeleccionada,setFechaSeleccionada] = useState('');
    const [fechas, setFechas] = useState([]);
    

    
    useEffect(() => emailjs.init("wNqUAOj5QSgR5kPA5"), []);

 


    useEffect(() => {
      // Realiza la solicitud para obtener las especialidades al montar el componente
      fetch("http://localhost:8080/especialidad/getAll")
        .then(res => res.json())
        .then(result => {
          setEspecialidades(result);
        });


  
      // Realiza la solicitud para obtener las aseguradoras al montar el componente
      fetch("http://localhost:8080/aseguradora/getAll")
        .then(res => res.json())
        .then(result => {
          setAseguradoras(result);
        });


    }, []); // El segundo argumento [] asegura que se ejecute solo al montar el componente
  
    function mostrarSeleccion() {
      var seleccionEspecialidadDiv = document.getElementById('seleccionEspecialidad');
      var seleccionAseguradoraDiv = document.getElementById('seleccionAseguradora');
      var seleccionDoctorDiv = document.getElementById('seleccionDoctor');
      var seleccionHorasDiv = document.getElementById('seleccionHoras');
      var seleccionFechaDiv = document.getElementById('seleccionFecha');
    
      // Verifica si los elementos existen antes de intentar establecer innerHTML
      if (seleccionAseguradoraDiv) {
        seleccionAseguradoraDiv.innerHTML = '';
      }
      if (seleccionDoctorDiv) {
        seleccionDoctorDiv.innerHTML = '';
      }
      if (seleccionFechaDiv) {
        seleccionFechaDiv.innerHTML = '';
      }
      if (seleccionHorasDiv) {
        seleccionHorasDiv.innerHTML = '';
      }
    
      var selectEspecialidad = document.createElement('select');
      selectEspecialidad.id = 'selectEspecialidad';
    
      var opcionDefault = document.createElement('option');
      opcionDefault.value = '';
      opcionDefault.text = 'Selecciona una:';
      selectEspecialidad.add(opcionDefault);
    
      especialidades.forEach((especialidad, index) => {
        var opcion = document.createElement('option');
        opcion.value = especialidad.id;
        opcion.text = especialidad.especialidad;
        selectEspecialidad.add(opcion);
      });
    
      selectEspecialidad.addEventListener('change', function () {
        if (this.value) {
          var seleccionFechaDiv = document.getElementById('seleccionFecha');
          if (seleccionFechaDiv && seleccionFechaDiv.style.display !== 'none') {
            seleccionFechaDiv.style.display = 'none';
          }
          // Oculta el select de doctores si está visible
          var seleccionDoctorDiv = document.getElementById('seleccionDoctor');
          if (seleccionDoctorDiv && seleccionDoctorDiv.style.display !== 'none') {
            seleccionDoctorDiv.style.display = 'none';
          }


          mostrarAseguradoras(this.value);
          opcionDefault.hidden = true;
        } else {
          opcionDefault.hidden = false;
        }
  });

  // Verifica si el elemento existe antes de intentar establecer innerHTML
  if (seleccionEspecialidadDiv) {
    // Mostrar la selección de especialidad
    seleccionEspecialidadDiv.innerHTML = '';
    seleccionEspecialidadDiv.appendChild(document.createElement('label')).innerText = 'Selecciona Especialidad:';
    seleccionEspecialidadDiv.appendChild(selectEspecialidad);
  }
}
  
    function mostrarAseguradoras(especialidadSeleccionada) {
      // Limpia los divs de selección
  // ... (resto del código para limpiar)
  console.log("Especialidad: ",especialidadSeleccionada)  
  setAseguradoraSeleccionada('');
  setDoctorSeleccionado('');
  setFechaSeleccionada('');
  setMostrarHoras(false);
  setCitaAgregada(false);

  var selectAseguradora = document.createElement('select');
  selectAseguradora.id = 'selectAseguradora';

  var opcionDefault = document.createElement('option');
  opcionDefault.value = '';
  opcionDefault.text = 'Selecciona una:';
  selectAseguradora.add(opcionDefault);

  aseguradoras.forEach((aseguradora, index) => {
    var opcion = document.createElement('option');
    opcion.value = aseguradora.id;
    opcion.text = aseguradora.aseguradora;
    selectAseguradora.add(opcion);
  });

  selectAseguradora.addEventListener('change', function () {
    if (this.value) {
      setAseguradoraSeleccionada(this.value);
      setDoctorSeleccionado('');
      setMostrarHoras(false);
      setCitaAgregada(false);
      var seleccionFechaDiv = document.getElementById('seleccionFecha');
      if (seleccionFechaDiv && seleccionFechaDiv.style.display !== 'block') {
        seleccionFechaDiv.style.display = 'block';
      }
      
      
      mostrarFechas(especialidadSeleccionada, this.value);
      opcionDefault.hidden = true;
    } else {
      
      opcionDefault.hidden = false;
    }
  });

  var seleccionAseguradoraDiv = document.getElementById('seleccionAseguradora');
  seleccionAseguradoraDiv.innerHTML = '';
  seleccionAseguradoraDiv.appendChild(document.createElement('label')).innerText = 'Selecciona Aseguradora:';
  seleccionAseguradoraDiv.appendChild(selectAseguradora);
    }
    const obtenerFechasSiguientes = () => {
      const timeZone = 'Europe/Madrid';
      const currentDateUTC = new Date();
      const currentDateMadrid = utcToZonedTime(currentDateUTC, timeZone);
    
      const fechas = Array.from({ length: 10 }, (_, index) => {
        const fecha = addDays(currentDateMadrid, index);
        return format(fecha, 'yyyy-MM-dd');
      });
    
      return fechas;
    };
 
    function mostrarFechas(especialidadSeleccionada,aseguradoraSeleccionada) {
      // Limpia los divs de selección
  // ... (resto del código para limpiar)
  setFechaSeleccionada('');
  setDoctorSeleccionado('');
  setMostrarHoras(false);
  setCitaAgregada(false);

  var selectFecha = document.createElement('select');
  selectFecha.id = 'selectFecha';

  var opcionDefault = document.createElement('option');
  opcionDefault.value = '';
  opcionDefault.text = 'Selecciona una:';
  selectFecha.add(opcionDefault);
  const fechas=obtenerFechasSiguientes();

  fechas.forEach((fecha, index) => {
    var opcion = document.createElement('option');
    opcion.value = fecha; // Puedes usar el índice como valor o cambiarlo según tus necesidades
    opcion.text = fecha;
    selectFecha.add(opcion);
  });

  selectFecha.addEventListener('change', function () {
    if (this.value) {
      var seleccionDoctorDiv = document.getElementById('seleccionDoctor');
      if (seleccionDoctorDiv && seleccionDoctorDiv.style.display !== 'none') {
        seleccionDoctorDiv.style.display = 'none';
      }
      setFechaSeleccionada(this.value);
      setDoctorSeleccionado('');
      setMostrarHoras(false);
      setCitaAgregada(false);
      
      
      mostrarDoctores(especialidadSeleccionada, aseguradoraSeleccionada,this.value);
      opcionDefault.hidden = true;
    } else {
      
      opcionDefault.hidden = false;
    }
  });

  var seleccionFechaDiv = document.getElementById('seleccionFecha');
  seleccionFechaDiv.innerHTML = '';
  seleccionFechaDiv.appendChild(document.createElement('label')).innerText = 'Selecciona Fecha:';
  seleccionFechaDiv.appendChild(selectFecha);
    }




    
    function mostrarDoctores(especialidadSeleccionada, aseguradoraSeleccionada,fechaSeleccionada) {
      console.log("Aseguradora: ", aseguradoraSeleccionada);
      var seleccionDoctorDiv = document.getElementById('seleccionDoctor');
      if (seleccionDoctorDiv.style.display !== 'none') {
        seleccionDoctorDiv.style.display = 'none';
      }
     
      setHorasDisponibles([]);
      setHoraSeleccionada('');
      setCitaAgregada(false);
      setMostrarHoras(false);
      setHayHorasDisponibles(true);
    
      fetch(`http://localhost:8080/doctor/byEspecialidadAndAseguradora/${especialidadSeleccionada}/${aseguradoraSeleccionada}`)
        .then(res => res.json())
        .then(result => {
          setDoctores(result);
    
          var selectDoctor = document.createElement('select');
          selectDoctor.id = 'selectDoctor';
    
          var opcionDefault = document.createElement('option');
          opcionDefault.value = '';
          opcionDefault.text = 'Selecciona uno:';
          selectDoctor.add(opcionDefault);
    
          result.forEach((doctor, index) => {
            var opcion = document.createElement('option');
            opcion.value = doctor.dni;
            opcion.text = `${doctor.name} ${doctor.surname}`;
            selectDoctor.add(opcion);
          });
    
          var seleccionDoctorDiv = document.getElementById('seleccionDoctor');
          if (seleccionDoctorDiv) {
            seleccionDoctorDiv.style.display = 'block';
            seleccionDoctorDiv.innerHTML = '';
            seleccionDoctorDiv.appendChild(document.createElement('label')).innerText = 'Selecciona Doctor:';
            seleccionDoctorDiv.appendChild(selectDoctor);
            opcionDefault.hidden = true;
          }
    
          selectDoctor.addEventListener('change', function () {
            const selectedDoctorId = this.value;
            setHoraSeleccionada('');
            setCitaAgregada(false);
            setDoctorSeleccionado(selectedDoctorId);
    
            if (selectedDoctorId) {
              // Fetch available hours for the selected doctor
              fetchAvailableHours(selectedDoctorId,fechaSeleccionada);
            } else {
              setMostrarHoras(false);
              setHoraSeleccionada('');
              setHayHorasDisponibles(false);
            }
          });
        })
        .catch(error => {
          console.error('Error fetching doctors:', error);
          setHayHorasDisponibles(false);
        });
    }
    


    async function agregarCita() {
      try {
        // Comprobar que todos los datos necesarios estén seleccionados
        if (!userEmail || !doctorSeleccionado || !horaSeleccionada) {
          console.error('Faltan datos necesarios para agregar la cita');
          return;
        }
    
        // Obtener la información del doctor
        const doctorResponse = await fetch(`http://localhost:8080/doctor/dni/${doctorSeleccionado}`);
        const doctorInfo = await doctorResponse.json();
    
        // Obtener la información del cliente
        const clientResponse = await fetch(`http://localhost:8080/client/mail/${userEmail}`);
        const clientInfo = await clientResponse.json();
    
        // Obtener la fecha y hora actual en UTC
        const currentDateUTC = new Date();
    
        // Convertir la fecha y hora actual a la zona horaria de Madrid
        const timeZone = 'Europe/Madrid';
        const currentDateMadrid = utcToZonedTime(currentDateUTC, timeZone);
    
        // Formatear la fecha actual para enviarla al servidor
        const currentDateISO = format(currentDateMadrid, 'yyyy-MM-dd');
    
        // Formatear la fecha y hora seleccionadas para compararlas con la actual
        const selectedDateTimeFormatted = new Date(`${currentDateISO}T${horaSeleccionada}`);
    
        // Validar que la fecha y hora seleccionadas sean posteriores a la fecha y hora actual
        if (isAfter(selectedDateTimeFormatted, currentDateMadrid)) {
          // Objeto con los datos de la cita
          const nuevaCita = {
            client: { dni: clientInfo.dni },
            doctor: { registrationNumber: doctorInfo.registrationNumber },
            fecha: fechaSeleccionada,
            hora: horaSeleccionada,
          };
    
          // Realizar la solicitud POST a la API
          const response = await fetch('http://localhost:8080/citas/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevaCita),
          });
    
          if (!response.ok) {
            throw new Error(`Error al agregar la cita: ${response.statusText}`);
          }else{
            enviarCorreo(userEmail,clientInfo,doctorInfo,currentDateISO,horaSeleccionada,fechaSeleccionada)
            console.log("enviarCorreo")
          }


          const data = await response.text();
          console.log('Cita agregada correctamente:', data);
          
          /*window.location.reload();*/
          // Actualizar el estado u realizar otras acciones si es necesario
          setCitaAgregada(true);
        } else {
          console.error('La fecha y hora seleccionadas no son válidas. Deben ser posteriores a la fecha y hora actual.');
        }
      } catch (error) {
        console.error('Error al agregar la cita:', error);
        // Manejar errores según tu flujo de la aplicación
      }
    }
    
    
    const enviarCorreo = async (userEmail,clientInfo,doctorInfo,currentDateISO,horaSeleccionada,fechaSeleccionada) => {
      const serviceId = "service_ydzyz69";
      const templateId = "template_1a3njoa";
      try {
        setLoading(true);
        await emailjs.send(serviceId, templateId, {
          to_email: userEmail,
          name: clientInfo.name,
          surname: clientInfo.surname,
          fecha: fechaSeleccionada,
          hora:horaSeleccionada,
          docname:doctorInfo.name,
          docsurname:doctorInfo.surname,
          docespe:doctorInfo.especialidad.especialidad,
          docase:doctorInfo.aseguradora.aseguradora,
        });
        window.location.reload()
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    
    

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
    }, [userEmail]);



    function fetchAvailableHours(selectedDoctorId, fechaSeleccionada) {
      
      const currentDateUTC = new Date();

      // Convertir la fecha y hora actual a la zona horaria de Madrid
      const timeZone = 'Europe/Madrid';
      const currentDateMadrid = utcToZonedTime(currentDateUTC, timeZone);
    
      // Formatear la fecha y hora seleccionada para enviarla al servidor
      const formattedDate = format(new Date(fechaSeleccionada), 'yyyy-MM-dd');
    
      fetch(`http://localhost:8080/doctor/horasDisponibles/${selectedDoctorId}/${formattedDate}`)
        .then(res => res.json())
        .then(horas => {
          // Obtener la hora actual en Madrid
          const currentHourInMadrid = format(currentDateMadrid, 'HH:mm:ss');
    
          // Filtrar las horas disponibles según la lógica deseada
          const horasPosteriores = fechaSeleccionada === format(currentDateMadrid, 'yyyy-MM-dd')
            ? horas.filter((hora) => hora >= currentHourInMadrid)
            : horas;
    
          setHorasDisponibles(horasPosteriores);
          setMostrarHoras(horasPosteriores.length > 0);
          setHayHorasDisponibles(horasPosteriores.length > 0);
        })
        .catch(error => {
          console.error('Error fetching available hours:', error);
        });
    }
    
    const deleteCita = async (id) => {
      try {
          // Realizar la solicitud DELETE a la API para eliminar la cita por su ID
          const response = await fetch(`http://localhost:8080/citas/delete/${id}`, {
              method: 'DELETE',
          });
  
          if (!response.ok) {
              throw new Error(`Error al eliminar la cita: ${response.statusText}`);
          }
  
          console.log('Cita eliminada correctamente');
          window.location.reload()
          // Actualizar el estado o realizar otras acciones si es necesario
          // Por ejemplo, volver a cargar las citas
      } catch (error) {
          console.error('Error al eliminar la cita:', error);
          // Manejar errores según tu flujo de la aplicación
      }
  };

  const confirmDelete = (id) => {
    const confirmacion = window.confirm('¿Seguro que quieres eliminar esta cita?');

    if (confirmacion) {
      // Si se confirma, establecer el ID de la cita que se va a eliminar y llamar a la función eliminarCita
      deleteCita(id);
    }
  };


  

  
    return(
      
      <div>
      <Appbar />
      <div className="mainpage-container">
      <div className="mainfilters-section">
        <button class="consulta-btn"onClick={mostrarSeleccion}>Pedir Cita</button>
        <br/>
        <br/>
        <div id="seleccionEspecialidad"></div>
        <br/>
        <div id="seleccionAseguradora"></div>
        <br/>
        <div id="seleccionFecha"></div>
        <br/>
        <div id="seleccionDoctor"></div>
        {!hayHorasDisponibles &&(<p><b>NO</b> hay mas horas disponibles.<br/>Vuelva a las <b>00:00</b> para pedir cita.</p>)}
        {mostrarHoras && (
            <>
              <br />
              <div id="seleccionHoras">
                <label>Selecciona una hora:</label>
                <select
                  value={horaSeleccionada}
                  onChange={(e) => setHoraSeleccionada(e.target.value)}
                >
                  <option value="" disabled>
                    Selecciona una hora
                  </option>
                  {horasDisponibles.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
                {horaSeleccionada && (
  <>
    <br/>
    <button className="consulta-btn" onClick={agregarCita} disabled={citaAgregada}>
      Añadir Cita
    </button>
  </>
)}
               
              </div>
            </>
          )}

        </div>


        {/* Sección derecha para ver citas */}
        <div className="mainappointments-section">
          <main class="mainpage-page">
            <h1>Citas Programadas: {userData && userData.name} {userData && userData.surname} {userData && userData.dni}</h1>
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
                  <th>Anular</th>
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
                      <td>
                {/* Agrega el botón de eliminación y llama a la función deleteCita con el id de la cita */}
                <button class="deletebtn" onClick={() => confirmDelete(appointment.id)}><b>Anular Cita</b></button>
            </td>
                      {/* Otras celdas de citas */}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
export default Main