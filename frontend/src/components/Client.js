import * as React from 'react';
import {useEffect,useState} from 'react';
import './Client.css'
import { useNavigate } from 'react-router-dom';
import logo from '../images/medcenter.png'


export default function Client() {
  const navigate = useNavigate();

  const handleLoginNavigation = () => {
    navigate('/login', { state: { fromRegister: true } });
  };

  useEffect(()=>{
    fetch("http://localhost:8080/client/getAll")
    .then(res=>res.json())
    .then((result)=>{
        setClients(result);
    }
    )
},[])


    const[dni,setDni]=useState('')
    const[dniError, setDniError] = useState(false);
    const[dniInDbError, setDniInDbError] = useState(false);
    const[name,setName]=useState('')
    const[nameError, setNameError] = useState(false);
    const[surname,setSurname]=useState('')
    const[surnameError, setSurnameError] = useState(false);
    const[mail,setMail]=useState('')
    const[mailError, setMailError] = useState(false);
    const[emailInDbError, setEmailInDbError] = useState(false);
    const[password,setPassword]=useState('')
    const[confirmPassword,setConfirmPassword]=useState('')
    const[passwordError,setPasswordError]=useState(false);
    const[passwordMatchError,setPasswordMatchError]=useState(false)
    const [clients,setClients]=useState([])

    // Ponemos todos los mensajes escondidos
    const limpiarErrores = (value) => {
      setDniError(false);
      setMailError(false);
      setNameError(false);
      setSurnameError(false);
      setPasswordError(false);
      setPasswordMatchError(false);
      setDniInDbError(false);
      setEmailInDbError(false);
    };

    


    const validateName = (value) => {
      // Verificar que el campo 'name' no esté vacío
      if (value.trim() === "") {
        setNameError(true);
        return false;
      }
    
      return true;
    };

    const validateSurname = (value) => {
      // Verificar que el campo 'name' no esté vacío
      if (value.trim() === "") {
        setSurnameError(true);
        return false;
      }
    
      return true;
    };

       // Devuelve true si el DNI es correcto, sino devuelve false y muestra el error
       const validateDni = (value) => {
        const dniRegex = /^[0-9]{8}[A-Z]$/;
        const dniInDB = clients.some(client=>client.dni===value)
        //Formato de dni no valido
        if (!dniRegex.test(value)) {
          setDniError(true);
          return false;
        //Dni existe en database
        }else if(dniInDB){
          setDniInDbError(true)
          return false
        }
        return true;
      };

    const validateMail = (value) => {
      const emailRegex = /^[A-Za-z0-9]{4,}@[a-z]{2,}\.[a-z]{2,4}$/;
      const emailInDB = clients.some(client=>client.mail===value)
      //Formato mail no valido
      if (!emailRegex.test(value)) {
        setMailError(true);
        return false;
        //Mail ya existe en DB
      }else if(emailInDB){
        setEmailInDbError(true)
        return false
      }
      return true;
    };

    // Devuelve true si el Password es correcto, sino devuelve false y muestra el error
    const validatePassword = (value) => {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,24}$/;


      if(!passwordRegex.test(value) && (password!== confirmPassword)){
        setPasswordMatchError(true)
        setPasswordError(true)
        return false;
      } else if(passwordRegex.test(value) && (password!== confirmPassword)){
        setPasswordMatchError(true)
        return false;
      } else if(!passwordRegex.test(value) && (password===confirmPassword)){
        setPasswordError(true)
        return false;
      }
      return true;
    };

    
    
    const handleClick=(e)=>{
        e.preventDefault()
        limpiarErrores()

        let funciona=true
        if (!validateDni(dni)) funciona =false
        if (!validateMail(mail)) funciona =false
        if (!validateName(name)) funciona =false
        if (!validateSurname(surname)) funciona =false
        if (!validatePassword(password)) funciona =false
        
        
        if (funciona) {
          const client={dni,name,surname,mail,password}
          console.log(client)
          fetch("http://localhost:8080/client/register",{
              method:"POST",
              headers:{"Content-Type":"application/json"},
              body:JSON.stringify(client)
          }).then(response => {
            if (response.ok) {
              return response.json(); // Si es necesario procesar la respuesta JSON
            } else {
              throw new Error('Error al registrar el cliente');
            }
          }).then(data => {
            // Manejar la respuesta exitosa (data contiene el mensaje)
            console.log(data);
          }).catch(error => {
            // Manejar errores
            console.error(error.message);
          })
          handleLoginNavigation()
        }

    }



  return (
    <body class="signup-page">
      <div class="signup-container">
        <a href="/home"><img src={logo} alt="Logo"/></a>
	      <form class="signup-form">
	      <div>
          <label>DNI:</label>
          <input type="text" value={dni} onChange={(e)=>setDni(e.target.value)} style={{ borderColor: dniError || dniInDbError ? 'red' : '' }}/>
      		{dniError && <p class="err"style={{ color: 'red' }}>Formato DNI Erróneo.</p>}{dniInDbError && <p class="err" style={{ color: 'red' }}>Este DNI ya existe.</p>}
      	</div>
        <div>		
          <label>Nombre:</label>
          <input type="text" value={name} onChange={(e)=>setName(e.target.value)} style={{ borderColor: nameError ? 'red' : '' }}/>
      		{nameError && <p class="err" style={{ color: 'red' }}>Formato Nombre Erróneo.</p>}
      	</div>
        <div>		
          <label>Apellido:</label>
          <input type="text" value={surname} onChange={(e)=>setSurname(e.target.value)} style={{ borderColor: surnameError ? 'red' : '' }}/>
      		{surnameError && <p class="err" style={{ color: 'red' }}>Formato Apellido Erróneo.</p>}
      	</div>
      	<div>		
          <label>Correo:</label>
          <input type="mail" value={mail} onChange={(e)=>setMail(e.target.value)} style={{ borderColor: mailError || emailInDbError ? 'red' : '' }}/>
      		{mailError && <p class="err"style={{ color: 'red' }}>Formato Correo Erróneo.</p>}{emailInDbError && <p class="err"style={{ color: 'red' }}>Este Correo ya existe.</p>}
      	</div>
        <div>		
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} style={{ borderColor: passwordError ? 'red' : '' }}/>
      		{passwordError && <p class="err" style={{ color: 'red' }}>Formato Erróneo. 8-24 Caracteres. No especiales.</p>}
      	</div>
        <div>		
          <label>Confirma Contraseña:</label>
          <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
      		{passwordMatchError && (<p class="err" style={{color :'red'}}>Contraseñas no coinciden.</p>)}
	      </div>
	      <button type="button" class="btn" onClick={handleClick} >Enviar</button>
      </form>	
    </div>
    </body>
  );
}