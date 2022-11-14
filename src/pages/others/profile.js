import '../../style/style.css';
import { Server_URL } from '../../utils/urls.js';
import { ContextSnackbar } from '../../context/snackbarContext.js';
import { ContextUser } from '../../context/userContext.js';
import { ContextAuth } from '../../context/authContext.js';
import * as yup from 'yup';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import Cookies from 'js-cookie';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';


export default function Profile() {

    const { user, setUser } = useContext(ContextUser);

    return (
        <>
            <Box sx={{ mt: 8, width: "100%" }} className='fadeIn'>

                {/* title & button */}
                <Paper sx={{ pl: 2, pr: 4, py: 1, backgroundColor: '#F9FAFB' }}>
                    <Typography variant='h5' sx={{ fontWeight: 'bold' }} >Profile</Typography>
                </Paper>

                {user.firstname ? <UserDetails user={user} setUser={setUser} /> : <Progress />}

            </Box >
        </>
    )
}


// user details component
function UserDetails({ user, setUser }) {

    const navigate = useNavigate();
    const token = Cookies.get('auth_token');
    const [loading, setLoading] = useState(false);
    const [change, setChange] = useState(false);
    const { setSnackbar } = useContext(ContextSnackbar);
    const { setAuth } = useContext(ContextAuth);

    const formik = useFormik({

        initialValues: {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            contactNumber: user.contactNumber,
            address: user.address,
            city: user.city,
            state: user.state,
            postcode: user.postcode,
            country: user.country,
        },

        validationSchema: yup.object().shape({
            firstname: yup
                .string()
                .required("required ")
                .min(4, "too small"),
            lastname: yup
                .string(),
            email: yup
                .string()
                .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "not a valid id"),
            contactNumber: yup
                .string(),
            address: yup
                .string(),
            city: yup
                .string(),
            state: yup
                .string(),
            postcode: yup
                .string(),
            country: yup
                .string(),
        }),

        onSubmit: (value) => {

            setLoading(true);

            try {
                fetch(`${Server_URL}/users/edit/${user._id}`, {
                    method: "PATCH",
                    body: JSON.stringify(value),
                    headers: {
                        'Content-Type': 'application/json',
                        "token": token,
                    }
                })
                    .then(res => res.json())
                    .then((res) => {
                        setLoading(false);
                        if (res.status >= 200 && res.status < 300) {
                            setSnackbar({ open: true, message: res.msg, severity: 'success' });
                            setUser(res.user);
                        }
                        else if (res.status >= 400 && res.status < 500) {
                            navigate(res.redirect);
                        }
                        else {
                            setSnackbar({ open: true, message: 'Something went wrong.\nPlease try again', severity: 'warning' });
                        }
                    })
            } catch (error) {
                setLoading(false);
                throw (error.message);
            }
        }

    })

    return (
        <>
            <Paper elevation={6} sx={{ m: 2, px: 4, py: 4 }} >

                {/* icon & name */}
                <Stack direction='row' justifyContent='center' alignItems='center'>
                    <Avatar alt={user.firstname} src='.'
                        sx={{ my: 1, mr: 2, bgcolor: 'rgb(25, 118, 210)', alignItems: 'center' }}
                    />
                    <Typography component="h5" variant="h5">
                        {user.firstname + ' ' + user.lastname}
                    </Typography>
                    <Typography component="h5" variant="h5" pl={1}>
                        {'(' + user.userType + ')'}
                    </Typography>
                </Stack>

                {/* form */}
                <form onSubmit={formik.handleSubmit}>
                    <Grid container rowSpacing={1} columnSpacing={4} pt={2}>

                        {/* firstname */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                margin="normal"
                                label="First Name *"
                                name="firstname"
                                value={formik.values.firstname}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                helperText={formik.errors.firstname && formik.touched.firstname ? formik.errors.firstname : ""}
                                error={formik.errors.firstname && formik.touched.firstname}
                            />
                        </Grid>

                        {/* lastname */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                margin="normal"
                                label="Last Name *"
                                name="lastname"
                                value={formik.values.lastname}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                helperText={formik.errors.lastname && formik.touched.lastname ? formik.errors.lastname : ""}
                                error={formik.errors.lastname && formik.touched.lastname}
                            />
                        </Grid>

                        {/* email */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                margin="normal"
                                type="email"
                                label="E-mail"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                helperText={formik.errors.email && formik.touched.email ? formik.errors.email : ""}
                                error={formik.errors.email && formik.touched.email}
                            />
                        </Grid>

                        {/* contactNumber */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                margin="normal"
                                label="Contact Number"
                                name="contactNumber"
                                value={formik.values.contactNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                helperText={formik.errors.contactNumber && formik.touched.contactNumber ? formik.errors.contactNumber : ""}
                                error={formik.errors.contactNumber && formik.touched.contactNumber}
                            />
                        </Grid>

                        <Grid item xs={0} sm={8}></Grid>
                        <Grid item xs={12}><Divider /></Grid>

                        {/* address */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                margin="normal"
                                label="Address Line 1"
                                name="address"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                helperText={formik.errors.address && formik.touched.address ? formik.errors.address : ""}
                                error={formik.errors.address && formik.touched.address}
                            />
                        </Grid>

                        {/* city */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                margin="normal"
                                label="City"
                                name="city"
                                value={formik.values.city}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                helperText={formik.errors.city && formik.touched.city ? formik.errors.city : ""}
                                error={formik.errors.city && formik.touched.city}
                            />
                        </Grid>

                        {/* state */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                margin="normal"
                                label="State"
                                name="state"
                                value={formik.values.state}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                helperText={formik.errors.state && formik.touched.state ? formik.errors.state : ""}
                                error={formik.errors.state && formik.touched.state}
                            />
                        </Grid>

                        {/* country */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                margin="normal"
                                label="Country"
                                name="country"
                                value={formik.values.country}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                helperText={formik.errors.country && formik.touched.country ? formik.errors.country : ""}
                                error={formik.errors.country && formik.touched.country}
                            />
                        </Grid>

                        {/* postcode */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                margin="normal"
                                label="Postcode"
                                name="postcode"
                                value={formik.values.postcode}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                helperText={formik.errors.postcode && formik.touched.postcode ? formik.errors.postcode : ""}
                                error={formik.errors.postcode && formik.touched.postcode}
                            />
                        </Grid>

                    </Grid>
                </form>

                {/* buttons */}
                <Stack my={2} spacing={2} direction="row" justifyContent="flex-start" alignItems="center">
                    {/* cancel button */}
                    <Button variant="outlined" sx={{ fontSize: '15px', fontWeight: 'bold' }}
                        onClick={() => formik.resetForm()} disabled={loading} startIcon={<ClearIcon />} >Cancel</Button>
                    {/* update button */}
                    <Button variant="contained" sx={{ ml: 2, fontSize: '15px', fontWeight: 'bold', width: 100 }}
                        startIcon={<SaveIcon />} onClick={() => formik.handleSubmit()} disabled={
                            user.firstname !== formik.values.firstname ||
                                user.lastname !== formik.values.lastname ||
                                user.email !== formik.values.email ||
                                user.contactNumber !== formik.values.contactNumber ||
                                user.address !== formik.values.address ||
                                user.city !== formik.values.city ||
                                user.state !== formik.values.state ||
                                user.postcode !== formik.values.postcode ||
                                user.country !== formik.values.country
                                ? false : true}
                    >
                        {loading ?
                            <CircularProgress size={26} thickness={5} sx={{ marginLeft: 1, color: "white" }} />
                            : 'save'}
                    </Button>
                </Stack>

                <Divider />

                {/* credentials button */}
                <Button variant="contained" onClick={() => setChange(!change)}
                    sx={{ mt: 2, fontSize: '15px', fontWeight: 'bold' }}>
                    Change Password
                </Button>

                {change ? <UserCredentials user={user} token={token} setSnackbar={setSnackbar} /> : ''}

            </Paper></>
    )
}


function UserCredentials({ user, token, setSnackbar }) {

    const [loading, setLoading] = useState(false);

    const formik = useFormik({

        initialValues: {
            oldPassword: "",
            password: "",
            confirmPassword: ""
        },

        validationSchema: yup.object().shape({
            oldPassword: yup
                .string()
                .required("required")
                .min(8, "Need a bigger password")
                .max(12, "less than 12 character"),
            password: yup
                .string()
                .required("required")
                .min(8, "Need a bigger password")
                .max(12, "less than 12 character"),
            confirmPassword: yup
                .string()
                .required("required")
                .oneOf([yup.ref('password'), null], 'Passwords must match')
        }),

        onSubmit: (value, { resetForm }) => {

            setLoading(true);
            const { confirmPassword, ...data } = value;

            try {
                fetch(`${Server_URL}/users/changePassword/${user._id}`, {
                    method: "PATCH",
                    body: JSON.stringify(data),
                    headers: { "Content-Type": "application/json", "token": token }
                })
                    .then(res => res.json())
                    .then((res) => {
                        resetForm(value);
                        setLoading(false);
                        if (res.status === 200) {
                            setSnackbar({ open: true, message: res.msg, severity: 'success' });
                        }
                        else if (res.status === 400) {
                            setSnackbar({ open: true, message: res.msg, severity: 'error' });
                        }
                        else {
                            setSnackbar({ open: true, message: 'Something went wrong.\nPlease try again', severity: 'warning' });
                        }
                    })
            } catch (error) {
                throw (error.message)
            }
        }

    })
    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container rowSpacing={0} columnSpacing={{ xs: 1, sm: 10 }} sx={{ mt: 1 }}>

                {/* old password */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        margin="normal"
                        size="small"
                        name="oldPassword"
                        label="Old assword"
                        placeholder='enter old password'
                        type="password"
                        value={formik.values.oldPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        helperText={formik.errors.oldPassword && formik.touched.oldPassword ? formik.errors.oldPassword : ""}
                        error={formik.errors.oldPassword && formik.touched.oldPassword}
                    />
                </Grid>

                <Grid item xs={0} sm={6}></Grid>

                {/* password */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        margin="normal"
                        size="small"
                        name="password"
                        label="New Password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        helperText={formik.errors.password && formik.touched.password ? formik.errors.password : ""}
                        error={formik.errors.password && formik.touched.password}
                    />
                </Grid>

                {/* confirm password */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        margin="normal"
                        size="small"
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        helperText={formik.errors.confirmPassword && formik.touched.confirmPassword ? formik.errors.confirmPassword : ""}
                        error={formik.errors.confirmPassword && formik.touched.confirmPassword}
                    />
                </Grid>

            </Grid>

            {/* submit */}
            <Button variant="contained" sx={{ mt: 1, fontSize: '15px', fontWeight: 'bold', width: 100 }}
                onClick={() => formik.handleSubmit()} disabled={loading}
            >
                {loading ?
                    <CircularProgress size={26} thickness={5} sx={{ color: "white" }} />
                    : 'submit'}
            </Button>

        </form>
    )
}

// progress component
function Progress() {
    return (
        <Box sx={{ minHeight: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
    )
}