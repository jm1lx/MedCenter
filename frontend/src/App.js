import './App.css';
import HomePage from './pages/HomePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NoPage from './pages/NoPage';
import Register from './pages/Register';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Main from './pages/Main';
import ReadClient from './pages/ReadClient';
import LoginDoctor from './pages/LoginDoctor';
import Doctor from './pages/Doctor';
import Refresh from './pages/Refresh';
import Informes from './pages/Informes';
import InformesDoctor from './pages/InformesDoctor';



function App() {
  const userEmail = localStorage.getItem('userEmail'); // Obtén el userEmail almacenado en localStorage
  const dniPage = localStorage.getItem('dni');
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage/>}/>
          <Route path="/refresh" element={<Refresh/>}/>
          <Route path="/home" element={<HomePage />} />
          <Route path="/login_doctor" element={<LoginDoctor />}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="*" element={<NoPage/>}/>

          {userEmail ? (
            <>
              <Route
                path="/main"
                element={<PrivateRoute element={<Main />} />}
              />
              <Route
                path="/informes"
                element={<PrivateRoute element={<Informes />} />}
              />
              <Route
                path="/client_data"
                element={<PrivateRoute element={<ReadClient />} />}
              />
            </>
          ) : dniPage ? (
            <>
            <Route
            path="/doctor"
            element={<PrivateRoute element={<Doctor />} />}
          />
                      <Route
            path="/informesdoctor"
            element={<PrivateRoute element={<InformesDoctor />} />}
          />
          </>
          ) : null}
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
