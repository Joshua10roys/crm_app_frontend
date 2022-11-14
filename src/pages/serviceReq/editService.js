import * as yup from 'yup';
import { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useFormik } from "formik";
import '../../style/style.css'
import { Server_URL } from '../../utils/urls.js';
import { ContextSnackbar } from '../../context/snackbarContext.js';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { FormControl, InputAdornment, OutlinedInput } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';


export default function EditService() {

    const { _id } = useParams();
    const token = Cookies.get('auth_token');
    const navigate = useNavigate();
    const { setSnackbar } = useContext(ContextSnackbar);
    const [service, setService] = useState({});

    // load service
    useEffect(() => {
        loadService();
    }, [])

    // loading service function
    const loadService = () => {

        setService({});
        fetch(`${Server_URL}/service/get/${_id}`, {
            headers: { 'token': token }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    setService(res.service)
                } else if (res.status >= 400 && res.status < 500) {
                    setSnackbar({ open: true, message: res.msg, severity: 'error' });
                    navigate('/services');
                }
            })
            .catch(err => console.log(err.message))
    }

    return (
        <Box sx={{ mt: 8, width: "100%" }} className='fadeIn'>

            {Object.keys(service).length !== 0
                ? <ServiceRequestForm service={service} setSnackbar={setSnackbar} navigate={navigate} token={token} />
                : <Progress />}

        </Box >
    )
}

