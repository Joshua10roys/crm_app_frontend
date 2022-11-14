import * as yup from 'yup';
import { useFormik } from "formik";
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../style/style.css'
import { Server_URL } from '../../utils/urls.js';
import { ContextSnackbar } from '../../context/snackbarContext.js';
import { ContextUser } from '../../context/userContext.js'
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
import Divider from '@mui/material/Divider';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';


export default function Services() {

    const token = Cookies.get('auth_token');
    const navigate = useNavigate();
    const { setSnackbar } = useContext(ContextSnackbar);
    const { user } = useContext(ContextUser);
    const [serviceReqList, setServiceReqList] = useState([]);
    const [searchKeyWord, setSearchKeyWord] = useState('');
    const [page, setPage] = useState(0);

    // load initial data
    useEffect(() => { loadData() }, []);

    // function for initial data  
    const loadData = () => {

        setServiceReqList([]);

        fetch(`${Server_URL}/service/getServices/0`, {
            headers: { "token": token }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    setServiceReqList(res.services);
                } else if (res.status >= 400 && res.status < 500) {
                    setSnackbar({ open: true, message: res.msg, severity: 'error' });
                }
            })
            .catch(err => console.log(err))
    }

    // function for onSubmit
    const submit = (async (value) => {

        let keyWord = value.searcFor.trim();
        setSearchKeyWord('/' + keyWord);

        if (keyWord === "") {
            setSnackbar({ open: true, message: 'Please enter input value', severity: 'warning' })
        } else {

            fetch(`${Server_URL}/service/getServices/${keyWord}/0`, {
                headers: { "token": token }
            })
                .then(res => res.json())
                .then(res => {
                    if (res.status >= 200 && res.status < 300) {
                        setPage(0);
                        setServiceReqList(res.services);
                    } else if (res.status >= 400 && res.status < 500) {
                        setSnackbar({ open: true, message: res.msg, severity: 'error' })
                    }
                })
                .catch(err => console.log(err.message))
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
                            <Typography variant='h5' sx={{ fontWeight: 'bold' }} >Service Request</Typography>

                            {/* search input */}
                            <Paper component="form" onSubmit={formik.handleSubmit} sx={{
                                p: '0px 4px', display: 'flex', alignItems: 'center', width: 400
                            }}>
                                <InputBase sx={{ ml: 1, flex: 1 }} name='searcFor'
                                    placeholder="search by title" value={formik.values.searcFor}
                                    onChange={formik.handleChange} />

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
                                <IconButton onClick={formik.handleSubmit} aria-label="search">
                                    <SearchIcon /></IconButton>

                            </Paper>
                        </Stack>
                    </Grid>

                    {/* create button */}
                    <Grid item>

                        <Button variant="contained" sx={{ fontSize: '15px', fontWeight: 'bold' }}
                            disabled={user.userType === 'view only' && true} onClick={() => navigate('/services/create')}
                        >
                            Create New
                        </Button>

                    </Grid>
                </Grid>
            </Paper>

            {/* table component */}
            <LeadTable serviceReqList={serviceReqList} setServiceReqList={setServiceReqList} navigate={navigate}
                searchKeyWord={searchKeyWord} token={token} setSnackbar={setSnackbar} loadData={loadData}
                page={page} setPage={setPage} user={user} />

        </Box >

    )
}


// table component
function LeadTable({ serviceReqList, setServiceReqList, navigate, searchKeyWord, token, setSnackbar, loadData, page, setPage, user }) {

    // table related
    const [rowsPerPage, setRowsPerPage] = useState(10);
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

    const getDate = (date) => {
        const d = new Date(date);
        return d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear()
    }

    // function for load more
    const loadMore = async () => {

        setLoading(true);
        let skip = serviceReqList.length;

        fetch(`${Server_URL}/service/getServices${searchKeyWord}/${skip}`, {
            headers: { "token": token }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    setServiceReqList([...serviceReqList, ...res.servies]);
                    setLoading(false);
                } else if (res.status >= 300 && res.status < 400) {
                    navigate(res.redirect);
                } else if (res.status >= 400 && res.status < 500) {
                    setSnackbar({ open: true, message: res.msg, severity: 'error' });
                    setLoading(false);
                }
            })
            .catch(error => console.log(error.message))

    }

    // contact delete function
    const deleteServiceReq = () => {

        fetch(`${Server_URL}/service/delete/${deleteId}`, {
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
                    setSnackbar({ open: true, message: res.msg, severity: 'error' })
                }
            })
            .catch(error => console.log(error.message))
    }

    // table headers
    const header = ['Title', 'Status', 'Assigned To', 'Due Date', 'Type', 'Options'];

    return (
        <>
            <Paper elevation={6} sx={{ m: 2 }}>
                <TableContainer component={Paper}>
                    <Table stickyHeader aria-label="simple table">

                        {/* Dialog box */}
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

                        {/* head */}
                        <TableHead>
                            <TableRow>
                                {header.map((ele, index) => (
                                    <TableCell key={index + 1} align="center"
                                        sx={{ fontWeight: 'bold', borderBottom: 1 }}
                                    >
                                        {ele}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        {serviceReqList.length === 0
                            ?
                            /* CircularProgress */
                            <Progress />
                            :
                            /* tablebody */
                            <TableBody>
                                {serviceReqList
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((service) => (
                                        <TableRow hover key={service._id} sx={{
                                            borderBottom: 1,
                                            bgcolor: (service.priority === 'high' && '#ff9e80') ||
                                                (service.priority === 'medium' && '#ffd180') ||
                                                (service.priority === 'low' && '#dcedc8')
                                        }}>

                                            {/* title */}
                                            <TableCell sx={{ py: 1 }}>
                                                <Typography align="center" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    {service.serviceTitle}
                                                </Typography>
                                                <Typography align="center" variant="body2">
                                                    {'Priority: ' + service.priority}
                                                </Typography>
                                            </TableCell>

                                            {/* status */}
                                            <TableCell sx={{ py: 1 }}>
                                                <Typography align="center" variant="body2">
                                                    {service.status}
                                                </Typography>
                                            </TableCell>

                                            {/* assigned to */}
                                            <TableCell sx={{ py: 1 }}>
                                                <Typography align="center" variant="body2">
                                                    {service.assignedUser !== null ?
                                                        service.assignedUser.firstname + ' ' + service.assignedUser.lastname
                                                        : 'not assigned'}
                                                </Typography>
                                            </TableCell>

                                            {/* due date */}
                                            <TableCell sx={{ py: 1 }}>
                                                <Typography align="center" variant="body2">
                                                    {getDate(service.dueDate)}
                                                </Typography>
                                            </TableCell>

                                            {/* type */}
                                            <TableCell align="center">
                                                <Typography align="center" variant="subtitle1">
                                                    {service.type}
                                                </Typography>
                                            </TableCell>

                                            {/* option */}
                                            <TableCell sx={{ py: 1 }}>
                                                <Stack direction="row" justifyContent="center">

                                                    <IconButton color="default"
                                                        disabled={user.userType === 'view only' && true}
                                                        onClick={() => navigate(`/services/edit/${service._id}`)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>

                                                    <IconButton color="secondary"
                                                        onClick={() => navigate(`/services/view/${service._id}`)}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>

                                                    <IconButton color="error"
                                                        disabled={user.userType === 'view only' && true}
                                                        onClick={() => {
                                                            handleClickOpen();
                                                            setDeleteId(service._id);
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
                        count={serviceReqList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{ m: 0 }}
                    />

                    {/* button load more */}
                    {rowsPerPage * page >= serviceReqList.length - rowsPerPage ?
                        <Stack justifyContent="flex-end" alignItems="center" sx={{ pb: 2 }} >
                            <Button variant="contained" onClick={loadMore}>
                                Load More
                                {loading
                                    ? <CircularProgress size={20} thickness={5} sx={{ marginLeft: 1, color: "white" }} />
                                    : ""}
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
                <TableCell align="center" sx={{ minWidth: 'auto' }} colSpan={6}>
                    <CircularProgress />
                </TableCell>
            </TableRow>
        </TableBody>
    )
}