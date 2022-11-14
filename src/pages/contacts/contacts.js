import * as yup from 'yup';
import { useFormik } from "formik";
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../style/style.css'
import { Server_URL } from '../../utils/urls.js';
import { ContextAuth } from '../../context/authContext';
import { ContextSnackbar } from '../../context/snackbarContext';
import { ContextUser } from '../../context/userContext';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import Divider from '@mui/material/Divider';


export default function Contacts() {

    const token = Cookies.get('auth_token');
    const navigate = useNavigate();
    const { setAuth } = useContext(ContextAuth);
    const { setSnackbar } = useContext(ContextSnackbar);
    const { user } = useContext(ContextUser);
    const [contactsList, setContactsList] = useState([]);
    const [searchKeyWord, setSearchKeyWord] = useState('');
    const [page, setPage] = useState(0);

    // load initial data
    useEffect(() => { loadData() }, []);

    // function for initial data  
    const loadData = () => {

        setContactsList([]);

        fetch(`${Server_URL}/contact/get/0`, {
            headers: { "token": token }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    setContactsList(res.data);
                } else if (res.status >= 400 && res.status < 500) {
                    setSnackbar({ open: true, message: res.msg, severity: 'error' });
                }
            })
            .catch(error => console.log(error))
    }

    // function for onSubmit
    const submit = ((value) => {

        let keyWord = value.searcFor.trim();
        setSearchKeyWord('/' + keyWord);

        if (keyWord === "") {
            setSnackbar({ open: true, message: 'Please enter input value', severity: 'warning' })
        } else {

            fetch(`${Server_URL}/contact/get/${keyWord}/0`, {
                headers: { "token": token }
            })
                .then(res => res.json())
                .then(res => {
                    if (res.status >= 200 && res.status < 300) {
                        setPage(0);
                        setContactsList(res.data);
                    } else if (res.status >= 400 && res.status < 500) {
                        setSnackbar({ open: true, message: res.msg, severity: 'error' });
                    }
                })
                .catch(error => console.log(error))
        }
    });

    // formik hook for search
    const formik = useFormik({
        initialValues: { searcFor: '' },
        validationSchema: yup.object().shape({ searcFor: yup.string() }),
        onSubmit: submit
    });


    return (
        <Box sx={{ mt: 8.3, mb: 2, width: "100%" }} className='fadeIn'>

            <Paper sx={{ pl: 2, pr: 4, py: 1, backgroundColor: '#F9FAFB' }}>
                <Grid container justifyContent='space-between' alignItems="center">

                    {/* title & search */}
                    <Grid item>
                        <Stack direction="row" alignItems="center" spacing={3}>

                            {/* title */}
                            <Typography variant='h5' sx={{ fontWeight: 'bold' }} >Contacts</Typography>

                            {/* search input */}
                            <Paper component="form" onSubmit={formik.handleSubmit}
                                sx={{ p: '0px 4px', display: 'flex', alignItems: 'center', width: 400 }}>

                                <InputBase sx={{ ml: 1, flex: 1 }} name='searcFor'
                                    placeholder="search by first name" onChange={formik.handleChange} />

                                <>
                                    {formik.values.searcFor
                                        ?
                                        <IconButton onClick={() => {
                                            formik.resetForm();
                                            loadData();
                                        }} aria-label="search">
                                            <ClearIcon />
                                        </IconButton>
                                        :
                                        ''}
                                </>

                                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

                                <IconButton sx={{ p: '10px' }} onClick={formik.handleSubmit} aria-label="search">
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                        </Stack>
                    </Grid>

                    {/* create button */}
                    <Grid item>
                        <Button variant="contained" sx={{ fontSize: '15px', fontWeight: 'bold' }}
                            disabled={user.userType === 'view only' && true}
                            onClick={() => navigate('/contacts/create')}>Create New</Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* table component */}
            <ContactTable contactsList={contactsList} setContactsList={setContactsList} searchKeyWord={searchKeyWord}
                token={token} setSnackbar={setSnackbar} loadData={loadData} page={page} setPage={setPage}
                userType={user.userType} />

        </Box >

    )
}


