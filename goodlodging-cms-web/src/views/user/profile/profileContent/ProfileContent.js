import React, { useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../utils/router/Router';
import "./style.scss";
import defaultAvatar from "../../../../assets/images/defaultAvatar.jpg";

const ProfileContent = () => {
    const { user, isLogin, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Chỉ chạy logic sau khi loading hoàn tất
        if (!loading) {
            if (!isLogin || !user) {
                alert("Vui lòng đăng nhập");
                navigate(`/${ROUTERS.AUTH.LOGIN}`);
            }
        }
    }, [isLogin, user, loading, navigate]);

    if (loading) {
        return <div className="loading">Đang tải thông tin...</div>;
    }

    if (!isLogin || !user) {
        return null;
    }

    return (
        <form className='container__profile'>
            <h2>Thông tin cá nhân</h2>
            <label htmlFor="firstName">Họ</label>
            <input type="text" defaultValue={user.firstName || ''} name='firstName' />
            <label htmlFor="lastName">Tên</label>
            <input type="text" defaultValue={user.lastName || ''} name='lastName' />
            <div className="container__image">
                <img src={user.imageUrl || defaultAvatar} alt="Avatar" />
                <button type="button">Tải lên hình ảnh</button>
            </div>
            <label htmlFor="email" name="email">Email</label>
            <div className="container__email">
                <input type='email' name='email' defaultValue={user.email || ""} />
                <button type="button">Cập nhật</button>
            </div>
            <label htmlFor="phone">Số điện thoại</label>
            <input type="text" name='phone' defaultValue={user.phone || ""} />
            <label>Giới tính</label>
            <div className="container__gender">
                <input type="radio" name="gender" value="male" defaultChecked={user.gender === "male"} /> Nam
                <input type="radio" name="gender" value="female" defaultChecked={user.gender === "female"} /> Nữ
            </div>
            <label htmlFor="birthDay">Ngày sinh</label>
            <input type="date" name="birthDay" defaultValue={user.birthday || ""} />
            <div className="container__button">
                <button type="button">Đổi mật khẩu</button>
                <button type="submit">Lưu thay đổi</button>
            </div>
        </form>
    );
};

export default ProfileContent;