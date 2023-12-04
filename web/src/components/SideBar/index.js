import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    return (
        <sidebar className='col-2 sidebar'>
            <img src={logo} className='img-fluid px-3 py-4'/>
            <ul className='p-0 m-0'>
                <li>
                    <Link to='/' className={location.pathname === '/' ? 'active' : ''}>
                        <span className='mdi mdi-calendar-check'></span>
                        <text>Agendamentos</text>
                    </Link>
                </li>
                <li>
                    <Link to='/cliente' className={location.pathname === '/cliente' ? 'active' : ''}>
                        <span className='mdi mdi-account-multiple'></span>
                        <text>Clientes</text>
                    </Link>
                </li>
            </ul>
        </sidebar>
    );
}

export default Sidebar;
