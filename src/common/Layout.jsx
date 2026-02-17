import React from 'react'
import Header from '../component/Header.jsx';
import Footer from '../component/Footer.jsx';
import { Outlet } from 'react-router-dom';
const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
