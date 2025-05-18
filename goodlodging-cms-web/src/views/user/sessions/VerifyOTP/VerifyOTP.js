import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resendOtp, sendOtp, verifyOTP } from '../../../../apis/auth/AuthService';
import { createUser } from '../../../../apis/account/UserService';
import { ROUTERS } from '../../../../utils/router/Router';
import './style.scss';

const VerifyOTP = () => {
    const [userRegister, setUserRegister] = useState(null);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [expiredTime, setExpiredTime] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Get type from URL parameter (e.g., ?type=forgot-password or ?type=register)
    const type = searchParams.get('type') || 'register';

    // Hàm định dạng thời gian đếm ngược (MM:SS)
    const formatCountdown = (seconds) => {
        if (seconds <= 0) return 'Hết hạn';
        const minutes = Math.floor(4);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (type === 'forgot-password') {
            // Forgot Password flow: get email from localStorage (forgotPasswordEmail)
            const forgotEmail = localStorage.getItem('forgotPasswordEmail');
            if (!forgotEmail) {
                navigate(ROUTERS.AUTH.FORGOT_PASSWORD);
                toast.error('Vui lòng cung cấp email để đặt lại mật khẩu');
                return;
            }
            setEmail(forgotEmail);

            // Send OTP without checking userRegister
            setIsLoading(true);
            sendOtp({ email: forgotEmail })
                .then((response) => {
                    if (!response.data.expiryTime) {
                        throw new Error('Không nhận được expiryTime từ server');
                    }
                    const expiry = new Date(response.data.expiryTime);
                    if (isNaN(expiry.getTime())) {
                        throw new Error('expiryTime không hợp lệ');
                    }
                    setExpiredTime(expiry);
                    const secondsLeft = Math.max(0, Math.floor(300));
                    setTimeLeft(secondsLeft);
                    toast.success('Vui lòng nhập mã OTP đã được gửi đến email của bạn');
                })
                .catch((error) => {
                    toast.error(
                        error.response?.data?.error || error.message || 'Không thể gửi mã OTP. Vui lòng thử lại sau.'
                    );
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else if(type === 'register') {
            // Register flow: check userRegister
            const userData = localStorage.getItem('userRegister');
            if (!userData) {
                navigate(ROUTERS.AUTH.REGISTER);
                toast.error('Vui lòng đăng ký tài khoản trước');
                return;
            }

            const parsedUser = JSON.parse(userData);
            setUserRegister(parsedUser);
            setEmail(parsedUser.email);

            setIsLoading(true);
            sendOtp({ email: parsedUser.email })
                .then((response) => {
                    if (!response.data.expiryTime) {
                        throw new Error('Không nhận được expiryTime từ server');
                    }
                    const expiry = new Date(response.data.expiryTime);
                    if (isNaN(expiry.getTime())) {
                        throw new Error('expiryTime không hợp lệ');
                    }
                    setExpiredTime(expiry);
                    const secondsLeft = Math.max(0, Math.floor(300));
                    setTimeLeft(secondsLeft);
                    toast.success('Vui lòng nhập mã OTP đã được gửi đến email của bạn');
                })
                .catch((error) => {
                    toast.error(
                        error.response?.data?.error || error.message || 'Không thể gửi mã OTP. Vui lòng thử lại sau.'
                    );
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }else{

        }
    }, [navigate, type]);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,6}$/.test(value)) {
            setOtp(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || isLoading) return;

        setIsLoading(true);
        const payload = {
            email,
            otp,
        };

        verifyOTP(payload)
            .then(() => {
                if (type === 'forgot-password') {
                    navigate(ROUTERS.AUTH.RESET_PASSWORD);
                    toast.success('Xác thực OTP thành công. Vui lòng đặt lại mật khẩu.');
                } else {
                    // Register: create user and redirect to login
                    if (!userRegister) {
                        throw new Error('Dữ liệu đăng ký không hợp lệ');
                    }
                    return createUser(userRegister);
                }
            })
            .then(() => {
                if (type === 'register') {
                    toast.success('Đăng ký tài khoản thành công');
                    localStorage.removeItem('userRegister');
                    navigate(ROUTERS.AUTH.LOGIN);
                }
            })
            .catch((error) => {
                toast.error(
                    error.response?.data?.error || error.message || 'Xác thực OTP thất bại. Vui lòng thử lại.'
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleResendOTP = () => {
        if (!email || timeLeft > 0 || isLoading) return;

        setIsLoading(true);
        resendOtp({ email })
            .then((response) => {
                if (!response.data.expiryTime) {
                    throw new Error('Không nhận được expiryTime từ server');
                }
                const expiry = new Date(response.data.expiryTime);
                if (isNaN(expiry.getTime())) {
                    throw new Error('expiryTime không hợp lệ');
                }
                setExpiredTime(expiry);
                const secondsLeft = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
                setTimeLeft(secondsLeft);
                toast.success('Mã OTP mới đã được gửi đến email của bạn');
            })
            .catch((error) => {
                toast.error(
                    error.response?.data?.error || error.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại.'
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="container__verify__otp">
            <form className="form" onSubmit={handleSubmit} aria-label="Xác thực OTP">
                <h2>{type === 'forgot-password' ? 'Xác Thực OTP Để Đặt Lại Mật Khẩu' : 'Xác Thực OTP'}</h2>
                <div className="form-fields">
                    <div className="form-group">
                        <label htmlFor="otp-input" className="sr-only">
                            Mã OTP
                        </label>
                        <input
                            id="otp-input"
                            type="text"
                            name="otp"
                            placeholder="Nhập mã OTP"
                            value={otp}
                            onChange={handleChange}
                            required
                            maxLength="6"
                            pattern="\d{6}"
                            disabled={isLoading}
                            aria-describedby="otp-help"
                        />
                        <small id="otp-help" className="form-help">
                            Nhập mã OTP 6 chữ số được gửi đến email của bạn.
                        </small>
                    </div>
                    <div className="form-group">
                        <p className="otp-countdown">
                            Mã OTP hết hạn sau: {formatCountdown(timeLeft)}
                        </p>
                    </div>
                    <div
                        className={`resend-otp ${timeLeft > 0 || isLoading ? 'disabled' : ''}`}
                        onClick={handleResendOTP}
                        role="button"
                        tabIndex={timeLeft > 0 || isLoading ? -1 : 0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && timeLeft === 0 && !isLoading) handleResendOTP();
                        }}
                    >
                        {timeLeft > 0
                            ? `Gửi lại mã OTP sau ${formatCountdown(timeLeft)}`
                            : 'Gửi lại mã OTP'}
                    </div>
                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                    <div className="form-group">
                        <Link to={type === 'forgot-password' ? ROUTERS.AUTH.FORGOT_PASSWORD : ROUTERS.AUTH.REGISTER}>
                            Quay lại
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default VerifyOTP;