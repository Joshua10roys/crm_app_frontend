import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from "formik";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MailLockIcon from '@mui/icons-material/MailLock';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import '../../style/style.css';
import { Server_URL } from '../../utils/urls.js';
import { ContextSnackbar } from '../../context/snackbarContext.js';


export default function ForgotPassword() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { setSnackbar } = useContext(ContextSnackbar);

    // yup validation schema
    const formValidationSchema = yup.object({
        username: yup
            .string()
            .required("required")
            .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "not a valid id"),
        confirm_username: yup
            .string()
            .required("required")
            .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "not a valid id")
            .oneOf([yup.ref('username'), null], 'email not match')
    })

    const submit = (value, { resetForm }) => {
        setLoading(true);
        const { username } = value;
        try {
            fetch(`${Server_URL}/users/forgot_password`, {
                method: "POST",
                body: JSON.stringify({ username }),
                headers: { "Content-Type": "application/json" }
            })
                .then((res) => res.json())
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

    // formil hook
    const formik = useFormik({
        initialValues: { username: "", confirm_username: "", },
        validationSchema: formValidationSchema,
        onSubmit: submit
    })

    return (
        <>
            {/* main conatiner */}
            <Container component="main" maxWidth="xs" className='fadeIn'>
                <Paper elevation={6}>
                    <Box sx={{ marginTop: '20vh', padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        {/* icon */}
                        <Avatar sx={{ m: 1, bgcolor: 'rgb(25, 118, 210)' }}>
                            <MailLockIcon />
                        </Avatar>

                        {/* forgot text */}
                        <Typography component="h1" variant="h5">
                            Forgot Password
                        </Typography>

                        {/* description */}
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                            Enter the registered username, password reset link will be send through email
                        </Typography>

                        {/* form */}
                        <form component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>

                            {/* username */}
                            <TextField
                                fullWidth
                                autoFocus
                                size="small"
                                margin="normal"
                                label="Username"
                                name="username"
                                placeholder="email-id"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                helperText={formik.errors.username && formik.touched.username ? formik.errors.username : ""}
                                error={formik.errors.username && formik.touched.username}
                            />

                            {/* confirm username */}
                            <TextField
                                fullWidth
                                size="small"
                                margin="normal"
                                label="Confirm Username"
                                name="confirm_username"
                                value={formik.values.confirm_username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                helperText={formik.errors.confirm_username && formik.touched.confirm_username ? formik.errors.confirm_username : ""}
                                error={formik.errors.confirm_username && formik.touched.confirm_username}
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