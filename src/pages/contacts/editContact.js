import * as yup from 'yup';
import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import Cookies from 'js-cookie';
import '../../style/style.css'
import { Server_URL } from '../../utils/urls.js';
import { ContextSnackbar } from '../../context/snackbarContext.js';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';


export default function EditContact() {

    const { _id } = useParams();
    const token = Cookies.get('auth_token');
    const navigate = useNavigate();
    const { setSnackbar } = useContext(ContextSnackbar);
    const [contact, setContact] = useState({});

    // load contact
    useEffect(() => {

        fetch(`${Server_URL}/contact/getById/${_id}`, {
            headers: { "token": token }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    setContact(res.data);
                    console.log(res.data);
                } else if (res.status >= 400 && res.status < 500) {
                    setSnackbar({ open: true, message: res.msg, severity: 'error' });
                    navigate('/contacts');
                }
            })
    }, []);


    return (
        <Box sx={{ mt: 8, width: "100%" }}>

            {Object.keys(contact).length === 0
                ?
                <Stack justifyContent="center" alignItems="center" minHeight="90%">
                    <CircularProgress />
                </Stack>
                :
                <EditForm contact={contact} setSnackbar={setSnackbar} navigate={navigate} token={token} />
            }

        </Box >
    )
}


function EditForm({ contact, setSnackbar, navigate, token }) {

    const [loading, setLoading] = useState(false);

    const formik = useFormik({

        initialValues: {
            firstname: contact.firstname,
            lastname: contact.lastname,
            company: contact.company,
            position: contact.position,
            email: contact.email,
            phoneNumber: contact.phoneNumber,
            description: contact.description,
            line1: contact.line1,
            street: contact.street,
            city: contact.city,
            state: contact.state,
            postcode: contact.postcode,
            country: contact.country,
        },

        validationSchema: yup.object().shape({
            firstname: yup.string().required("required").min(4, "too small"),
            lastname: yup.string().min(4, "too small"),
            company: yup.string(),
            position: yup.string(),
            email: yup.string().required("required")
                .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "not a valid id"),
            phoneNumber: yup.string().required("required"),
            description: yup.string(),
            line1: yup.string(),
            street: yup.string().required("required"),
            city: yup.string().required("required"),
            state: yup.string().required("required"),
            postcode: yup.string().required("required"),
            country: yup.string().required("required"),
        }),

        onSubmit: (value, { resetForm }) => {

            setLoading(true);

            try {
                fetch(`${Server_URL}/contact/update/${contact._id}`, {
                    method: "PUT",
                    body: JSON.stringify({ _id: contact._id, ...value }),
                    headers: {
                        "Content-Type": "application/json",
                        "token": token
                    }
                })
                    .then(res => res.json())
                    .then((res) => {
                        resetForm(value);
                        setLoading(false);
                        if (res.status >= 200 && res.status < 300) {
                            setSnackbar({ open: true, message: res.msg, severity: 'success' });
                            navigate('/contacts');
                        } else if (res.status >= 300 && res.status < 400) {
                            setSnackbar({ open: true, message: res.msg, severity: 'error' });
                            navigate(res.navigate);
                        } else if (res.status >= 400 && res.status < 500) {
                            setSnackbar({ open: true, message: res.msg, severity: 'error' });
                        }
                    })
            } catch (error) {
                throw (error.message)
            }
        }
    })

    return (
        <Box className='fadeIn'>

            {/* title bar */}
            <Paper sx={{ pl: 2, pr: 4, py: 1, backgroundColor: '#F9FAFB' }}>
                <Grid container justifyContent='space-between' alignItems="center">

                    {/* title */}
                    <Grid item>
                        <Typography variant='h5' sx={{ fontWeight: 'bold' }} >Edit Contact</Typography>
                    </Grid>

                    {/* buttons */}
                    <Grid item>
                        <Button variant="outlined" sx={{ fontSize: '15px', fontWeight: 'bold' }}
                            onClick={() => navigate(-1)} startIcon={<ClearIcon />}>Cancel</Button>
                        <Button type="submit" variant="contained"
                            sx={{ marginLeft: 2, fontSize: '15px', fontWeight: 'bold' }}
                            onClick={formik.handleSubmit} startIcon={<FileDownloadDoneIcon />}
                            disabled={
                                formik.values.firstname !== contact.firstname ||
                                    formik.values.lastname !== contact.lastname ||
                                    formik.values.company !== contact.company ||
                                    formik.values.position !== contact.position ||
                                    formik.values.email !== contact.email ||
                                    formik.values.phoneNumber !== contact.phoneNumber ||
                                    formik.values.description !== contact.description ||
                                    formik.values.line1 !== contact.line1 ||
                                    formik.values.street !== contact.street ||
                                    formik.values.city !== contact.city ||
                                    formik.values.state !== contact.state ||
                                    formik.values.postcode !== contact.postcode ||
                                    formik.values.country !== contact.country
                                    ? false : true
                            }
                        >
                            Update
                            {loading ? <CircularProgress size={20} thickness={5} sx={{ marginLeft: 1, color: "white" }} /> : ""}
                        </Button>

                    </Grid>

                </Grid>
            </Paper>

            {/* form */}
            <Paper elevation={6} sx={{ m: 2 }}>
                <Box sx={{ paddingY: 5, paddingX: 5 }}>

                    {/* form */}
                    <form onSubmit={formik.handleSubmit}>
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
                                    name="firstname"
                                    variant="filled"
                                    value={formik.values.firstname}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    sx={{ mb: 0 }}
                                />
                                <FormHelperText sx={{ color: '#D32F2F' }}>
                                    {formik.errors.firstname && formik.touched.firstname ? formik.errors.firstname : ""}
                                </FormHelperText>
                            </Grid>

                            {/* lastname */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    margin="normal"
                                    label="Last Name"
                                    name="lastname"
                                    variant="filled"
                                    value={formik.values.lastname}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    sx={{ mb: 0 }}
                                />
                                <FormHelperText sx={{ color: '#D32F2F' }}>
                                    {formik.errors.lastname && formik.touched.lastname ? formik.errors.lastname : ""}
                                </FormHelperText>
                            </Grid>

                            {/* company */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    margin="normal"
                                    label="Company Name *"
                                    name="company"
                                    variant="filled"
                                    value={formik.values.company}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    sx={{ mb: 0 }}
                                />
                                <FormHelperText sx={{ color: '#D32F2F' }}>
                                    {formik.errors.company && formik.touched.company ? formik.errors.company : ""}
                                </FormHelperText>
                            </Grid>

                            {/* position */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    size="small"
                                    name="position"
                                    label="Position"
                                    type="text"
                                    variant="filled"
                                    value={formik.values.position}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    sx={{ mb: 0 }}
                                />
                                <FormHelperText sx={{ color: '#D32F2F' }}>
                                    {formik.errors.position && formik.touched.position ? formik.errors.position : ""}
                                </FormHelperText>
                            </Grid>

                            {/* email */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    size="small"
                                    name="email"
                                    label="Email-Id *"
                                    type="email"
                                    variant="filled"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    sx={{ mb: 0 }}
                                />
                                <FormHelperText sx={{ color: '#D32F2F' }}>
                                    {formik.errors.email && formik.touched.email ? formik.errors.email : ""}
                                </FormHelperText>
                            </Grid>

                            {/* phoneNumber */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    size="small"
                                    name="phoneNumber"
                                    label="Phone Number *"
                                    type="text"
                                    variant="filled"
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    sx={{ mb: 0 }}
                                />
                                <FormHelperText sx={{ color: '#D32F2F' }}>
                                    {formik.errors.phoneNumber && formik.touched.phoneNumber ? formik.errors.phoneNumber : ""}
                                </FormHelperText>
                            </Grid>

                            {/* description */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    margin="normal"
                                    size="small"
                                    name="description"
                                    label="Description"
                                    type="text"
                                    variant="filled"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    sx={{ mb: 0 }}
                                />
                                <FormHelperText sx={{ color: '#D32F2F' }}>
                                    {formik.errors.description && formik.touched.description ? formik.errors.description : ""}
                                </FormHelperText>
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
                                    name="line1"
                                    label="Line 1"
                                    type="text"
                                    variant="filled"
                                    value={formik.values.line1}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    sx={{ mb: 0 }}
                                />
                                <FormHelperText sx={{ color: '#D32F2F' }}>
                                    {formik.errors.line1 && formik.touched.line1
                                        ? formik.errors.line1 : ""}
                                </FormHelperText>
                            </Grid>

                            {/* street */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    size="small"
                                    name="street"
                                    label="Street *"
                                    type="text"
                                    variant="filled"
                                    value={formik.values.street}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    sx={{ mb: 0 }}
                                />
                                <FormHelperText sx={{ color: '#D32F2F' }}>
                                    {formik.errors.street && formik.touched.street
                                        ? formik.errors.street : ""}
                                </FormHelperText>
                            </Grid>

                            {/* city */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    size="small"
                                    name="city"
                                    label="City *"
                                    type="text"
                                    variant="filled"
                                    value={formik.values.city}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    sx={{ mb: 0 }}
                                />
                                <FormHelperText sx={{ color: '#D32F2F' }}>
                                    {formik.errors.city && formik.touched.city
                                        ? formik.errors.city : ""}
                                </FormHelperText>
                            </Grid>

                            {/* state */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    size="small"
                                    name="state"
                                    label="State *"
                                    type="text"
                                    variant="filled"
                                    value={formik.values.state}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    sx={{ mb: 0 }}
                                />
                                <FormHelperText sx={{ color: '#D32F2F' }}>
                                    {formik.errors.state && formik.touched.state
                                        ? formik.errors.state : ""}
                                </FormHelperText>
                            </Grid>

                            {/* postcode */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    size="small"
                                    name="postcode"
                                    label="Postcode *"
                                    type="text"
                                    variant="filled"
                                    value={formik.values.postcode}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    sx={{ mb: 0 }}
                                />
                                <FormHelperText sx={{ color: '#D32F2F' }}>
                                    {formik.errors.postcode && formik.touched.postcode
                                        ? formik.errors.postcode : ""}
                                </FormHelperText>
                            </Grid>

                            {/* country */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    size="small"
                                    name="country"
                                    label="Country *"
                                    type="text"
                                    variant="filled"
                                    value={formik.values.country}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    sx={{ mb: 0 }}
                                />
                                <FormHelperText sx={{ color: '#D32F2F' }}>
                                    {formik.errors.country && formik.touched.country
                                        ? formik.errors.country : ""}
                                </FormHelperText>
                            </Grid>

                        </Grid>
                    </form>

                </Box>
            </Paper>

        </Box >
    )
}