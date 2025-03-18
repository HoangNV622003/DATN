import React, { useEffect, useState } from "react";
import "./PostDetailStyle.scss";
import { useParams } from "react-router-dom";
import { getPost } from "../../../apis/posts/PostService";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { AiOutlineMail } from "react-icons/ai";
import { FiPhoneCall } from "react-icons/fi";
import defaultRoom from "../../../assets/images/defaultRoom.png"
const PostDetail = () => {
    const { id } = useParams();
    const [postDetail, setPostDetail] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleLoadData = async () => {
        try {
            setError("");
            setLoading(true);
            const data = await getPost(id);
            setPostDetail(data);
        } catch (error) {
            setError("Có lỗi khi lấy dữ liệu, vui lòng thử lại sau");
            setPostDetail(null);
            console.log("ERROR", error);
        } finally {
            setLoading(false);
        }
    };

    // Chuẩn hóa imageUrl thành mảng đối tượng với id và src
    const images = Array.isArray(postDetail?.imageUrl)
        ? postDetail.imageUrl.map((url, index) => ({
            id: index + 1, // Tạo ID dựa trên chỉ số
            src: url, // URL trực tiếp từ mảng chuỗi
        }))
        : [];

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : images.length - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex < images.length - 1 ? prevIndex + 1 : 0
        );
    };

    const handleThumbnailClick = (index) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        handleLoadData();
    }, [id]);

    if (loading) {
        return <div className="container__post__detail">Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div className="container__post__detail">{error}</div>;
    }

    // Trường hợp không có hình ảnh
    if (images.length === 0) {
        return (
            <div className="container__post__detail">
                <div className="container__post__information">
                    <div className="container__image">
                        <div className="main-section">
                            <img
                                src={defaultRoom}
                                alt="No Image"
                                className="main-image"
                            />
                        </div>
                    </div>
                    <p className="post__title">
                        {postDetail?.title || "Không có tiêu đề"}
                    </p>
                    <p className="post__address">
                        {postDetail?.boardingHouse?.address || "Không có địa chỉ"}
                    </p>
                    <div className="container__suggestion__post"></div>
                </div>
                <div className="container__author__information">author</div>
            </div>
        );
    }

    return (
        <div className="container__post__detail">
            <div className="container__post__information">
                <div className="container__image">
                    <div className="main-section">
                        <button className="prev-btn" onClick={handlePrev}>
                            <FaAngleLeft />
                        </button>
                        <img
                            src={images[currentIndex].src}
                            alt="Main"
                            className="main-image"
                        />
                        <button className="next-btn" onClick={handleNext}>
                            <FaAngleRight />
                        </button>
                    </div>
                    <div className="thumbnail-section">
                        {images.map((image, index) => (
                            <div
                                key={image.id}
                                className={`thumbnail ${index === currentIndex ? "active" : ""
                                    }`}
                                onClick={() => handleThumbnailClick(index)}
                            >
                                <img src={image.src} alt={`Thumbnail ${image.id}`} />
                            </div>
                        ))}
                    </div>
                </div>
                <p className="post__title">{postDetail?.title || "Không có tiêu đề"}</p>
                <p className="post__address">
                    {postDetail?.boardingHouse?.address || "Không có địa chỉ"}
                </p>
                <div className="main__post">
                    <div className="house__area">
                        <p>Diện tích</p>
                        <b>{postDetail.area}m&sup2;</b>
                    </div>
                    <div className="house__price">
                        <p>Mức giá</p>
                        <b>{postDetail.boardingHouse.roomRent.toLocaleString("vi-VN")}đ</b>
                    </div>
                    <div className="room__floor">
                        <p>Vị trí</p>
                        <b>Tầng {postDetail.floor}</b>
                    </div>
                </div>
                <table className="expect_costs">
                    <tr className="title">
                        <th colSpan={3}>Chi phí dự kiến</th>
                    </tr>
                    <tr>
                        <th>Loại chi phí</th>
                        <th>Số tiền</th>
                        <th>Đơn vị</th>
                    </tr>
                    <tr>
                        <td>Tiền điện</td>
                        <td>{postDetail.boardingHouse.electricityPrice}đ</td>
                        <td>1kWh</td>
                    </tr>
                    <tr>
                        <td>Tiền nước</td>
                        <td>{postDetail.boardingHouse.waterPrice}đ</td>
                        <td>1m&sup3;</td>
                    </tr>
                    <tr>
                        <td>Tiền gửi xe</td>
                        <td>đ</td>
                        <td>1 Tháng</td>
                    </tr>
                    <tr>
                        <td>Internet</td>
                        <td>đ</td>
                        <td>1 Tháng</td>
                    </tr>
                    <tr>
                        <td>Dịch vụ khác</td>
                        <td>đ</td>
                        <td>1 Tháng</td>
                    </tr>
                </table>
                <div className="post__description__information">
                    <p>Thông tin mô tả</p>
                    <p>{postDetail.boardingHouse.description}</p>
                </div>
                <hr/>
                {/* <div className="container__suggestion__post">
                    <p>Dành cho bạn</p>
                </div> */}
            </div>
            <div className="container__author__information">
                <div className="author__avatar">
                    <img src={postDetail.userProfile.imageUrl?postDetail.userProfile.imageUrl:"https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"} alt="Avatar" />
                </div>
                <p>{postDetail.userProfile.fullName}</p>
                <div className="author__email">
                    <AiOutlineMail/>
                    {postDetail.userProfile.email}</div>
                <div className="author__phone">
                    <FiPhoneCall/>
                    {postDetail.userProfile.phoneNumber}</div>
                </div>
        </div>
    );
};

export default PostDetail;
