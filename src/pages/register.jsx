import { useState } from "react";
import {
 Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from "@mui/material";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import useRoles from "../hooks/useRoles";

import { useHeader } from "../components/HeaderContext.jsx";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/registe";

export default function Register() {
  const { setHeaderTitle } = useHeader();
  setHeaderTitle("User Registration");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role:""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { roles } = useRoles();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const API_URL= API_DOMAIN + API;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    try {

      await axios.post(
        // "http://localhost:3000/api/registe",
        API_URL,
        {
          login_id: formData.username,
          password: formData.password,
          role_id: formData.role
        },
        {
        headers: {
          "Content-Type": "application/json",
        },
      }
      );

      setSuccess("User registered successfully.");

      // setTimeout(() => {
      //   navigate("/login");
      // }, 1500);

    } catch (err) {

      setError(
        err.response?.data?.message || "Registration failed."
      );

    }

  };

  return (
      <Box
          sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "70vh", // Centers vertically
          }}
      >
        
      <Paper sx={{ p: 4, width: 400,  }} elevation={4}>
{/* 
        <Typography
          variant="h5"
          align="center"
          mb={3}
        >
          User Registration
        </Typography> */}
        <fieldset>
            <legend>User Registration</legend>
            {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>

          <Grid container spacing={2}>

            <Grid size={12}>
              <TextField
                fullWidth
                required
                label="Login Id"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                required
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                required
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth required>
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

            <Grid size={12}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
              >
                Register
              </Button>
            </Grid>

            <Grid size={12}>
              <Typography align="center">
                Already have an account?{" "}
                <Link to="/login">
                  Login
                </Link>
              </Typography>
            </Grid>

          </Grid>

        </Box>
        </fieldset>
        

      </Paper>
    </Box>
  );
}