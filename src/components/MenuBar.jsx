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
    const menuFontSize = "13px";

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
                // bgcolor: "#e4e9ee",
                bgcolor: "#6fa0e5",
                px: 2,
                py: 1,

                "& .MuiButton-root": {
                    fontSize: menuFontSize,
                    fontWeight: "bold",
                    color: "#fff",
                },

                // Button hover
                "& .MuiButton-root:hover": {
                    color: "#fff",
                    backgroundColor: "rgba(255,255,255,0.12)",
                },
            }}
        >

            {menuConfig.map(menu => {

                if (menu.children) {

                    return (

                        <Button
                            key={menu.label}
                            endIcon={<KeyboardArrowDownIcon />}
                            onClick={(e) => handleOpen(e, menu)}
                            sx={{
                                fontSize: menuFontSize,
                            }}
                        >
                            {menu.label}
                        </Button>

                    );
                }
                if (menu.action === "logout") {

                    return (

                        <Button
                            key={menu.label}
                            sx={{ 
                                ml: "auto",
                                fontSize: menuFontSize,
                             }}
                            onClick={logout}
                        >
                            {menu.label}
                        </Button>

                    );

                }

                return (

                    <Button
                        key={menu.label}
                        disabled={!hasPermission(menu.permission)}
                        onClick={() => navigate(menu.path)}
                        sx={{
                            fontSize: menuFontSize,
                        }}
                    >
                        {menu.label}
                    </Button>
                );
            })}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}

                slotProps={{
                    paper: {
                        sx: {
                            "& .MuiMenuItem-root": {
                                fontSize: menuFontSize,
                                fontWeight: "bold",
                                color: "#fff",
                                backgroundColor: "#6bacee",
                                minHeight: "32px",
                                borderBottom: "1px solid rgba(255,255,255,0.4)",
                            },

                            "& .MuiMenuItem-root:hover": {
                                backgroundColor: "#6bacee",
                                color: "#fff",
                            },

                            "& .MuiListItemText-primary": {
                                fontSize: menuFontSize,
                                fontWeight: "bold",
                                color: "#fff",
                            },

                            "& .MuiListItemIcon-root": {
                                minWidth: "30px",
                                color: "#fff",
                            },
                        },
                    },
                }}
            >

                {currentMenu?.children.map(item => {

                    const Icon = item.icon;

                    return (

                        <MenuItem
                            key={item.label}
                            disabled={!hasPermission(item.permission)}
                            fontSize={menuFontSize}
                            onClick={() => {

                                navigate(item.path);
                                
                                handleClose();

                            }}
                        >

                            <ListItemIcon>
                                <Icon />
                            </ListItemIcon>

                           <ListItemText
                                primary={item.label}
                        />
                        </MenuItem>

                    );

                })}

            </Menu>

        </Box>

    );

}