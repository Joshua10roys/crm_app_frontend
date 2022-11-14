import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../style/style.css';
import { ContextAuth } from '../../context/authContext.js';
import { ContextSnackbar } from '../../context/snackbarContext.js';
import { ContextUser } from '../../context/userContext.js';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';


export default function Settings() {

    const navigate = useNavigate();
    const { setAuth } = useContext(ContextAuth);
    const { setSnackbar } = useContext(ContextSnackbar);
    const { user } = useContext(ContextUser);

    return (
        <Box sx={{ mx: 4, mt: 12, mb: 2, width: '100%' }} className='fadeIn'>

            <Box sx={{ borderBottom: 1, borderBottomWidth: 4, borderBottomColor: '#C2C2C2', borderBlockWidth: '100%' }}>
                <Typography variant="h4" gutterBottom > Users</Typography>
            </Box>

            <Stack direction='row'>

                {user.userType === 'manager' || user.userType === 'admin'
                    ?
                    <Paper sx={{ m: 2, p: 2, width: '160px', '&:hover': { cursor: 'pointer' } }} elevation={2}
                        onClick={() => navigate('/user/addUser')}>
                        <Stack spacing={2} direction='row' className='fadeIn'>
                            <PersonAddAlt1Icon sx={{ fontSize: 25 }} />
                            <Typography sx={{ fontWeight: 'bold' }} > Add User</Typography>
                        </Stack>
                    </Paper>
                    : ''}

                {user.userType === 'admin'
                    &&
                    <Paper sx={{ m: 2, p: 2, width: '160px', '&:hover': { cursor: 'pointer' } }} elevation={2}
                        onClick={() => navigate('/user/allUsers')}>
                        <Stack spacing={2} direction='row' className='fadeIn'>
                            <PeopleAltIcon sx={{ fontSize: 25 }} />
                            <Typography sx={{ fontWeight: 'bold' }} > All Users</Typography>
                        </Stack>
                    </Paper>}

            </Stack>

        </Box >
    )
}