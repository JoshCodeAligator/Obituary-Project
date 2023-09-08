//import { Outlet } from "react-router-dom";
import Overlay from './Overlay.js';
import Obituaries from "./Obituaries.js";
import Navbar from './Navbar.js';

export default function Layout() {
    return (
        <>
            <Navbar/>
            <Obituaries/>
            <Overlay/>
        </>
    )
}

