import '../../style/style.css';
import { Server_URL } from '../../utils/urls.js';
import { ContextSnackbar } from '../../context/snackbarContext.js';
import { ContextAuth } from '../../context/authContext.js';
import { ContextUser } from '../../context/userContext.js';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from "formik";
import Cookies from 'js-cookie';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import LockOpenIcon from '@mui/icons-material/LockOpen';


export default function Login() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { setSnackbar } = useContext(ContextSnackbar);
    const { setAuth } = useContext(ContextAuth);
    const { setUser } = useContext(ContextUser);

    const loginFunction = async (res) => {

        Cookies.set('auth_token', res.token, { expires: 1, path: '/', sameSite: 'strict' });
        localStorage.setItem('id', res.user._id);

        await setUser(res.user);
        await setAuth(true);
        await setSnackbar({ open: true, message: res.msg, severity: 'success' });
        navigate('/dashboard');
    }

    // formil hook
    const formik = useFormik({

        initialValues: { username: "", password: "" },

        validationSchema: yup.object({
            username: yup
                .string()
                .required("required ")
                .min(4, "too small"),
            password: yup
                .string()
                .required("required")
                .min(8, "Need a bigger password")
                .max(12, "less than 12 character"),
        }),

        onSubmit: (value, { resetForm }) => {

            setLoading(true)
            try {
                fetch(`${Server_URL}/users/login`, {
                    method: "POST",
                    body: JSON.stringify(value),
                    headers: { "Content-type": "application/json" }
                })
                    .then(res => res.json())
                    .then((res) => {
                        resetForm(value);
                        setLoading(false);
                        if (res.status >= 200 && res.status < 300) {
                            loginFunction(res);
                        } else if (res.status >= 400 && res.status < 500) {
                            setSnackbar({ open: true, message: res.msg, severity: 'error' });
                        } else {
                            setSnackbar({ open: true, message: 'Something went wrong.\nPlease try again', severity: 'warning' });
                        }
                    })
            } catch (error) { throw (error) }
        }
    })

    return (
        <>
            {/* main conatiner */}
            <Container maxWidth="xs" className='fadeIn'>
                <Paper elevation={6}>
                    <Box sx={{
                        marginTop: '20vh', padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center'
                    }}>

                        {/* login icon */}
                        <Avatar sx={{ m: 1, bgcolor: 'rgb(25, 118, 210)' }}><LockOpenIcon /></Avatar>

                        {/* login text */}
                        <Typography component="h1" variant="h5">Login</Typography>

                        {/* form */}
                        <form onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>

                            {/* username */}
                            <TextField
                                fullWidth
                                size="small"
                                margin="normal"
                                label="Username"
                                name="username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                helperText={formik.errors.username && formik.touched.username ? formik.errors.username : ""}
                                error={formik.errors.username && formik.touched.username}
                            />

                            {/* password */}
                            <TextField
                                fullWidth
                                margin="normal"
                                size="small"
                                name="password"
                                label="Password"
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                helperText={formik.errors.password && formik.touched.password ? formik.errors.password : ""}
                                error={formik.errors.password && formik.touched.password}
                            />

                            {/* button submit */}
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                LOGIN
                            </Button>

                        </form>

                        <Grid container spacing={5}>
                            {/* link for forgot password page*/}
                            <Grid item xs>
                                <Link component="button" color="error" variant="body2"
                                    onClick={() => navigate('/user/forgotPassword')}
                                >Forgot password?</Link>
                            </Grid>
                            {/* link for Register page */}
                            <Grid item>
                                <Link component="button" variant="body2" onClick={() => navigate('/user/register')}>
                                    Click to Register
                                </Link>
                            </Grid>
                        </Grid>

                    </Box>

                    {/* linear progress bar */}
                    {loading ? <LinearProgress /> : null}

                </Paper>
            </Container>
        </>
    );
}