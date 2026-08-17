import { Outlet } from "react-router-dom";

import Header from "./Header";
import MenuBar from "./MenuBar";

export default function MainLayout() {

    return (

        <>

            <Header />

            <MenuBar />

            <Outlet />

        </>

    );

}