import React from 'react';
import { memo } from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { Outlet } from 'react-router-dom';
const MasterLayout = ({children, ...props}) => {
    return (
        <div {...props} className='master_layout'> 
            <Header/>
            <Outlet/>
            <Footer/>
        </div>
    );
};

export default memo(MasterLayout);