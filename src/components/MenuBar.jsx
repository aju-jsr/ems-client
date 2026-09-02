import { useRef, useState } from "react";
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

    const closeTimer = useRef(null);

    // Open/switch submenu
    const handleOpen = (event, menu) => {
        // Cancel pending close
        if (closeTimer.current) {
            clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }

        // Immediately switch to the new parent menu
        setAnchorEl(event.currentTarget);
        setCurrentMenu(menu);
    };

    const handleToggle = (event, menu) => {
        if (currentMenu?.label === menu.label && anchorEl === event.currentTarget) {
            setAnchorEl(null);
            setCurrentMenu(null);
            return;
        }

        handleOpen(event, menu);
    };

    // Close submenu
    const handleClose = () => {
        if (closeTimer.current) {
            clearTimeout(closeTimer.current);
        }

        closeTimer.current = setTimeout(() => {
            setAnchorEl(null);
            setCurrentMenu(null);
            closeTimer.current = null;
        }, 150);
    };

    // Keep menu open when mouse enters submenu
    const handleSubMenuEnter = () => {
        if (closeTimer.current) {
            clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
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
                flexWrap: { xs: "nowrap", md: "wrap" },
                bgcolor: "#6fa0e5",
                px: { xs: 1, md: 2 },
                py: 1,
                gap: { xs: 0.5, md: 0 },
                overflowX: { xs: "auto", md: "visible" },
                overflowY: "hidden",
                WebkitOverflowScrolling: "touch",

                "& .MuiButton-root": {
                    fontSize: menuFontSize,
                    fontWeight: "bold",
                    color: "#fff",
                    cursor: "pointer",
                    flex: "0 0 auto",
                    minWidth: { xs: "max-content", md: 64 },
                    px: { xs: 1, md: 1.5 },
                },

                "& .MuiButton-root:hover": {
                    color: "#fff",
                    backgroundColor: "rgba(255,255,255,0.12)",
                },
            }}
        >
            {/* =========================
                MAIN MENU BAR
            ========================= */}

            {menuConfig.map((menu) => {
                // Parent menu with children
                if (menu.children) {
                    return (
                        <Button
                            key={menu.label}
                            endIcon={<KeyboardArrowDownIcon />}
                            onMouseEnter={(event) =>
                                handleOpen(event, menu)
                            }
                            onClick={(event) =>
                                handleToggle(event, menu)
                            }
                            // FIX 1: Uncommented this so the timer triggers when leaving the button
                            onMouseLeave={handleClose} 
                            sx={{
                                fontSize: menuFontSize,
                                cursor: "pointer",
                            }}
                        >
                            {menu.label}
                        </Button>
                    );
                }

                // Logout
                if (menu.action === "logout") {
                    return (
                        <Button
                            key={menu.label}
                            sx={{
                                ml: { xs: 0, md: "auto" },
                                fontSize: menuFontSize,
                                cursor: "pointer",
                            }}
                            onClick={logout}
                            onMouseEnter={handleClose}
                        >
                            {menu.label}
                        </Button>
                    );
                }

                // Normal menu
                return (
                    <Button
                        key={menu.label}
                        disabled={!hasPermission(menu.permission)}
                        onClick={() => navigate(menu.path)}
                        onMouseEnter={handleClose}
                        sx={{
                            fontSize: menuFontSize,
                            cursor: "pointer",
                        }}
                    >
                        {menu.label}
                    </Button>
                );
            })}

            {/* =========================
                SINGLE SUB MENU
            ========================= */}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl && currentMenu)}
                onClose={handleClose}
                onMouseEnter={handleSubMenuEnter}
                onMouseLeave={handleClose}
                disableAutoFocusItem
                // FIX 2: Stop root/backdrop from blocking mouse hover events, reset it on paper
                slotProps={{
                    root: {
                        sx: { pointerEvents: "none" }
                    },
                    paper: {
                        sx: {
                            pointerEvents: "auto", // Crucial so clicks/hovers work inside the dropdown
                            "& .MuiMenuItem-root": {
                                fontSize: menuFontSize,
                                fontWeight: "bold",
                                color: "#fff",
                                backgroundColor: "#6bacee",
                                minHeight: "32px",
                                borderBottom:
                                    "1px solid rgba(255,255,255,0.4)",
                                cursor: "pointer",
                            },

                            "& .MuiMenuItem-root:hover": {
                                backgroundColor: "#6bacee",
                                color: "#fff",
                                cursor: "pointer",
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
                {currentMenu?.children?.map((item) => {
                    const Icon = item.icon;

                    return (
                        <MenuItem
                            key={item.label}
                            disabled={!hasPermission(item.permission)}
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