function ServiceRequestForm({ service, setSnackbar, navigate, token }) {

    const [loading, setLoading] = useState(false);
    const [userList, setUserList] = useState([]);
    const [contactList, setContactList] = useState([]);
    const [fetchCon, setFetchCon] = useState(false);

    // to fetching user list
    useEffect(() => {
        fetch(`${Server_URL}/users/getUserList`, {
            headers: { 'token': token }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    setUserList(res.list);
                }
            })
            .catch(err => console.log(err))
    }, [])

    // to fetching contact list
    const searchContact = (keyword) => {

        if (keyword.length >= 1) {
            setFetchCon(true);
            fetch(`${Server_URL}/contact/getContactList/${keyword}`, {
                headers: { 'token': token }
            })
                .then(res => res.json())
                .then(res => {
                    setFetchCon(false);
                    if (res.status >= 200 && res.status < 300) {
                        setContactList(res.list);
                    }
                })
                .catch(err => console.log(err.message))
        }
    }

    const formik = useFormik({

        initialValues: {

            serviceTitle: service.serviceTitle,
            assignedUser: service.assignedUser === null
                ?
                {
                    _id: "",
                    firstname: "",
                    lastname: ""
                }
                :
                {
                    _id: service.assignedUser._id,
                    firstname: service.assignedUser.firstname,
                    lastname: service.assignedUser.lastname
                },
            contact: service.contact === null
                ?
                {
                    _id: "",
                    firstname: "",
                    lastname: ""
                }
                :
                {
                    _id: service.contact._id,
                    firstname: service.contact.firstname,
                    lastname: service.contact.lastname
                },
            type: service.type,
            priority: service.priority,
            dueDate: service.dueDate,
            status: service.status,
            emailId: service.emailId,
            contactNumber: service.contactNumber,
            description: service.description,
        },

        validationSchema: yup.object().shape({

            serviceTitle: yup.string().required("required"),
            assignedUser: yup.object().shape({
                _id: yup.string().required("required"),
                firstname: yup.string().required("required"),
                lastname: yup.string()
            }),
            contact: yup.object().shape({
                _id: yup.string().required("required"),
                firstname: yup.string().required("required"),
                lastname: yup.string()
            }),
            type: yup.string().required("required"),
            dueDate: yup.string().required("required"),
            priority: yup.string().required("required"),
            status: yup.string().required("required"),
            emailId: yup.string().matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "not a valid id"),
            contactNumber: yup.string(),
            description: yup.string(),
        }),

        onSubmit: (value, { resetForm }) => {

            const { assignedUser, contact, ...data } = value;
            const payload = { assignedUser: assignedUser._id, contact: contact._id, ...data };
            setLoading(true);

            try {
                fetch(`${Server_URL}/service/update/${service._id}`, {
                    method: "PUT",
                    body: JSON.stringify(payload),
                    headers: { "Content-Type": "application/json", 'token': token }
                })
                    .then(res => res.json())
                    .then((res) => {
                        resetForm(value);
                        setLoading(false);
                        if (res.status >= 200 && res.status < 300) {
                            setSnackbar({ open: true, message: res.msg, severity: 'success' });
                            navigate('/services');
                        } else if (res.status >= 300 && res.status < 400) {
                            navigate(res.navigate);
                        } else if (res.status >= 400 && res.status < 500) {
                            setSnackbar({ open: true, message: res.msg, severity: 'warning' });
                        }
                    })
            } catch (error) {
                throw (error.message)
            }
        }
    })


    return (
        <>
            <Paper sx={{ pl: 2, pr: 4, py: 1, backgroundColor: '#F9FAFB' }}>
                <Grid container justifyContent='space-between' alignItems="center">

                    {/* title */}
                    <Grid item>
                        <Typography variant='h5' sx={{ fontWeight: 'bold' }} >Edit Service Request</Typography>
                    </Grid>

                    {/* buttons */}
                    <Grid item>

                        <Button variant="outlined" sx={{ fontSize: '15px', fontWeight: 'bold' }}
                            onClick={() => navigate(-1)}>Cancel</Button>

                        <Button type="submit" variant="contained"
                            sx={{ marginLeft: 2, fontSize: '15px', fontWeight: 'bold' }}
                            onClick={formik.handleSubmit} startIcon={<FileDownloadDoneIcon />}
                        >
                            Update
                            {loading ?
                                <CircularProgress size={20} thickness={5} sx={{ marginLeft: 1, color: "white" }} />
                                : ""}
                        </Button>

                    </Grid>

                </Grid>
            </Paper>

            <Paper elevation={6} sx={{ m: 2, paddingY: 5, paddingX: 5 }}>

                {/* form */}
                <form >
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 5 }}>

                        {/* service title */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Service Title *"
                                name="serviceTitle"
                                value={formik.values.serviceTitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                sx={{ mb: 0 }}
                            />
                            <FormHelperText sx={{ color: '#D32F2F' }}>
                                {formik.errors.leadTitle && formik.touched.leadTitle ? formik.errors.leadTitle : ""}
                            </FormHelperText>
                        </Grid>

                        {/* assign user */}
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth margin="normal">
                                <Autocomplete
                                    disableClearable
                                    id="assignedUser"
                                    options={userList}
                                    value={formik.values.assignedUser}
                                    getOptionLabel={data => `${data.firstname}${data.lastname}`}
                                    isOptionEqualToValue={(option, value) => option._id !== value._id}
                                    onChange={(event, value) => formik.setFieldValue('assignedUser', value)}
                                    onBlur={(e) => {
                                        if (e.target.value.length == 0) {
                                            formik.setFieldTouched('assignedUser', true)
                                        } else {
                                            formik.setFieldTouched('assignedUser', false)
                                        }
                                    }}
                                    sx={{ mb: 0 }}
                                    renderInput={(params) => <TextField {...params} label="Assign to *" />}
                                />
                                <FormHelperText sx={{ color: '#D32F2F', ml: 0 }}>
                                    {formik.errors.assignedUser && formik.touched.assignedUser ? formik.errors.assignedUser._id : ""}
                                </FormHelperText>
                            </FormControl>
                        </Grid>

                        {/* contact */}
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth margin="normal">
                                <Autocomplete
                                    disableClearable
                                    id="contact"
                                    loading={fetchCon}
                                    options={contactList}
                                    value={formik.values.contact}
                                    getOptionLabel={(data) => `${data.firstname}${data.lastname}`}
                                    isOptionEqualToValue={(option, value) => option._id !== value._id}
                                    onChange={(event, value) => formik.setFieldValue('contact', value)}
                                    onKeyUp={(event, value) => searchContact(event.target.value.trim())}
                                    onBlur={(e) => {
                                        if (e.target.value.length == 0) {
                                            formik.setFieldTouched('contact', true)
                                        } else {
                                            formik.setFieldTouched('contact', false)
                                        }
                                    }}
                                    sx={{ mb: 0 }}
                                    renderInput={(params) => <TextField {...params} label="Contact *" />}
                                />
                                <FormHelperText sx={{ color: '#D32F2F', ml: 0 }}>
                                    {formik.errors.contact && formik.touched.contact ? formik.errors.contact._id : ""}
                                </FormHelperText>
                            </FormControl>
                        </Grid>

                        {/* type */}
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="label-status">Type *</InputLabel>
                                <Select
                                    labelId="label-status"
                                    name="type"
                                    label="Type *"
                                    value={formik.values.type}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <MenuItem value='update'>Update</MenuItem>
                                    <MenuItem value='adding feature'>Adding Feature</MenuItem>
                                    <MenuItem value='technical work'>Technical Work</MenuItem>
                                    <MenuItem value='hardware change'>Hardware Change</MenuItem>
                                </Select>
                                <FormHelperText sx={{ color: '#D32F2F', ml: 0 }}>
                                    {formik.errors.type && formik.touched.type ? formik.errors.type : ""}
                                </FormHelperText>
                            </FormControl>
                        </Grid>

                        {/* priority */}
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="label-status">Priority *</InputLabel>
                                <Select
                                    labelId="label-status"
                                    name="priority"
                                    label="Priority *"
                                    value={formik.values.priority}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <MenuItem value='high'>High</MenuItem>
                                    <MenuItem value='medium'>Medium</MenuItem>
                                    <MenuItem value='low'>Low</MenuItem>
                                </Select>
                                <FormHelperText sx={{ color: '#D32F2F', ml: 0 }}>
                                    {formik.errors.priority && formik.touched.priority ? formik.errors.priority : ""}
                                </FormHelperText>
                            </FormControl>
                        </Grid>

                        {/* dueDate */}
                        <Grid item xs={12} sm={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <FormControl fullWidth margin="normal">
                                    <DesktopDatePicker
                                        label="Due Date *"
                                        disablePast={true}
                                        inputFormat="DD/MM/YYYY"
                                        disableMaskedInput={true}
                                        value={formik.values.dueDate}
                                        onChange={(value) => {
                                            {
                                                value == null || value.$d.toString() == 'Invalid Date' ?
                                                    formik.setFieldValue('dueDate', '') :
                                                    formik.setFieldValue('dueDate', value.$d.toString())
                                            }
                                        }}
                                        renderInput={(params) => <TextField {...params} error={false} />}
                                        sx={{ mb: 0 }}
                                    />
                                    <FormHelperText sx={{ color: '#D32F2F', ml: 0 }}>
                                        {formik.errors.dueDate}
                                    </FormHelperText>
                                </FormControl>
                            </LocalizationProvider>
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
                                    value={formik.values.status}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <MenuItem value='created'>Created</MenuItem>
                                    <MenuItem value='open'>Open</MenuItem>
                                    <MenuItem value='in process'>In Process</MenuItem>
                                    <MenuItem value='released'>Released</MenuItem>
                                    <MenuItem value='canceled'>Canceled</MenuItem>
                                    <MenuItem value='completed'>Completed</MenuItem>
                                </Select>
                                <FormHelperText sx={{ color: '#D32F2F', ml: 0 }}>
                                    {formik.errors.status && formik.touched.status ? formik.errors.status : ""}
                                </FormHelperText>
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
                                value={formik.values.emailId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                sx={{ mb: 0 }}
                            />
                            <FormHelperText sx={{ color: '#D32F2F' }}>
                                {formik.errors.emailId && formik.touched.emailId
                                    ? formik.errors.emailId : ""}
                            </FormHelperText>
                        </Grid>

                        {/* contactNumber */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                margin="normal"
                                name="contactNumber"
                                label="Contact Number"
                                type="number"
                                value={formik.values.contactNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                sx={{ mb: 0 }}
                            />
                            <FormHelperText sx={{ color: '#D32F2F' }}>
                                {formik.errors.contactNumber && formik.touched.contactNumber ?
                                    formik.errors.contactNumber : ""}
                            </FormHelperText>
                        </Grid>

                        {/* description */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                multiline
                                margin="normal"
                                name="description"
                                label="Description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                sx={{ mb: 0 }}
                            />
                            <FormHelperText sx={{ color: '#D32F2F' }}>
                                {formik.errors.description && formik.touched.description ?
                                    formik.errors.description : ""}
                            </FormHelperText>
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