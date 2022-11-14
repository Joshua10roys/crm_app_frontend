import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { ContextUser } from '../context/userContext';


export default function PrivateRouteLevel_1({ children, ...rest }) {

    const { user } = useContext(ContextUser);

    return (
        user.userType !== 'view only'
            ? <Outlet />
            : < Navigate to='/dashboard' />
    )
}