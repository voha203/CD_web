import React from 'react';
import Header from '../components/layout/header/Header';
import Footer from '../components/layout/footer/Footer';
import { Outlet } from 'react-router-dom';

function MainLayout() {
    return (
        <>
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

export default MainLayout;