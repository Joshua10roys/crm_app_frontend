import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../style/style.css'
import { Server_URL } from '../../utils/urls.js';
import { ContextSnackbar } from '../../context/snackbarContext.js';
import { ContextUser } from '../../context/userContext';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
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


export default function ViewLead() {

    const { _id } = useParams();
    const navigate = useNavigate();
    const token = Cookies.get('auth_token');
    const { setSnackbar } = useContext(ContextSnackbar);
    const { user } = useContext(ContextUser);
    const [lead, setLead] = useState({});
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

    // load lead
    useEffect(() => {
        fetch(`${Server_URL}/lead/get/${_id}`, {
            headers: { 'token': token }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    setLead(res.lead);
                } else if (res.status >= 400 && res.status < 500) {
                    setSnackbar({ open: true, message: res.msg, severity: 'error' });
                    navigate('/leads');
                }
            })
            .catch(err => console.log(err.message))
    }, [])

    // contact delete function
    const deleteLead = () => {

        fetch(`${Server_URL}/lead/delete/${_id}`, {
            method: "DELETE",
            headers: { "token": token }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    setSnackbar({ open: true, message: res.msg, severity: 'success' });
                    navigate('/leads');
                } else if (res.status >= 300 && res.status < 400) {
                    navigate(res.navigate);
                } else if (res.status >= 400 && res.status < 500) {
                    setSnackbar({ open: true, message: res.msg, severity: 'error' })
                }
            })
            .catch(error => console.log(error))
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
                    Are you sure you want to delete this Lead
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={() => {
                        deleteLead();
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
                        <Typography variant='h5' sx={{ fontWeight: 'bold' }} >View Lead</Typography>
                    </Grid>

                    {/* buttons */}
                    <Grid item>

                        <Button type="submit" variant="contained" startIcon={<EditIcon />}
                            sx={{ marginLeft: 2, fontSize: '15px', fontWeight: 'bold' }}
                            disabled={user.userType === 'view only' && true}
                            onClick={() => navigate(`/leads/edit/${lead._id}`)}
                        >
                            Edit
                        </Button>

                        <Button type="submit" variant="outlined" startIcon={<DeleteIcon />} sx={buttonStyle}
                            disabled={user.userType === 'view only' && true} onClick={handleClickOpen}
                        >
                            Delete
                        </Button>

                    </Grid>

                </Grid>
            </Paper>

            {Object.keys(lead).length !== 0
                ? <LeadForm lead={lead} />
                : <Progress />}

        </Box >
    )
}

function LeadForm({ lead }) {

    const [contactList, setContactList] = useState([]);
    const [userList, setUserList] = useState([]);

    return (
        <>
            <Paper elevation={6} sx={{ m: 2, paddingY: 5, paddingX: 5 }}>

                {/* form */}
                <form >
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 5 }}>

                        {/* leadTitle */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Lead Title *"
                                name="leadTitle"
                                value={lead.leadTitle}
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
                                    value={lead.assignedUser === null
                                        ? { firstname: "", lastname: "" }
                                        : lead.assignedUser}
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
                                    value={lead.contact === null
                                        ? { firstname: "", lastname: "" }
                                        : lead.contact}
                                    getOptionLabel={(data) => `${data.firstname} ${data.lastname}`}
                                    renderInput={(params) => <TextField {...params} label="Contact *" />}
                                />
                            </FormControl>
                        </Grid>

                        {/* company */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Company Name *"
                                name="companyName"
                                type="text"
                                value={lead.companyName}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        {/* leadCloseDate */}
                        <Grid item xs={12} sm={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <FormControl fullWidth margin="normal">
                                    <DesktopDatePicker
                                        label="Lead Close Date *"
                                        disablePast={true}
                                        inputFormat="DD/MM/YYYY"
                                        disableMaskedInput={true}
                                        value={lead.leadCloseDate}
                                        readOnly={true}
                                        onChange={(value) => { }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </FormControl>
                            </LocalizationProvider>
                        </Grid>

                        {/* probability */}
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel htmlFor="probability">Probability *</InputLabel>
                                <OutlinedInput
                                    id="probability"
                                    name="probability"
                                    type="number"
                                    label="Probability *"
                                    placeholder="0-100"
                                    value={lead.probability}
                                    readOnly={true}
                                    endAdornment={<InputAdornment position="end">%</InputAdornment>}
                                />
                            </FormControl>
                        </Grid>

                        {/* status */}
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="label-status">Status *</InputLabel>
                                <Select
                                    labelId="label-status"
                                    id="status"
                                    name="status"
                                    label="Status *"
                                    readOnly={true}
                                    value={lead.status}
                                >
                                    <MenuItem value='new' >New</MenuItem>
                                    <MenuItem value='contacted'>Contacted</MenuItem>
                                    <MenuItem value='qualified'>Qualified</MenuItem>
                                    <MenuItem value='confirmed'>Confirmed</MenuItem>
                                    <MenuItem value='lost'>Lost</MenuItem>
                                    <MenuItem value='canceled'>Canceled</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* emailId */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                margin="normal"
                                name="emailId"
                                label="Email-Id"
                                type="email"
                                value={lead.emailId}
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
                                name="contactNumber"
                                label="Contact Number"
                                type="number"
                                value={lead.contactNumber}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        {/* website */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                margin="normal"
                                name="website"
                                label="Website"
                                type="url"
                                value={lead.website}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        {/* source */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                margin="normal"
                                name="source"
                                label="Source"
                                type="text"
                                value={lead.source}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        {/* description */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                multiline
                                margin="normal"
                                name="description"
                                label="Description"
                                value={lead.description}
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