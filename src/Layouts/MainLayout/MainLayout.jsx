import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../pages/shared/Navbar/Navbar';
import Footer from '../../pages/shared/Footer/Footer';

const MainLayout = () => {
    return (
        <div>
            <header className='sticky z-50 top-0'>
                <Navbar></Navbar>
            </header>
            <main>
                <Outlet></Outlet>
            </main>
            <footer>
                <Footer></Footer>
            </footer>
        </div>
    );
};

export default MainLayout;