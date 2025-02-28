import React from 'react';
import { memo } from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
const MasterLayout = ({children, ...props}) => {
    return (
        <div {...props} className='container'> 
            <Header/>
            {
                children
            }
            <Footer/>
        </div>
    );
};

export default memo(MasterLayout);