// table component
function ContactTable({ contactsList, setContactsList, searchKeyWord, token, setSnackbar, loadData, page, setPage, userType }) {

    // table headers
    const header = ['Name', 'Options', 'Position', 'Contact', 'Address'];

    const navigate = useNavigate();
    // table related
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    // dialog box related
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    // function for load more
    const loadMore = async () => {

        setLoading(true);
        let skip = contactsList.length;

        fetch(`${Server_URL}/contact/get${searchKeyWord}/${skip}`,
            { headers: { "token": token } }
        )
            .then(res => res.json())
            .then(res => {
                setLoading(false);
                if (res.status >= 200 && res.status < 300) {
                    setContactsList([...contactsList, ...res.data]);
                } else if (res.status >= 300 && res.status < 400) {
                    navigate(res.navigate);
                } else if (res.status >= 400 && res.status < 500) {
                    setSnackbar({ open: true, message: res.msg, severity: 'error' });
                }
            })
            .catch(error => console.log(error))
    }

    // contact delete function
    const deleteContact = () => {

        fetch(`${Server_URL}/contact/delete/${deleteId}`, {
            method: "DELETE",
            headers: { "token": token },
        })
            .then(res => res.json())
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    setSnackbar({ open: true, message: res.msg, severity: 'success' });
                    loadData();
                } else if (res.status >= 300 && res.status < 400) {
                    navigate(res.redirect)
                } else if (res.status >= 400 && res.status < 500) {
                    setSnackbar({ open: true, message: res.msg, severity: 'error' })
                }
            })
            .catch(error => console.log(error))
    }

    return (
        <>
            <Paper elevation={6} sx={{ m: 2 }}>
                <TableContainer component={Paper}>
                    <Table stickyHeader aria-label="simple table">

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

                        {/* head */}
                        <TableHead>
                            <TableRow>
                                {header.map((ele, index) => (
                                    <TableCell key={index + 1} align="center"
                                        sx={{ fontWeight: 'bold', bgcolor: '#42a5f5', borderBottom: 1, color: 'white' }}
                                    >
                                        {ele}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        {contactsList.length === 0
                            ?
                            /* CircularProgress */
                            <Progress />
                            :
                            /* tablebody */
                            <TableBody>
                                {contactsList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((contact) => (
                                    <TableRow hover key={contact._id} sx={{ bgcolor: '#e3f2fd', borderBottom: 1 }}>

                                        {/* name */}
                                        <TableCell sx={{ py: 1 }}>
                                            <Typography align="center" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                {contact.firstname + " " + contact.lastname}
                                            </Typography>
                                        </TableCell>

                                        {/* position */}
                                        <TableCell sx={{ py: 1 }}>
                                            <Typography variant="body2">{contact.position}</Typography>
                                            <Typography variant="body2">{contact.company}</Typography>
                                        </TableCell>

                                        {/* contact */}
                                        <TableCell align="center" sx={{ py: 1 }}>
                                            <Typography variant="body2" noWrap>{contact.email}</Typography>
                                            <Typography variant="body2" noWrap>{contact.phoneNumber}</Typography>
                                        </TableCell>

                                        {/* address */}
                                        <TableCell align="center" sx={{ py: 1 }}>
                                            <Typography variant="body2"  >{contact.line1 + ', ' + contact.street + ', '
                                                + contact.city + ', ' + contact.state + ', '
                                                + contact.country + ' - ' + contact.postcode}
                                            </Typography>
                                        </TableCell>

                                        {/* option */}
                                        <TableCell sx={{ py: 1 }}>
                                            <Stack direction="row" justifyContent="center">

                                                <IconButton color="default"
                                                    disabled={userType === 'view only' && true}
                                                    onClick={() => navigate(`/contacts/edit/${contact._id}`)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton color="secondary"
                                                    onClick={() => navigate(`/contacts/view/${contact._id}`)}>
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton color="error"
                                                    disabled={userType === 'view only' && true}
                                                    onClick={() => {
                                                        handleClickOpen();
                                                        setDeleteId(contact._id);
                                                    }}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>

                                            </Stack>
                                        </TableCell>

                                    </TableRow>))}
                            </TableBody>
                        }
                    </Table>

                    {/* pagination */}
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15]}
                        component="div"
                        count={contactsList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{ m: 0 }}
                    />

                    {/* button load more */}
                    {rowsPerPage * page >= contactsList.length - rowsPerPage ?
                        <Stack justifyContent="flex-end" alignItems="center" sx={{ pb: 2 }} >
                            <Button variant="contained" onClick={loadMore}>
                                Load More
                                {loading ? <CircularProgress size={20} thickness={5} sx={{ marginLeft: 1, color: "white" }} /> : ""}
                            </Button>
                        </Stack>
                        :
                        ''}

                </TableContainer>
            </Paper>
        </>
    )
}

// progress component
function Progress() {
    return (
        <TableBody>
            <TableRow>
                <TableCell align="center" sx={{ minWidth: 'auto' }} colSpan={5}>
                    <CircularProgress />
                </TableCell>
            </TableRow>
        </TableBody>
    )
}