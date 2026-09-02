import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import Header from "./Header";
import MenuBar from "./MenuBar";

export default function MainLayout() {

    return (

        <Box sx={{ width: "100%", minWidth: 0 }}>

            <Header />

            <MenuBar />

            <Outlet />

        </Box>

    );

}
