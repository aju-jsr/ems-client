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
import { ROLE_PERMISSIONS } from "../config/rolePermissions";

import { useState, useEffect, useRef } from "react";

import useLogin from "../hooks/useLogin";

import { useNavigate, Link } from "react-router-dom";
// Header Component
import { useHeader } from "../components/HeaderContext.jsx";

export default function Login() {

    const loginIdRef = useRef(null);
    useEffect(() => {
        loginIdRef.current?.focus();
    }, []);

    const { setHeaderTitle } = useHeader();
    setHeaderTitle("Login");

    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");

    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [loginResponse, setLoginResponse] = useState(null);
    const [loginError, setLoginError] = useState("");

    const navigate = useNavigate();

    const {
        loading: proposalSubmitting,
        error: proposalSubmitError,
        postLogin,
    } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitSuccess(false);
        setLoginError("");

        const proposalJson = {
            login_id: loginId,
            password: password,
        };

        try {
            const response = await postLogin(proposalJson);

            const roleId = response.body.user.role_id;

            if (response.success) {
                localStorage.setItem("token", response.body.token);
                localStorage.setItem("login_id", response.body.user.username);
                localStorage.setItem("name", response.body.user.name);

                const user = {
                        "id": response.body.user.username,
                        "empId": response.body.user.username,
                        "name": response.body.user.name,
                        "role": response.body.user.role_id,
                        "manager_id": response.body.user.manager_id,
                        "permissions": ROLE_PERMISSIONS[roleId] || []
                        
                    };
                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );

                localStorage.setItem("titel", "Budget Proposal");
                navigate("/event_budget_proposal");
            } else {
                setLoginError(response.message || "Password is wrong.");
            }
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
                        {/* Login ID */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                required
                                label="Login ID"
                                inputRef={loginIdRef}
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                            />
                        </Grid>

                        {/* Password */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                required
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
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
                                    {proposalSubmitting ? "Login..." : "Login"}
                                    
                                </Button>
                            </Box>
                        </Grid>

                    </Grid>
                </Box>
            </Box>
        </SectionCard>
    );
}
