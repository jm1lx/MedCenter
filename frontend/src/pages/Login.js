import doctor from '../images/logindoctor.jpg'
import './Login.css'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {useState} from 'react';
import logo from '../images/medcenter.png'
import {Navigate } from 'react-router-dom';


const Login = () => {
  const tokenPage = localStorage.getItem('token');
  const location = useLocation();
  const navigate = useNavigate();
  const cameFromRegister = location.state && location.state.fromRegister;

  const handleLoginNavigation = () => {
    navigate('/home', { state: { fromLogin: true } });
  };

  const[mail,setMail]=useState('')
  const[password,setPassword]=useState('')
  const[mailNotCorrect, setMailNotCorrect] = useState(false);
  const[pwdNotCorrect, setPwdNotCorrect] = useState(false);
  const[notCorrect,setNotCorrect] = useState(false);

  const limpiarErrores = (value) => {
    setMailNotCorrect(false);
    setPwdNotCorrect(false);
    setNotCorrect(false);
  };


  const handleClick=async (e)=>{
    e.preventDefault()
    limpiarErrores()

    try {
      const response = await fetch("http://localhost:8080/client/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mail, password }),
      });
  
      console.log("Status de la respuesta:", response.status);
  
      if (response.ok) {
        const {token} = await response.json();
        localStorage.setItem('token',token);
        localStorage.setItem('userEmail',mail);
        console.log("Usuario autenticado con éxito");
        handleLoginNavigation()
      } else {
        // Maneja el error solo si la respuesta es un JSON válido
        try {
          const responseData = await response.json();
          console.error("Error al autenticar el usuario:", responseData.error);
          setMailNotCorrect(true);
          setPwdNotCorrect(true);
          setNotCorrect(true);
        } catch (jsonError) {
          console.error("Error al parsear la respuesta JSON", jsonError);
        }
      }
    } catch (error) {
      console.error("Error de red al autenticar el usuario", error);
    }
 }


  
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
                <div>
                  {cameFromRegister && <p>You have successfully registred.</p>}
                </div>
                <h2 class="login-h2">Log In</h2>
                <form>
                  <div class="login-input-group">
                    <label class="login-label"for="mail">E-Mail:</label>
                    <input class="login-type-text" type="mail" value={mail} onChange={(e)=>setMail(e.target.value)} style={{ borderColor: mailNotCorrect ? 'red' : '' }}/>
                  </div>
                  <div class="login-input-group">
                    <label class="login-label"for="password">Password:</label>
                    <input class="login-type-pass" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} style={{ borderColor: pwdNotCorrect ? 'red' : '' }} />
                    {notCorrect && <p class="err"style={{ color: 'red' }}>Los datos introducidos no coinciden.</p>}
                  </div>
        
                  <div class="login-input-group">
                    <button class="login-btn" type="btn" onClick={handleClick}>Log In</button>
                  </div><br/>
                  <div class="login-reg">
                  <label>Don't have an account? </label><a href="/register">Register</a><br/>
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

export default Login