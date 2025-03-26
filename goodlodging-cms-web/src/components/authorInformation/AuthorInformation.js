import React from 'react';
import { AiOutlineMail } from 'react-icons/ai';
import { FiPhoneCall } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../utils/router/Router';
import "./style.scss"
const AuthorInformation = ({data,isNavigate=true}) => {
    const navigate=useNavigate();
    const handleNavigateToAuthorPosts=()=>{
        if (isNavigate) {
            navigate(ROUTERS.USER.AUTHOR_POST.replace(':id',data.id))
        }
    }
    return (
        <div className="container__author__information">
                        <div className="author__avatar" onClick={handleNavigateToAuthorPosts}>
                            <img src={data.imageUrl?data.imageUrl:"https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"} alt="Avatar" />
                        </div>
                        <p onClick={handleNavigateToAuthorPosts}>{data.fullName}</p>
                        <div className="author__email">
                            <AiOutlineMail/>
                            {data.email}</div>
                        <div className="author__phone">
                            <FiPhoneCall/>
                            {data.phoneNumber}
                        </div>
                    </div>
    );
};

export default AuthorInformation;