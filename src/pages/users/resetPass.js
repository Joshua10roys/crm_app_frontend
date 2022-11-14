import * as React from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from "formik";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import LockResetIcon from '@mui/icons-material/LockReset';
import '../../style/style.css';
import { Server_URL } from '../../utils/urls.js';
import { ContextSnackbar } from '../../context/snackbarContext.js';

export default function ResetPassword() {

    const navigate = useNavigate();
    // for random token
    const { randomToken } = useParams();
    // for progress
    const [loading, setLoading] = useState(false);
    // for snackbar
    const { setSnackbar } = useContext(ContextSnackbar);

    // yup validation schema
    const formValidationSchema = yup.object({
        password: yup
            .string()
            .required("required")
            .min(8, "Need a bigger password")
            .max(12, "less than 12 character"),
        confirm_password: yup
            .string()
            .required("required")
            .oneOf([yup.ref('password'), null], 'Passwords must match')

    })

    // formil hook
    const formik = useFormik({
        initialValues: { password: "", confirm_password: "", },
        validationSchema: formValidationSchema,
        onSubmit: (value, { resetForm }) => {

            setLoading(true);

            try {
                fetch(`${Server_URL}/users/reset_password/${randomToken}`, {
                    method: "POST",
                    body: JSON.stringify(value),
                    headers: { "Content-type": "application/json" }
                })
                    .then(res => res.json())
                    .then((res) => {
                        resetForm(value);
                        setLoading(false);
                        if (res.status >= 200 && res.status < 300) {
                            setSnackbar({ open: true, message: res.msg, severity: 'success' });
                            navigate('/user/login');
                        } else if (res.status >= 400 && res.status < 500) {
                            setSnackbar({ open: true, message: res.msg, severity: 'error' });
                        } else {
                            setSnackbar({ open: true, message: 'Something went wrong.\nPlease try again', severity: 'warning' });
                        }
                    })
            } catch (error) {
                throw (error)
            }
        }
    }
    )

    return (
        <>
            <Container component="main" maxWidth="xs" className='fadeIn'>
                <Paper elevation={6}>
                    <Box sx={{ marginTop: '20vh', padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        {/* icon */}
                        <Avatar sx={{ m: 1, bgcolor: 'rgb(25, 118, 210)' }}>
                            <LockResetIcon />
                        </Avatar>

                        {/* forgot text */}
                        <Typography component="h1" variant="h5">
                            Password Reset
                        </Typography>

                        {/* description */}
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                            Enter your new password
                        </Typography>

                        {/* form */}
                        <form component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>

                            {/* password */}
                            <TextField
                                fullWidth
                                autoFocus
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

                            {/* confirm password */}
                            <TextField
                                fullWidth
                                margin="normal"
                                size="small"
                                name="confirm_password"
                                label="Confirm Password"
                                type="password"
                                value={formik.values.confirm_password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                helperText={formik.errors.confirm_password && formik.touched.confirm_password ? formik.errors.confirm_password : ""}
                                error={formik.errors.confirm_password && formik.touched.confirm_password}
                            />

                            {/* button submit */}
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                Submit
                            </Button>

                        </form>
                    </Box>
                    {/* linear progress bar */}
                    {loading ? <LinearProgress /> : null}
                </Paper>
            </Container>
        </>
    );
}

