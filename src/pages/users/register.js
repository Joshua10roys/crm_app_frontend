import '../../style/style.css';
import * as React from 'react';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useFormik } from "formik";
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Server_URL } from '../../utils/urls';
import { useContext } from 'react';
import { ContextSnackbar } from '../../context/snackbarContext.js';


export default function Register() {

    // hooks
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { setSnackbar } = useContext(ContextSnackbar);
    // formik hook
    const formik = useFormik({

        initialValues: {
            username: "",
            firstname: "",
            lastname: "",
            password: "",
            confirm_password: "",
            userType: "view only"
        },

        validationSchema: yup.object().shape({
            username: yup
                .string()
                .required("required ")
                .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "not a valid id"),
            firstname: yup
                .string()
                .required("required ")
                .min(4, "too small"),
            password: yup
                .string()
                .required("required")
                .min(8, "Need a bigger password")
                .max(12, "less than 12 character"),
            confirm_password: yup
                .string()
                .required("required")
                .oneOf([yup.ref('password'), null], 'Passwords must match'),
            userType: yup
                .string()
                .required("required")
        }),

        onSubmit: (value, { resetForm }) => {

            setLoading(true);
            const { confirm_password, ...data } = value;

            try {
                fetch(`${Server_URL}/users/register`, {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: { "Content-Type": "application/json" }
                })
                    .then(res => res.json())
                    .then((res) => {
                        resetForm(value);
                        setLoading(false);
                        if (res.status >= 200 && res.status < 300) {
                            setSnackbar({ open: true, message: res.msg, severity: 'success' });
                            navigate('/user/login');
                        }
                        else if (res.status >= 400 && res.status < 500) {
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
        <Container className='fadeIn'>
            <Paper elevation={6} >
                <Box sx={{
                    margin: '10vh', paddingTop: 5, paddingBottom: 2, paddingX: 3,
                    display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>

                    {/* user icon */}
                    <Avatar sx={{ m: 1, mb: 2, bgcolor: 'rgb(25, 118, 210)' }}><GroupAddIcon /></Avatar>

                    {/* add user text */}
                    <Typography component="h1" variant="h5">Add User</Typography>

                    {/* form */}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container rowSpacing={0} columnSpacing={{ xs: 1, sm: 10 }}>

                            {/* username */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    autoFocus
                                    size="small"
                                    margin="normal"
                                    label="Username"
                                    name="username"
                                    variant="standard"
                                    placeholder='email Id'
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.errors.username && formik.touched.username ? formik.errors.username : ""}
                                    error={formik.errors.username && formik.touched.username}
                                />
                            </Grid>

                            {/* firstname */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    margin="normal"
                                    label="First Name"
                                    name="firstname"
                                    variant="standard"
                                    value={formik.values.firstname}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.errors.firstname && formik.touched.firstname ? formik.errors.firstname : ""}
                                    error={formik.errors.firstname && formik.touched.firstname}
                                />
                            </Grid>

                            {/* lastname */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    margin="normal"
                                    label="Last Name"
                                    name="lastname"
                                    variant="standard"
                                    value={formik.values.lastname}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.errors.lastname && formik.touched.lastname ? formik.errors.lastname : ""}
                                    error={formik.errors.lastname && formik.touched.lastname}
                                />
                            </Grid>

                            {/* password */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    size="small"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    variant="standard"
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
                                    name="confirm_password"
                                    label="Confirm Password"
                                    type="password"
                                    variant="standard"
                                    value={formik.values.confirm_password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.errors.confirm_password && formik.touched.confirm_password ? formik.errors.confirm_password : ""}
                                    error={formik.errors.confirm_password && formik.touched.confirm_password}
                                />
                            </Grid>

                            {/* user type */}
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    disabled
                                    margin="normal"
                                    size="small"
                                    variant="standard"
                                    error={formik.errors.userType && formik.touched.userType}>
                                    <InputLabel id="select-label" sx={{ mt: 0 }}>User Type</InputLabel>
                                    <Select
                                        name="userType"
                                        labelId="select-label"
                                        label="User type"
                                        value={formik.values.userType}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <MenuItem value="view only">View Only</MenuItem>
                                    </Select>
                                    <FormHelperText>
                                        {formik.errors.userType && formik.touched.userType ? formik.errors.userType : ""}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>

                        {/* button submit */}
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}
                        >
                            Add User
                            {loading ? <CircularProgress size={20} thickness={5} sx={{ marginLeft: 1, color: "white" }} /> : ""}
                        </Button>

                    </form>

                </Box>
            </Paper>
        </Container>
    );
}