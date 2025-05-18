import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-contact">
                    <h3 className="footer-title">Liên Hệ</h3>
                    <p>
                        <span role="img" aria-label="phone">📞</span> Số điện thoại:{' '}
                        <a href="tel:0813941024">0813941024</a>
                    </p>
                    <p>
                        <span role="img" aria-label="email">📧</span> Email:{' '}
                        <a href="mailto:hoangkdks622003@gmail.com">hoangkdks622003@gmail.com</a>
                    </p>
                    <p>
                        <span role="img" aria-label="address">📍</span> Địa chỉ: 55, Giải Phóng, P. Đồng Tâm, Q. Hai Bà Trưng, Tp. Hà Nội
                    </p>
                </div>
                <div className="footer-links">
                    <h3 className="footer-title">Liên Kết Nhanh</h3>
                    <ul className="links-list">
                        <li><Link to="/about">Giới Thiệu</Link></li>
                        <li><Link to="/services">Dịch Vụ</Link></li>
                        <li><Link to="/contact">Liên Hệ</Link></li>
                    </ul>
                </div>
                <div className="footer-social">
                    <h3 className="footer-title">Theo Dõi Chúng Tôi</h3>
                    <div className="social-links">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} My Website. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;