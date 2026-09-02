import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  TextField,
  Select,
  Button,
  Box,
  Alert,
  Typography,
  Autocomplete
} from "@mui/material";

import '../styles/event.css';
import { formControl3rows, formControl2rows } from "../styles/commonStyles";
import SectionCard from "../components/SectionCard";
import { useHeader } from "../components/HeaderContext.jsx";
import { ROLE_PERMISSIONS } from "../config/rolePermissions";

import { useState } from "react";

// import useLogin from "../hooks/useLogin";
import useUpdate from "../hooks/useUserPatch";

import { useNavigate, Link } from "react-router-dom";
// Get Employees
import useEmpolyees from "../hooks/useEmpolyee";
// Get Roles
import useRoles from "../hooks/useRoles";


export default function Login() {

     const { setHeaderTitle } = useHeader();
    setHeaderTitle("User Update");

    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [roleid, setRoleId] = useState("");

    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [loginResponse, setLoginResponse] = useState(null);
    const [loginError, setLoginError] = useState("");

    // Get Employees
    const { employees} = useEmpolyees();

    // Get Roles
     const { roles } = useRoles();

    const navigate = useNavigate();

    const {
        loading: proposalSubmitting,
        error: proposalSubmitError,
        userPATCH,
    } = useUpdate();

    const [formData, setFormData] = useState({
        
        employeeId: "",
        employeeName: "",
        password:"",
        role:""
        
    });

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
        // setRoleId(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitSuccess(false);
        setLoginError("");

        const proposalJson = {
            
            login_id: loginId === "" || loginId === undefined
                ? null
                : loginId,

            password: password === "" || password === undefined
                ? null
                : password,

            role_id: formData.role === "" || formData.role === undefined
                ? null
                : formData.role
        };

        try {
            // const response = await postLogin(proposalJson);
            const response = await userPATCH(proposalJson);
            setLoginResponse(response[0].message);
            formData.role = null;
            setPassword("");
            setLoginId("");
            
        } catch (error) {
            console.error(error);

            // If your API returns a message
            setLoginError(
                
                error.message   
            );
        }
    };

    return (
        <SectionCard title="">
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "60vh",
                    width: "100%",
                }}
            >
                <Box
                    component="fieldset"
                    sx={{
                        width: "100%",
                        maxWidth: 400,
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        p: { xs: 2, sm: 3 },
                        boxSizing: "border-box",
                    }}
                >
                    <legend
                        style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            padding: "0 10px",
                        }}
                    >
                        Login
                    </legend>

                    <Grid container spacing={2}>
                        {/* Emp Id or Login ID Auto Complete */}
                        <Grid size={{ xs: 12 }}>
                            <Autocomplete
                                options={employees}
                                getOptionLabel={(option) => option.emp_id.toString()}
                                value={
                                    employees.find(
                                        (emp) => emp.emp_id === formData.employeeId
                                    ) || null
                                }
                                
                                onChange={(event, newValue) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        employeeId: newValue?.emp_id || "",
                                        employeeName: newValue?.emp_name || "",
                                        // manager_id: newValue?.manager_id || "",
                                    }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Login Id"
                                        required
                                        value={loginId}
                                        onChange={(e) => setLoginId(e.target.value)}

                                    />
                                )}
                            />
                        </Grid>

                        {/* Password */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                
                                label="Password"
                                type="password"
                                
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </Grid>

                        {/* Role */}
                        <Grid size={{ xs: 12 }}>
                            <FormControl fullWidth>
                                <InputLabel id="lblrole">Choose Role</InputLabel>
                                <Select
                                    labelId="lblrole"
                                    id="ddlrole"
                                    value={formData.role}
                                    required
                                    label="Choose Role"
                                    onChange={handleChange}
                                    name="role"
                                    // Controls the structural height of the selector input box
                                    sx={{
                                        height: 50,
                                        '& .MuiSelect-select': {
                                            height: 50,
                                            display: 'flex',
                                            alignItems: 'center',
                                            boxSizing: 'border-box',
                                        }
                                    }}
                                    // Limits the height of the expanded overlay list menu
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200,
                                            },
                                        },
                                    }}
                                >
                                    {roles.map((role) => (
                                        <MenuItem
                                            key={role.id}
                                            value={role.id}
                                        >
                                            {role.name}
                                        </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>

                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            {loginResponse && (
                                <Alert severity="success">
                                    {loginResponse}
                                </Alert>
                            )}
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            {loginError && (
                                <Alert severity="error">
                                    {loginError}
                                </Alert>
                            )}
                        </Grid>
                       
                        {/* Submit Button */}
                        <Grid size={{ xs: 12 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    mt: 2,
                                }}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        width: { xs: "100%", sm: 150 },
                                    }}
                                >
                                    UPDATE
                                </Button>
                            </Box>
                        </Grid>

                        {/* <Grid size={12}>
                            <Typography align="center">
                                Don't have an account?{" "}
                                <Link to="/register">
                                    Registration
                                </Link>
                            </Typography>
                        </Grid> */}

                    </Grid>
                </Box>
            </Box>
        </SectionCard>
    );
}
