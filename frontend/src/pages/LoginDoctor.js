import doctor from '../images/logindoctor.jpg'
import './Login.css'
import { useNavigate } from 'react-router-dom';
import {useState} from 'react';
import logo from '../images/medcenter.png'
import {Navigate } from 'react-router-dom';


const LoginDoctor = () => {
    const tokenPage = localStorage.getItem('token');
    const navigate = useNavigate();
  
    const handleLoginNavigation = () => {
      navigate('/home', { state: { fromLoginDoctor: true } });
    };
  
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [dni, setDni] = useState('');
    const [registrationNumberNotCorrect, setRegistrationNumberNotCorrect] = useState(false);
    const [dniNotCorrect, setDniNotCorrect] = useState(false);
    const [notCorrect, setNotCorrect] = useState(false);
  
    const limpiarErrores = () => {
      setRegistrationNumberNotCorrect(false);
      setDniNotCorrect(false);
      setNotCorrect(false);
    };
  
    const handleClick = async (e) => {
      e.preventDefault();
      limpiarErrores();
  
      try {
        const response = await fetch("http://localhost:8080/doctor/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ registrationNumber, dni }),
        });
  
        console.log("Status de la respuesta:", response.status);
  
        if (response.ok) {
          const { token } = await response.json();
          localStorage.setItem('token', token);
          localStorage.setItem('dni',dni);
          console.log("Doctor autenticado con éxito");
          handleLoginNavigation();
        } else {
          // Maneja el error solo si la respuesta es un JSON válido
          try {
            const responseData = await response.json();
            console.error("Error al autenticar el doctor:", responseData.error);
            setRegistrationNumberNotCorrect(true);
            setDniNotCorrect(true);
            setNotCorrect(true);
          } catch (jsonError) {
            console.error("Error al parsear la respuesta JSON", jsonError);
          }
        }
      } catch (error) {
        console.error("Error de red al autenticar el doctor", error);
      }
    };

  
    return(
      <div>
      {tokenPage ? (
          <Navigate to="/home" />
      ) : (
        // Si no hay un token, mostrar el botón de inicio de sesión
        <div>
        <body class="login">
          <div class="login-main-container">
            <div class="login-container">
              <div class="login-image-section">
                <img src={doctor} alt="iamgen"/>
                <div class="login-overlay"></div>
              </div>
              <div class="img_home">
                  <a href="/home"><img class="img_back" src={logo} alt="Logo"/></a>
                
              <div class="login-section">
                <h2 class="login-h2">Inicio Sesión Doctor</h2>
                <form>
                  <div class="login-input-group">
                    <label class="login-label"for="mail">Numero de Registro:</label>
                    <input class="login-type-text" type="mail" value={registrationNumber} onChange={(e)=>setRegistrationNumber(e.target.value)} style={{ borderColor: registrationNumberNotCorrect ? 'red' : '' }}/>
                  </div>
                  <div class="login-input-group">
                    <label class="login-label"for="mail">DNI:</label>
                    <input class="login-type-pass" type="mail" value={dni} onChange={(e)=>setDni(e.target.value)} style={{ borderColor: dniNotCorrect ? 'red' : '' }} />
                    {notCorrect && <p class="err"style={{ color: 'red' }}>Los datos introducidos no coinciden.</p>}
                  </div>
        
                  <div class="login-input-group">
                    <button class="login-btn" type="btn" onClick={handleClick}>Acceder</button>
                  </div><br/>
                </form>
              </div>
            </div>
            </div>
          </div>
          </body>
          </div>
      )}
    </div>
    )
}

export default LoginDoctor