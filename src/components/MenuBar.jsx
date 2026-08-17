import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHeader } from "./HeaderContext";

import {
    Box,
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { menuConfig } from "../config/menuConfig";

export default function MenuBar() {
    const { setHeaderTitle } = useHeader();

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const permissions = user?.permissions || [];

    const hasPermission = (permission) =>
        !permission || permissions.includes(permission);

    const [anchorEl, setAnchorEl] = useState(null);

    const [currentMenu, setCurrentMenu] = useState(null);

    const handleOpen = (event, menu) => {

        setAnchorEl(event.currentTarget);

        setCurrentMenu(menu);

    };

    const handleClose = () => {

        setAnchorEl(null);

        setCurrentMenu(null);

    };

    const logout = () => {

        localStorage.clear();

        navigate("/login");

    };

    return (

        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#e4e9ee",
                px: 2,
                py: 1
            }}
        >

            {menuConfig.map(menu => {
                // if (menu.label === 'Reports' || menu.label === 'Registration'){
                //     return(
                //         <Button
                //             key={menu.label}
                            
                //         >

                //             {menu.label}

                //         </Button>
                //     );
                // }

                if (menu.children) {

                    return (

                        <Button
                            key={menu.label}
                            // color="inherit"
                            
                            endIcon={<KeyboardArrowDownIcon />}
                            onClick={(e) => handleOpen(e, menu)}
                        >

                            {menu.label}

                        </Button>

                    );

                }

                if (menu.action === "logout") {

                    return (

                        <Button
                            key={menu.label}
                            // color="inherit"
                            sx={{ ml: "auto" }}
                            onClick={logout}
                        >

                            {menu.label}

                        </Button>

                    );

                }

                return (

                    <Button
                        key={menu.label}
                        // color="inherit"
                        disabled={!hasPermission(menu.permission)}
                        onClick={() => navigate(menu.path)}
                    >

                        {menu.label}

                    </Button>

                );

            })}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >

                {currentMenu?.children.map(item => {

                    const Icon = item.icon;

                    return (

                        <MenuItem
                            key={item.label}
                            disabled={!hasPermission(item.permission)}
                            onClick={() => {

                                navigate(item.path);
                                if(item.path === '/event_budget_proposal_rm'){
                                    // localStorage.setItem("title", "Budget Proposal - RM Approval")
                                    setHeaderTitle("Budget Proposal - RM Approval");
                                }else if(item.path === '/event_budget_proposal_fin'){
                                    // localStorage.setItem("title", "Budget Proposal - Finance")
                                    setHeaderTitle("Budget Proposal - Finance");
                                }else if(item.path === '/event_budget_proposal'){
                                    setHeaderTitle("Budget Proposal");
                                }
                                handleClose();

                            }}
                        >

                            <ListItemIcon>

                                <Icon />

                            </ListItemIcon>

                            <ListItemText>

                                {item.label}

                            </ListItemText>

                        </MenuItem>

                    );

                })}

            </Menu>

        </Box>

    );

}