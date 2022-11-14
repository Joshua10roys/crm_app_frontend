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
import Divider from '@mui/material/Divider';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';


export default function Leads() {

    const token = Cookies.get('auth_token');
    const navigate = useNavigate();
    const { setSnackbar } = useContext(ContextSnackbar);
    const { user } = useContext(ContextUser);
    const [leadList, setleadList] = useState([]);
    const [searchKeyWord, setSearchKeyWord] = useState('');
    const [page, setPage] = useState(0);

    // load initial data
    useEffect(() => { loadData() }, []);

    // function for initial data  
    const loadData = () => {

        setleadList([]);

        fetch(`${Server_URL}/lead/getLeads/0`, {
            headers: { "token": token }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    setleadList(res.leads);
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
            setSnackbar({ open: true, message: 'Please enter input value', severity: 'warning' });
        } else {
            fetch(`${Server_URL}/lead/getLeads/${keyWord}/0`, {
                headers: { "token": token }
            })
                .then(res => res.json())
                .then(res => {
                    if (res.status === 201) {
                        setPage(0);
                        setleadList(res.leads);
                    } else if (res.status === 403) {
                        setSnackbar({ open: true, message: res.msg, severity: 'error' });
                    }
                })
                .catch(err => console.log(err))
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
                            <Typography variant='h5' sx={{ fontWeight: 'bold' }} >Leads</Typography>

                            {/* search input */}
                            <Paper component="form" onSubmit={formik.handleSubmit} sx={{
                                p: '0px 4px', display: 'flex', alignItems: 'center', width: 400
                            }}>
                                <InputBase sx={{ ml: 1, flex: 1 }} name='searcFor'
                                    placeholder="search by title" value={formik.values.searcFor}
                                    onChange={formik.handleChange} />

                                {formik.values.searcFor
                                    ?
                                    <IconButton onClick={() => {
                                        formik.resetForm();
                                        loadData();
                                    }} aria-label="search">
                                        <ClearIcon /></IconButton>
                                    : ''}

                                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                <IconButton onClick={formik.handleSubmit} aria-label="search">
                                    <SearchIcon /></IconButton>

                            </Paper>
                        </Stack>
                    </Grid>

                    {/* create button */}
                    <Grid item>

                        <Button variant="contained" sx={{ fontSize: '15px', fontWeight: 'bold' }}
                            disabled={user.userType === 'view only' && true} onClick={() => navigate('/leads/create')}
                        >
                            Create New
                        </Button>

                    </Grid>
                </Grid>
            </Paper>

            {/* table component */}
            <LeadTable leadList={leadList} setleadList={setleadList} navigate={navigate}
                searchKeyWord={searchKeyWord} token={token} setSnackbar={setSnackbar} loadData={loadData}
                page={page} setPage={setPage} user={user} />

        </Box >

    )
}


// table component
function LeadTable({ leadList, setleadList, navigate, searchKeyWord, token, setSnackbar, loadData, page, setPage, user }) {

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

        setSnackbar({ open: true, message: 'Load More', severity: 'success' });
        setLoading(true);
        let skip = leadList.length;

        fetch(`${Server_URL}/lead/getLeads${searchKeyWord}/${skip}`, {
            headers: { "token": token }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    setleadList([...leadList, ...res.leads]);
                    setLoading(false);
                } else if (res.status >= 300 && res.status < 400) {
                    navigate(res.navigate);
                } else if (res.status >= 400 && res.status < 500) {
                    setSnackbar({ open: true, message: res.msg, severity: 'error' });
                    setLoading(false);
                }
            })
            .catch(error => console.log(error))

    }

    // contact delete function
    const deleteLead = () => {

        fetch(`${Server_URL}/lead/delete/${deleteId}`, {
            method: "DELETE",
            headers: { "token": token }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    setSnackbar({ open: true, message: res.msg, severity: 'success' });
                    loadData();
                } else if (res.status >= 300 && res.status < 400) {
                    navigate(res.navigate);
                } else if (res.status >= 400 && res.status < 500) {
                    setSnackbar({ open: true, message: res.msg, severity: 'error' });
                }
            })
    }

    // table headers
    const header = ['Title', 'Status', 'Lead Close Date', 'Details', 'Assigned to', 'Options'];

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

                        {leadList.length === 0
                            ?
                            /* CircularProgress */
                            <Progress />
                            :
                            /* tablebody */
                            <TableBody>

                                {leadList
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((lead) => (
                                        <TableRow hover key={lead._id} sx={{ borderBottom: 1 }}>

                                            {/* title */}
                                            <TableCell sx={{ py: 1 }}>
                                                <Typography align="center" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    {lead.leadTitle}
                                                </Typography>
                                                <Typography align="center" variant="body2">
                                                    {'Probability: ' + lead.probability + '%'}
                                                </Typography>
                                            </TableCell>

                                            {/* status */}
                                            <TableCell sx={{ py: 1 }}>
                                                <Typography align="center" variant="body2">
                                                    {lead.status}
                                                </Typography>
                                            </TableCell>

                                            {/* leadCloseDate */}
                                            <TableCell sx={{ py: 1 }}>
                                                <Typography align="center" variant="body2">
                                                    {getDate(lead.leadCloseDate)}
                                                </Typography>
                                            </TableCell>

                                            {/* details */}
                                            <TableCell align="center">
                                                <Typography align="center" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    {lead.companyName}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {lead.website}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {lead.emailId}
                                                </Typography>
                                            </TableCell>

                                            {/* assigned user */}
                                            <TableCell sx={{ py: 1 }}>
                                                <Typography align="center" variant="body2">
                                                    {lead.assignedUser !== null ?
                                                        lead.assignedUser.firstname + ' ' + lead.assignedUser.lastname
                                                        : 'not assigned'}
                                                </Typography>
                                            </TableCell>

                                            {/* option */}
                                            <TableCell sx={{ py: 1 }}>
                                                <Stack direction="row" justifyContent="center">
                                                    <IconButton color="default"
                                                        disabled={user.userType === 'view only' && true}
                                                        onClick={() => navigate(`/leads/edit/${lead._id}`)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton color="secondary"
                                                        onClick={() => navigate(`/leads/view/${lead._id}`)}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton color="error"
                                                        disabled={user.userType === 'view only' && true}
                                                        onClick={() => {
                                                            handleClickOpen();
                                                            setDeleteId(lead._id);
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
                        count={leadList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{ m: 0 }}
                    />

                    {/* button load more */}
                    {rowsPerPage * page >= leadList.length - rowsPerPage ?
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