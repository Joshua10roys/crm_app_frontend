import * as React from 'react';
import { useContext, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import './style/style.css'
import { ContextAuth } from './context/authContext.js';
import { ContextUser } from './context/userContext.js';
import { ContextSnackbar } from './context/snackbarContext.js';
import PrivateRoute from './auth/privateRoute.js';
import PublicRoute from './auth/publicRoute.js';
import PrivateRouteLevel_1 from './auth/privateRoute_1.js';
import PrivateRouteLevel_2 from './auth/privateRoute_2.js';
import PrivateRouteLevel_3 from './auth/privateRoute_3.js';
import { Server_URL } from './utils/urls.js';
import AppDrawer from './components/drawer.js';
import CustomSnackbar from './components/snackbar.js';
import AllUsers from './pages/users_2/allUsers.js';
import AddUser from './pages/users_2/addUser.js';
import Register from './pages/users/register.js';
import Login from './pages/users/login.js';
import ForgotPassword from './pages/users/forgotPass.js';
import ResetPassword from './pages/users/resetPass.js';
import Dashboard from "./pages/others/dashboard.js";
import Settings from './pages/others/settings.js';
import Profile from './pages/others/profile.js';
import Contacts from './pages/contacts/contacts.js';
import CreateContact from './pages/contacts/createContact.js';
import EditContact from './pages/contacts/editContact.js';
import ViewContact from './pages/contacts/viewContact.js';
import Leads from './pages/leads/leads.js';
import CreateLead from './pages/leads/createLead.js';
import ViewLead from './pages/leads/viewLead.js';
import EditLead from './pages/leads/editLead.js';
import Services from './pages/serviceReq/service.js';
import CreateService from './pages/serviceReq/createService.js';
import ViewService from './pages/serviceReq/viewService.js';
import EditService from './pages/serviceReq/editService.js';


export default function App() {

  const navigate = useNavigate();
  const { auth, setAuth } = useContext(ContextAuth);
  const { user, setUser } = useContext(ContextUser);
  const { setSnackbar } = useContext(ContextSnackbar);
  const token = Cookies.get('auth_token');

  // check auth
  useEffect(() => {
    if (token) {
      setAuth(true);
    } else {
      { auth && setSnackbar({ open: true, message: 'Session Expired', severity: 'error' }) }
      setAuth(false);
      localStorage.clear();
      navigate('/user/login');
    }
  }, [Cookies.get('auth_token')])

  // load user
  useEffect(() => {

    let _id = localStorage.getItem('id');
    let userLength = Object.keys(user).length;

    if (_id && userLength === 0) {
      fetch(`${Server_URL}/users/get/${_id}`, {
        headers: { "token": token }
      })
        .then(res => res.json())
        .then(res => setUser(res.user))
        .catch(err => console.log(err.message))
    }
  }, [])

  return (
    <>
      <Box sx={{ display: 'flex', backgroundColor: '#EAEAEA', minHeight: '100vh' }}>

        <CssBaseline />

        {/* snackbar */}
        <CustomSnackbar />

        {/* app bar & drawer */}
        <AppDrawer />

        {/* routes */}
        <Routes>
          {/* for public users */}
          <Route element={<PublicRoute />} >
            <Route path='/user/login' element={<Login />} />
            <Route path='/user/forgotPassword' element={<ForgotPassword />} />
            <Route path='/user/resetPassword/:randomToken' element={<ResetPassword />} />
            <Route path='/user/register' element={<Register />} />
          </Route>

          {/* for logged in users */}
          <Route element={<PrivateRoute />} >
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/profile' element={<Profile />} />

            <Route path='/leads' element={<Leads />} />
            <Route path='/leads/view/:_id' element={<ViewLead />} />

            <Route path='/services' element={<Services />} />
            <Route path='/services/view/:_id' element={< ViewService />} />

            <Route path='/contacts' element={<Contacts />} />
            <Route path='/contacts/view/:_id' element={<ViewContact />} />

            {/* for employee, manager & admin users */}
            <Route element={<PrivateRouteLevel_1 />} >
              <Route path='/leads/create' element={<CreateLead />} />
              <Route path='/leads/edit/:_id' element={<EditLead />} />

              <Route path='/services/create' element={<CreateService />} />
              <Route path='/services/edit/:_id' element={< EditService />} />

              <Route path='/contacts/create' element={<CreateContact />} />
              <Route path='/contacts/edit/:_id' element={<EditContact />} />
            </Route>

            {/* for manager & admin users */}
            <Route element={<PrivateRouteLevel_2 />} >
              <Route path='/settings' element={<Settings />} />
              <Route path='/user/addUser' element={<AddUser />} />
            </Route>

            {/* for admin users */}
            <Route element={<PrivateRouteLevel_3 />} >
              <Route path='/user/allUsers' element={<AllUsers />} />
            </Route>

          </Route>

          <Route path='*' element={<Navigate replace to={'/dashboard'} />} />

        </Routes>

      </Box >
    </>
  );
}