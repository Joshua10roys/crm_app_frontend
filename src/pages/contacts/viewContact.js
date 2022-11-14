import { useState } from 'react';
import { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


export default function ViewContact() {

    const navigate = useNavigate();
    const { _id } = useParams();
    const token = Cookies.get('auth_token');
    const { setSnackbar } = useContext(ContextSnackbar);
    const { user } = useContext(ContextUser);
    const [contact, setContact] = useState({});

    // load contact data
    useEffect(() => {
        fetch(`${Server_URL}/contact/getById/${_id}`, {
            headers: { "token": token }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    setContact(res.data);
                } else if (res.status >= 400 && res.status < 500) {
                    setSnackbar({ open: true, message: res.msg, severity: 'error' });
                    navigate('/contacts');
                }
            })
            .catch(error => console.log(error))
    }, []);

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

    // dialog box
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // contact delete function
    const deleteContact = () => {

        fetch(`${Server_URL}/contact/delete/${_id}`, {
            method: "DELETE",
            headers: { "token": token }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    setSnackbar({ open: true, message: res.msg, severity: 'success' });
                    navigate('/contacts');
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
                    Are you sure you want to delete this contact
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={() => {
                        deleteContact();
                        handleClose();
                    }
                    }>
                        Yes</Button>
                </DialogActions>
            </Dialog>

            {/* header nav and buttons */}
            <Paper sx={{ pl: 2, pr: 4, py: 1, backgroundColor: '#F9FAFB' }}>
                <Grid container justifyContent='space-between' alignItems="center">

                    {/* title */}
                    <Grid item>
                        <Typography variant='h5' sx={{ fontWeight: 'bold' }} >View Contact</Typography>
                    </Grid>

                    {/* buttons */}
                    <Grid item>

                        <Button type="submit" variant="contained" startIcon={<EditIcon />}
                            sx={{ marginLeft: 2, fontSize: '15px', fontWeight: 'bold' }}
                            disabled={user.userType === 'view only' && true}
                            onClick={() => navigate(`/contacts/edit/${contact._id}`)}
                        >
                            Edit
                        </Button>

                        <Button type="submit" variant="outlined" startIcon={<DeleteIcon />} sx={buttonStyle}
                            disabled={user.userType === 'view only' && true}
                            onClick={handleClickOpen}
                        >
                            Delete
                        </Button>

                    </Grid>

                </Grid>
            </Paper>

            {Object.keys(contact).length === 0
                ?
                <Stack justifyContent="center" alignItems="center" minHeight="90%">
                    <CircularProgress />
                </Stack>
                :
                <EditForm contact={contact} />
            }

        </Box >
    )
}


// data display form
function EditForm({ contact }) {

    return (
        <Box className='fadeIn'>

            <Paper elevation={6} sx={{ m: 2, paddingY: 5, paddingX: 5 }}>

                {/* form */}
                <form>
                    <Grid container rowSpacing={0} columnSpacing={{ xs: 1, sm: 6 }}>

                        <Grid item xs={12} sx={{ mb: 1 }}>
                            <Typography variant='h6'
                                sx={{ fontWeight: 'bold', borderBottom: 1, borderBottomWidth: 4, borderBottomColor: '#949494' }}
                            >Details</Typography>
                        </Grid>

                        {/* firstname */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                margin="normal"
                                label="First Name *"
                                variant="filled"
                                value={contact.firstname}
                                sx={{ mb: 0 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        {/* lastname */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                margin="normal"
                                label="Last Name"
                                variant="filled"
                                value={contact.lastname}
                                sx={{ mb: 0 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        {/* company */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                margin="normal"
                                label="Company Name"
                                variant="filled"
                                value={contact.company}
                                sx={{ mb: 0 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        {/* position */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                margin="normal"
                                size="small"
                                label="Position"
                                type="text"
                                variant="filled"
                                value={contact.position}
                                sx={{ mb: 0 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        {/* email */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                margin="normal"
                                size="small"
                                label="Email-Id"
                                type="email"
                                variant="filled"
                                value={contact.email}
                                sx={{ mb: 0 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        {/* phoneNumber */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                margin="normal"
                                size="small"
                                label="Phone Number"
                                type="text"
                                variant="filled"
                                value={contact.phoneNumber}
                                sx={{ mb: 0 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        {/* description */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                multiline
                                rows="4"
                                margin="normal"
                                size="small"
                                label="Description"
                                type="text"
                                variant="filled"
                                value={contact.description}
                                sx={{ mb: 0 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} pt={2} mb={1} >
                            <Typography variant='h6'
                                sx={{ fontWeight: 'bold', borderBottom: 1, borderBottomWidth: 4, borderBottomColor: '#949494' }}
                            >Address</Typography>
                        </Grid>

                        {/* line1 */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                size="small"
                                label="Line 1"
                                type="text"
                                variant="filled"
                                value={contact.line1}
                                sx={{ mb: 0 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        {/* street */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                size="small"
                                label="Street"
                                type="text"
                                variant="filled"
                                value={contact.street}
                                sx={{ mb: 0 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        {/* city */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                size="small"
                                label="City"
                                type="text"
                                variant="filled"
                                value={contact.city}
                                sx={{ mb: 0 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        {/* state */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                size="small"
                                label="State"
                                type="text"
                                variant="filled"
                                value={contact.state}
                                sx={{ mb: 0 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        {/* postcode */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                size="small"
                                label="Postcode"
                                type="text"
                                variant="filled"
                                value={contact.postcode}
                                sx={{ mb: 0 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        {/* country */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                size="small"
                                label="Country"
                                type="text"
                                variant="filled"
                                value={contact.country}
                                sx={{ mb: 0 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                    </Grid>
                </form>
            </Paper>

        </Box >
    )
}