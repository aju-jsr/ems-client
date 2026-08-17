import { Outlet } from "react-router-dom";

import SimpleHeader from "./SimpleHeader";

export default function LoginLayout() {

    return (

        <>

            <SimpleHeader />

            <Outlet />

        </>

    );

}