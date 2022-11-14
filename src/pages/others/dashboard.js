import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../style/style.css';
import { Server_URL } from '../../utils/urls';
import { ContextAuth } from '../../context/authContext';
import { ContextSnackbar } from '../../context/snackbarContext';
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';


export default function Dashboard() {

    const navigate = useNavigate();
    const token = Cookies.get('auth_token');
    const { setSnackbar } = useContext(ContextSnackbar);
    const [lead, setLead] = useState();
    const [service, setService] = useState();
    const [contact, setContact] = useState();

    useEffect(() => {
        fetch(`${Server_URL}/get/counts`, {
            headers: { "token": token }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    setLead(res.leadCount);
                    setService(res.serviceCount);
                    setContact(res.contactCount);
                } else if (res.status >= 400 && res.status < 500) {
                    setSnackbar({ open: true, message: res.msg, severity: 'error' });
                }
            })
            .catch(error => console.log(error.message))
    }, [])

    return (
        <Box sx={{ mt: { xs: 13, md: 15 }, mb: { xs: 8, md: 13 }, width: "100%" }} className='fadeIn'>

            {lead
                ?
                <Grid container justifyContent="center" columnSpacing={{ xs: 4, md: 8 }} rowSpacing={{ xs: 4, md: 8 }}>

                    {/* leads */}
                    <Grid item>
                        <Paper sx={{ height: 180, width: 220, px: 4, py: 3 }}>
                            <Typography variant="h4" gutterBottom sx={{ color: '#d81b60', fontWeight: 'bold', mb: 0 }}>
                                Leads
                            </Typography>
                            <Typography variant="p" sx={{ color: '#00796b', fontWeight: 'bold' }}>
                                total
                            </Typography>
                            <Typography variant="h2" sx={{
                                color: '#4a148c', fontWeight: 'bold', display: 'flex', justifyContent: 'center',
                            }}>
                                {lead}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* service request */}
                    <Grid item>
                        <Paper sx={{ height: 180, width: 340, px: 4, py: 3 }}>
                            <Typography variant="h4" gutterBottom sx={{ color: '#d81b60', fontWeight: 'bold', mb: 0 }}>
                                Service Request
                            </Typography>
                            <Typography variant="p" sx={{ color: '#00796b', fontWeight: 'bold' }}>
                                total
                            </Typography>
                            <Typography variant="h2" sx={{
                                color: '#4a148c', fontWeight: 'bold', display: 'flex', justifyContent: 'center',
                            }}>
                                {service}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* contacts */}
                    <Grid item>
                        <Paper sx={{ height: 180, width: 220, px: 4, py: 3 }}>
                            <Typography variant="h4" gutterBottom sx={{ color: '#d81b60', fontWeight: 'bold', mb: 0 }}>
                                Contacts
                            </Typography>
                            <Typography variant="p" sx={{ color: '#00796b', fontWeight: 'bold' }}>
                                total
                            </Typography>
                            <Typography variant="h2" sx={{
                                color: '#4a148c', fontWeight: 'bold', display: 'flex', justifyContent: 'center',
                            }}>
                                {contact}
                            </Typography>
                        </Paper>
                    </Grid>

                </Grid>
                :
                <Progress />
            }



        </Box>
    )
}

function Progress() {
    return (
        <Box sx={{ mt: '30vh', width: "100%" }} className='fadeIn'>
            <Stack justifyContent="center" alignItems="center" minHeight="90%">
                <CircularProgress />
            </Stack>
        </Box>
    )
}