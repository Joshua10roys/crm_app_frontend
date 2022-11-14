import Cookies from 'js-cookie';
import { Outlet, Navigate } from 'react-router-dom';


export default function PublicRoute({ children, ...rest }) {

    return (
        Cookies.get('auth_token')
            ? < Navigate to='/dashboard' />
            : <Outlet />
    )
} 