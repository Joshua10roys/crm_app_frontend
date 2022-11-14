import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
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
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import ClearIcon from '@mui/icons-material/Clear';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import '../../style/style.css';
import { ContextSnackbar } from '../../context/snackbarContext.js';
import { ContextUser } from '../../context/userContext.js';
import { Server_URL } from '../../utils/urls';


export default function AddUser() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { setSnackbar } = useContext(ContextSnackbar);
    const { user } = useContext(ContextUser);

    const formik = useFormik({

        initialValues: {
            username: "",
            firstname: "",
            lastname: "",
            password: "",
            confirm_password: "",
            userType: ""
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
            lastname: yup
                .string(),
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
                fetch(`${Server_URL}/users/addUser`, {
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
                        } else if (res.status >= 300 && res.status < 400) {
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
        <Box sx={{ mt: 8, width: "100%" }} className='fadeIn'>

            <Paper sx={{ pl: 2, pr: 4, py: 1, backgroundColor: '#F9FAFB' }}>
                <Grid container justifyContent='space-between' alignItems="center">

                    {/* title */}
                    <Grid item>
                        <Typography variant='h5' sx={{ fontWeight: 'bold' }} >Add User</Typography>
                    </Grid>

                    {/* buttons */}
                    <Grid item>
                        <Button variant="outlined" sx={{ fontSize: '15px', fontWeight: 'bold' }}
                            onClick={() => navigate(-1)} startIcon={<ClearIcon />}>Cancel</Button>
                        <Button type="submit" variant="contained" sx={{ marginLeft: 2, fontSize: '15px', fontWeight: 'bold' }}
                            onClick={formik.handleSubmit} startIcon={<PersonAddAlt1Icon />}
                            disabled={loading}>
                            Add
                            {loading ? <CircularProgress size={20} thickness={5} sx={{ marginLeft: 1, color: "white" }} /> : ""}
                        </Button>
                    </Grid>

                </Grid>
            </Paper>

            <Container>
                <Paper elevation={6} sx={{
                    marginTop: 5, marginBottom: 3, padding: 5, display: 'flex',
                    flexDirection: 'column', alignItems: 'center'
                }}>

                    {/* user icon and text */}
                    <Stack direction='row' alignItems='center' >
                        <Avatar sx={{ m: 1, mb: 2, bgcolor: 'rgb(25, 118, 210)' }}>
                            <GroupAddIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Add User
                        </Typography>
                    </Stack>

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
                                        {user.userType === 'admin' && <MenuItem value="admin">Admin</MenuItem>}
                                        {user.userType === 'admin' && <MenuItem value="manager">Manager</MenuItem>}
                                        <MenuItem value="employee">Employee</MenuItem>
                                        <MenuItem value="view only">View Only</MenuItem>
                                    </Select>
                                    <FormHelperText>
                                        {formik.errors.userType && formik.touched.userType ? formik.errors.userType : ""}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>

                    </form>

                </Paper>
            </Container>
        </Box>
    );
}