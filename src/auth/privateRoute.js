import Cookies from 'js-cookie';
import { Outlet, Navigate } from 'react-router-dom';


export default function PrivateRoute({ children, ...rest }) {

    return (
        Cookies.get('auth_token')
            ? <Outlet />
            : < Navigate to='/user/login' />
    )
}