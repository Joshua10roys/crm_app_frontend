import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../style/style.css';
import { ContextSnackbar } from '../../context/snackbarContext.js';
import { Server_URL } from '../../utils/urls';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DeleteIcon from '@mui/icons-material/Delete';


export default function AllUsers() {

    const token = Cookies.get('auth_token');
    const navigate = useNavigate();
    const [usersList, setUsersList] = useState([]);
    const { setSnackbar } = useContext(ContextSnackbar);

    // table headers
    const header = ['Name', 'User Name', 'User Type', 'Option'];

    // dialog box related
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    // load initial data
    useEffect(() => { loadData() }, []);

    // function for initial data  
    const loadData = () => {
        setUsersList([]);
        fetch(`${Server_URL}/users/getAllUsers`, {
            headers: { "token": token }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    setUsersList(res.list)
                } else if (res.status === 401) {
                    setSnackbar({ open: true, message: res.msg, severity: 'error' })
                }
            })
            .catch(err => console.log(err))
    }

    // function for delete user
    const deleteUser = () => {
        try {
            fetch(`${Server_URL}/users/delete/${deleteId}`, {
                method: "DELETE",
                headers: { "token": token }
            })
                .then(res => res.json())
                .then(res => {
                    if (res.status >= 200 && res.status < 300) {
                        setSnackbar({ open: true, message: res.msg, severity: 'success' });
                        loadData();
                    } else if (res.status >= 300 && res.status < 400) {
                        navigate(res.redirect);
                    } else if (res.status >= 400 && res.status < 500) {
                        setSnackbar({ open: true, message: res.msg, severity: 'error' });
                    }
                })
        } catch (error) { console.log(error) }
    }


    return (
        <Box sx={{ mt: 8, width: "100%" }} className='fadeIn'>

            {/* title bar */}
            <Paper sx={{ pl: 2, pr: 4, py: 1, backgroundColor: '#F9FAFB' }}>
                <Grid container justifyContent='space-between' alignItems="center">

                    {/* title */}
                    <Grid item>
                        <Typography variant='h5' sx={{ fontWeight: 'bold' }} >All User</Typography>
                    </Grid>

                    {/* buttons */}
                    <Grid item>
                        <Button type="submit" variant="contained" sx={{ marginLeft: 2, fontSize: '15px', fontWeight: 'bold' }}
                            onClick={() => navigate('/user/addUser')} startIcon={<PersonAddAlt1Icon />}>
                            Add User
                        </Button>
                    </Grid>

                </Grid>
            </Paper>

            <Container>
                <Paper elevation={6} sx={{
                    marginTop: 5, marginBottom: 3, padding: 5, display: 'flex',
                    flexDirection: 'column', alignItems: 'center'
                }}>

                    {/* user icon and text */}
                    <Stack direction='row' alignItems='center' mb={2}>
                        <Avatar sx={{ m: 1, bgcolor: '#ad1457' }}>
                            <PeopleAltIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            All Users
                        </Typography>
                    </Stack>

                    {/* dialog */}
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent sx={{ paddingBottom: 1 }}>
                            Are you sure you want to delete this User
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>No</Button>
                            <Button onClick={() => {
                                deleteUser();
                                handleClose();
                            }}>Yes</Button>
                        </DialogActions>
                    </Dialog>

                    {/* table */}
                    <TableContainer>
                        <Table stickyHeader aria-label="simple table">

                            {/* head */}
                            <TableHead>
                                <TableRow>
                                    {header.map((ele, index) => (
                                        <TableCell key={index + 1} align="center" sx={{
                                            fontWeight: 'bold', bgcolor: '#5d4037', borderBottom: 1, color: 'white'
                                        }}>
                                            {ele}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            {usersList.length === 0
                                ?
                                /* CircularProgress */
                                <Progress />
                                :
                                /* tablebody */
                                <TableBody>
                                    {usersList.map((user) => (
                                        <TableRow hover key={user._id} sx={{ bgcolor: '#d7ccc8', borderBottom: 1 }}>

                                            {/* name */}
                                            <TableCell sx={{ py: 1 }}>
                                                <Typography align="center" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    {user.firstname + " " + user.lastname}
                                                </Typography>
                                            </TableCell>

                                            {/* user name */}
                                            <TableCell sx={{ py: 1 }}>
                                                <Typography align="center" variant="body1">
                                                    {user.username}
                                                </Typography>
                                            </TableCell>

                                            {/* user type */}
                                            <TableCell sx={{ py: 1 }}>
                                                <Typography align="center" variant="body1">
                                                    {user.userType}
                                                </Typography>
                                            </TableCell>

                                            {/* option */}
                                            <TableCell align="center" sx={{ py: 1 }}>
                                                <IconButton color="error"
                                                    onClick={() => {
                                                        handleClickOpen();
                                                        setDeleteId(user._id);
                                                    }}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>

                                        </TableRow>))}
                                </TableBody>
                            }

                        </Table>
                    </TableContainer>

                </Paper>
            </Container>

        </Box>
    );
}

// progress component
function Progress() {
    return (
        <TableBody>
            <TableRow>
                <TableCell align="center" sx={{ minWidth: 'auto' }} colSpan={4}>
                    <CircularProgress />
                </TableCell>
            </TableRow>
        </TableBody>
    )
}