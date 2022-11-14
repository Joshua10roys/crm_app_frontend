import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../style/style.css'
import { Server_URL } from '../../utils/urls.js';
import { ContextSnackbar } from '../../context/snackbarContext.js';
import { ContextUser } from '../../context/userContext.js';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';


export default function ViewService() {

    const { _id } = useParams();
    const navigate = useNavigate();
    const token = Cookies.get('auth_token');
    const { setSnackbar } = useContext(ContextSnackbar);
    const { user } = useContext(ContextUser);
    const [service, setService] = useState({});
    // dialog box
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // delete button style
    const buttonStyle = {
        backgroundColor: '#d50000',
        borderColor: '#d50000',
        color: 'white',
        marginLeft: 2,
        fontSize: '15px',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: '#b71c1c',
            borderColor: '#d50000',
            boxShadow: 'none',
        },
        '&:active': {
            boxShadow: 'none',
            backgroundColor: '#d50000',
            borderColor: '#b71c1c',
        },
    }

    // load service
    useEffect(() => {
        fetch(`${Server_URL}/service/get/${_id}`, {
            headers: { 'token': token }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    setService(res.service);
                } else if (res.status >= 400 && res.status < 500) {
                    setSnackbar({ open: true, message: res.msg, severity: 'error' });
                    navigate('/services');
                }
            })
            .catch(err => console.log(err.message))
    }, [])

    // delete function
    const deleteServiceReq = () => {

        fetch(`${Server_URL}/service/delete/${_id}`, {
            method: "DELETE",
            headers: { "token": token }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    setSnackbar({ open: true, message: res.msg, severity: 'success' });
                    navigate('/services');
                } else if (res.status >= 300 && res.status < 400) {
                    navigate(res.redirect);
                } else if (res.status >= 400 && res.status < 500) {
                    setSnackbar({ open: true, message: res.msg, severity: 'error' })
                }
            })
            .catch(err => console.log(err.message))
    }

    return (
        <Box sx={{ mt: 8, width: "100%" }} className='fadeIn'>

            {/* dialog box */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ paddingBottom: 1 }}>
                    Are you sure you want to delete this Service Request
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={() => {
                        deleteServiceReq();
                        handleClose();
                    }
                    }>
                        Yes</Button>
                </DialogActions>
            </Dialog>

            <Paper sx={{ pl: 2, pr: 4, py: 1, backgroundColor: '#F9FAFB' }}>
                <Grid container justifyContent='space-between' alignItems="center">

                    {/* title */}
                    <Grid item>
                        <Typography variant='h5' sx={{ fontWeight: 'bold' }} >View Service Request</Typography>
                    </Grid>

                    {/* buttons */}
                    <Grid item>

                        <Button type="submit" variant="contained" startIcon={<EditIcon />}
                            sx={{ marginLeft: 2, fontSize: '15px', fontWeight: 'bold' }}
                            disabled={user.userType === 'view only' && true}
                            onClick={() => navigate(`/services/edit/${service._id}`)}
                        >Edit
                        </Button>

                        <Button type="submit" variant="outlined" startIcon={<DeleteIcon />} sx={buttonStyle}
                            disabled={user.userType === 'view only' && true} onClick={handleClickOpen}
                        >Delete
                        </Button>

                    </Grid>

                </Grid>
            </Paper>

            {Object.keys(service).length !== 0
                ? <ServiceRequestForm service={service} />
                : <Progress />}

        </Box >
    )
}

function ServiceRequestForm({ service }) {

    const [contactList, setContactList] = useState([]);
    const [userList, setUserList] = useState([]);

    return (
        <>
            <Paper elevation={6} sx={{ m: 2, paddingY: 5, paddingX: 5 }}>

                {/* form */}
                <form >
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 5 }}>

                        {/* service title */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Title *"
                                value={service.serviceTitle}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        {/* assign user */}
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth margin="normal">
                                <Autocomplete
                                    readOnly={true}
                                    options={userList}
                                    value={service.assignedUser === null
                                        ? { firstname: "", lastname: "" }
                                        : service.assignedUser}
                                    getOptionLabel={data => `${data.firstname}${data.lastname}`}
                                    renderInput={(params) => <TextField {...params} label="Assign to *" />}
                                />
                            </FormControl>
                        </Grid>

                        {/* contact */}
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth margin="normal">
                                <Autocomplete
                                    readOnly={true}
                                    options={contactList}
                                    value={service.contact === null
                                        ? { firstname: "", lastname: "" }
                                        : service.contact}
                                    getOptionLabel={(data) => `${data.firstname}${data.lastname}`}
                                    renderInput={(params) => <TextField {...params} label="Contact *" />}
                                />
                            </FormControl>
                        </Grid>

                        {/* type */}
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="label-status">Type *</InputLabel>
                                <Select
                                    readOnly={true}
                                    labelId="label-status"
                                    label="Type *"
                                    value={service.type}
                                >
                                    <MenuItem value='update'>Update</MenuItem>
                                    <MenuItem value='adding feature'>Adding Feature</MenuItem>
                                    <MenuItem value='technical work'>Technical Work</MenuItem>
                                    <MenuItem value='hardware change'>Hardware Change</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* priority */}
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="label-status">Priority *</InputLabel>
                                <Select
                                    readOnly={true}
                                    labelId="label-status"
                                    label="Priority *"
                                    value={service.priority}
                                >
                                    <MenuItem value='high'>High</MenuItem>
                                    <MenuItem value='medium'>Medium</MenuItem>
                                    <MenuItem value='low'>Low</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* dueDate */}
                        <Grid item xs={12} sm={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <FormControl fullWidth margin="normal">
                                    <DesktopDatePicker
                                        label="Due Date *"
                                        readOnly={true}
                                        inputFormat="DD/MM/YYYY"
                                        value={service.dueDate}
                                        onChange={(value) => value}
                                        renderInput={(params) => <TextField {...params} error={false} />}
                                    />
                                </FormControl>
                            </LocalizationProvider>
                        </Grid>

                        {/* status */}
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="label-status">Status *</InputLabel>
                                <Select
                                    labelId="label-status"
                                    label="Status *"
                                    readOnly={true}
                                    value={service.status}
                                >
                                    <MenuItem value='created'>Created</MenuItem>
                                    <MenuItem value='open'>Open</MenuItem>
                                    <MenuItem value='in process'>In Process</MenuItem>
                                    <MenuItem value='released'>Released</MenuItem>
                                    <MenuItem value='canceled'>Canceled</MenuItem>
                                    <MenuItem value='completed'>Completed</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* emailId */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Email-Id"
                                value={service.emailId}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        {/* contactNumber */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Contact Number"
                                value={service.contactNumber}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        {/* description */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                multiline
                                margin="normal"
                                label="Description"
                                value={service.description}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                    </Grid>
                </form>

            </Paper>
        </>
    )
}


function Progress() {
    return (
        <Box sx={{ mt: '35vh', width: "100%" }} className='fadeIn'>
            <Stack justifyContent="center" alignItems="center" minHeight="90%">
                <CircularProgress />
            </Stack>
        </Box>
    )
}