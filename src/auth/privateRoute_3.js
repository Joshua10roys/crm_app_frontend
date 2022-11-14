import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { ContextUser } from '../context/userContext';


export default function PrivateRouteLevel_3({ children, ...rest }) {

    const { user } = useContext(ContextUser);

    return (
        user.userType === 'admin'
            ? <Outlet />
            : < Navigate to='/dashboard' />
    )
}