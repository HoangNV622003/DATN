import React, { use, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './style.scss';
import { toast } from 'react-toastify';
import { fetchOrderResult } from '../../../../apis/vn-pay/VNPayService';
import { useAuth } from '../../../../context/AuthContext';

const VNPayResult = () => {
  // Lấy query parameters từ URL
  const { token, user, isLogin, loading } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const params = {
    vnp_Amount: queryParams.get('vnp_Amount'),
    vnp_BankCode: queryParams.get('vnp_BankCode'),
    vnp_BankTranNo: queryParams.get('vnp_BankTranNo'),
    vnp_CardType: queryParams.get('vnp_CardType'),
    vnp_OrderInfo: queryParams.get('vnp_OrderInfo'),
    vnp_PayDate: queryParams.get('vnp_PayDate'),
    vnp_ResponseCode: queryParams.get('vnp_ResponseCode'),
    vnp_TmnCode: queryParams.get('vnp_TmnCode'),
    vnp_TransactionNo: queryParams.get('vnp_TransactionNo'),
    vnp_TransactionStatus: queryParams.get('vnp_TransactionStatus'),
    vnp_TxnRef: queryParams.get('vnp_TxnRef'),
    vnp_SecureHash: queryParams.get('vnp_SecureHash'),
  };

  // Định dạng số tiền sang VND
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount / 100); // VNPay amount là đơn vị nhỏ nhất (1/100 VND)
  };
  const handleFetchData = async (userId, accessToken) => {

    try {
      const payload = {
        vnp_OrderInfo: params.vnp_OrderInfo,
        vnp_ResponseCode: params.vnp_ResponseCode,
        payerId: userId,
      }
      const result = await fetchOrderResult(payload, accessToken);
      result.status !== 200 && toast.error('Có lỗi xảy ra khi lấy dữ liệu thanh toán!');
    } catch (error) {
      console.error('Error fetching payment result:', error);
      toast.error('Có lỗi xảy ra khi lấy dữ liệu thanh toán!');
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!isLogin) {
      toast.error('Vui lòng đăng nhập để xem kết quả thanh toán');
      return;
    }
    else handleFetchData(user.id, token);
  }, [isLogin, loading, user, token]);

  // Định dạng ngày giờ
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(
      dateStr.slice(0, 4), // Năm
      dateStr.slice(4, 6) - 1, // Tháng (0-based)
      dateStr.slice(6, 8), // Ngày
      dateStr.slice(8, 10), // Giờ
      dateStr.slice(10, 12), // Phút
      dateStr.slice(12, 14) // Giây
    );
    return date.toLocaleString('vi-VN');
  };

  // Trạng thái giao dịch
  const getStatus = (status) => {
    return status === '00' ? 'Thành công' : 'Thất bại';
  };

  return (
    <div className="vnpay-result-container">
      <div className="vnpay-result-card">
        <h1 className="vnpay-result-title">Kết quả thanh toán VNPay</h1>
        <div className="vnpay-result-content">
          <div className="vnpay-result-grid">
            <div className="vnpay-result-label">Số tiền:</div>
            <div>{formatAmount(params.vnp_Amount)}</div>

            <div className="vnpay-result-label">Mã ngân hàng:</div>
            <div>{params.vnp_BankCode}</div>

            <div className="vnpay-result-label">Số giao dịch ngân hàng:</div>
            <div>{params.vnp_BankTranNo}</div>

            <div className="vnpay-result-label">Loại thẻ:</div>
            <div>{params.vnp_CardType}</div>

            <div className="vnpay-result-label">Thông tin đơn hàng:</div>
            <div>{params.vnp_OrderInfo}</div>

            <div className="vnpay-result-label">Ngày thanh toán:</div>
            <div>{formatDate(params.vnp_PayDate)}</div>

            <div className="vnpay-result-label">Mã phản hồi:</div>
            <div>{params.vnp_ResponseCode}</div>

            <div className="vnpay-result-label">Mã Tmn:</div>
            <div>{params.vnp_TmnCode}</div>

            <div className="vnpay-result-label">Số giao dịch VNPay:</div>
            <div>{params.vnp_TransactionNo}</div>

            <div className="vnpay-result-label">Trạng thái giao dịch:</div>
            <div
              className={`vnpay-result-status ${params.vnp_TransactionStatus === '00' ? 'success' : 'failed'
                }`}
            >
              {getStatus(params.vnp_TransactionStatus)}
            </div>

            <div className="vnpay-result-label">Mã tham chiếu:</div>
            <div>{params.vnp_TxnRef}</div>

            <div className="vnpay-result-label">Mã bảo mật:</div>
            <div className="vnpay-result-secure-hash">{params.vnp_SecureHash}</div>
          </div>
        </div>
        <div className="vnpay-result-footer">
          <a href="/" className="vnpay-result-button">
            Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
};

export default VNPayResult;