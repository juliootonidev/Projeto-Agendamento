import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './styles.css'

import Header from "./components/Header";
import Sidebar from "./components/SideBar";

import Agendamento from './pages/Agendamentos';
import Clientes from './pages/Clientes';

const Routers = () =>{
    return (
        <>
            <Header/>
            <div className='container-fluid h-100'>
                <div className='row h-100'>
                    <Router>
                        <Sidebar/>

                        <Routes >
                            <Route path='/' element={<Agendamento/>} />
                            <Route path='/cliente' element={<Clientes/>} />
                        </Routes >

                    </Router>
                </div>
            </div>
        </>
    )
}

export default Routers;
