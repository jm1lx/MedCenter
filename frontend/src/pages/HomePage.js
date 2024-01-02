import Appbar from '../components/Appbar'
import './HomePage.css'
import cita from '../images/logo.jpg'
import doctor from '../images/doctor.png'
import gmail from '../images/gmail-logo.png'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {useState,useEffect} from 'react';
import { Navigate } from "react-router-dom";



function Home(){
    const navigate=useNavigate();
    const location = useLocation();
    const cameFromLogin = location.state && location.state.fromLogin;
    const cameFromLoginDoctor = location.state && location.state.fromLoginDoctor;
    const userEmail = localStorage.getItem('userEmail'); // Obtén el userEmail almacenado en localStorage
    const dniPage = localStorage.getItem('dni');
    const [doctorData, setDoctorData] = useState(null);

    useEffect(() => {
        // Obtener el número de registro del médico usando el DNI
        fetch(`http://localhost:8080/doctor/dni/${dniPage}`)
          .then((response) => response.json())
          .then((data) => {
            setDoctorData(data);
            // Obtener las citas del médico usando el número de registro
          })
          .then((response) => response.json())
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }, [dniPage]);

    const handleClick = () => {
        // Elimina el token del localStorage u otro almacenamiento
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('dni');
        
        // Redirige al usuario a la página de inicio de sesión o a la página principal
        navigate('/login_doctor');
      };

  return (
    <div className="Home">
        <Appbar/>
        {cameFromLogin && <Navigate to="/refresh"/>}
        {cameFromLoginDoctor && <Navigate to="/refresh"/>}

        <section class="consulta-section">
        {dniPage ? (
            <>
            <div class="consulta-container">
            <img src={doctor} alt="Logo de la Clínica" class="logo"/>
            <h2>Bienvenido {doctorData && doctorData.name} {doctorData && doctorData.surname}</h2>
            <h4>Numero de colegiado: {doctorData && doctorData.registrationNumber}  </h4>
            <h4>DNI: {doctorData && doctorData.dni}</h4>
            <h4>Aseguradora: {doctorData && doctorData.aseguradora.aseguradora}</h4>
            <h4>Especialidad: {doctorData && doctorData.especialidad.especialidad}</h4>
            <p>Para consultar todas sus citas acceda al panel de consultas.</p>
            <button class="consulta-btn" onClick={()=>navigate("/doctor")}>Panel de Consultas</button>
        </div>

            </>
        ) :
        (
            <>
            <div class="consulta-container">
            <img src={cita} alt="Logo de la Clínica" class="logo"/>
            <h2>Programar Consulta Presencial</h2>
            <p>¡Le damos la bienvenida! Por favor, seleccione una fecha y hora para programar su consulta presencial.</p>
            {userEmail ? (
                <>
                <button class="consulta-btn" onClick={()=>navigate("/main")}>Solicitar Consulta</button>
                </>
            ) : (
                <>
                <button class="consulta-btn" onClick={()=>navigate("/login")}>Solicitar Consulta</button>
                </>
            )}
        </div>
        <br/>
        <div class="divisor"></div>
        <div class="consulta-container">
            <p>Si desea hacer una llamada le dejamos el telefono de contacto a continuación.</p>
        </div>
        <br/>
        <br/><br/>
        <br/>
        </>
        )}
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        



        

        </section>
        <footer>
        <div class="footer-container">
            <div class="about-me">
                <h3>Sobre Nosotros</h3>
                <p>Descubre la excelencia en nuestro centro médico, donde profesionales altamente capacitados se dedican a tu bienestar. 
                    Equipados con tecnología de vanguardia, ofrecemos diagnósticos precisos y tratamientos efectivos. 
                    Nuestra atención es personalizada, centrada en tus necesidades individuales, en un ambiente acogedor que prioriza tu tranquilidad. 
                    La conveniencia y accesibilidad son clave, con horarios flexibles y ubicaciones estratégicas para facilitar tu acceso a la atención médica. </p>
                <p>Confía en nosotros para brindarte una experiencia de salud integral de calidad.</p>



            </div>

            <div class="contact-us">
                <h3>Contáctanos</h3>
                <p>¡Estamos aquí para ayudarte! Contáctanos:</p>
                <ul>
                    <li>Email: medcenter@uoc.edu</li>
                    <li>Teléfono: (+34) 123 45 67 89</li>
                    <li>Horario Atención Telefonica: 08:00h - 20:00h</li>
                    {dniPage ? (
                        <>
                        </>
                    ) : (
                    <>
                    <li><a href="#" onClick={handleClick}>Acceso Doctores</a></li>
                    </>
                    )}
                </ul>
                
                <a href="mailto:medcentertfg@gmail.com">
                    <img src={gmail} alt="Gmail" class="gmail-logo"/>
                </a>
                
            </div>

            <div class="location-map">
                <h3>Ubicación</h3>

                <iframe title="Uocmap"src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d889.6759402245108!2d2.193804776453132!3d41.406636857600944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a33d25b76e7f%3A0xf77b18819205bfdc!2sUOC%20Universidad%20Abierta%20de%20Catalu%C3%B1a!5e0!3m2!1ses!2ses!4v1701965634558!5m2!1ses!2ses" width="300" height="200" alt="map" allowfullscreen="" loading="lazy"></iframe>
            </div>
        </div>
        <p>&copy; 2023 MedCenter - Todos los derechos reservados</p>
    </footer>
            
    </div>
    
  );
}

export default Home;
