import React from 'react';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';
import LoadingItem from '../../../components/common/loading/LoadingItem';
import { ROUTERS } from '../../../utils/router/Router';
const HomePage = () => {
    const navigate=useNavigate();
    return (
        <div className='container__home'>
            <div className="container__search__bar">
                
            </div>
        </div>
    );
};

export default memo(HomePage);