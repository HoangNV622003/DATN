import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../../../../utils/router/Router';
import { fetchMyRoomInvoice } from '../../../../../../../apis/payment/PaymentService';
import { toast } from 'react-toastify';
import ListPayment from '../../../../../../../components/payment/payment-list/ListPayment';

const ManagePayments = () => {
  const { user, isLogin, loading, token } = useAuth();
  const [data, setData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log('ManagePayments - user:', user, 'token:', token); // Debug

  const handleFetchData = async (userId, accessToken) => {
    setLoadingData(true);
    try {
      const result = await fetchMyRoomInvoice(userId, accessToken);
      setData(result.data);
    } catch (err) {
      setError(err.message);
      toast.error('Có lỗi xảy ra khi lấy dữ liệu thanh toán');
    } finally {
      setLoadingData(false);
    }
  };

  const handlePay = async (paymentId, formData) => {
    // Thanh toán sẽ được xử lý trong PaymentPage
    console.log('handlePay called with paymentId:', paymentId, 'formData:', formData); // Debug
    toast.info(`Chuyển đến trang thanh toán ${paymentId}`);
    //navigate(`/payment/${paymentId}`); // Điều hướng (dự phòng)
  };

  useEffect(() => {
    if (loading) return;
    if (!isLogin) navigate(ROUTERS.AUTH.LOGIN);
    else handleFetchData(user.id, token);
  }, [isLogin, loading, user, token, navigate]);

  if (loadingData) {
    return (
      <main className="container__manage__payments" role="main" aria-labelledby="payments-title">
        <h1 id="payments-title">Quản lý thanh toán</h1>
        <p>Đang tải dữ liệu...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container__manage__payments error" role="main" aria-labelledby="payments-title">
        <h1 id="payments-title">Quản lý thanh toán</h1>
        <p>Lỗi: {error}</p>
        <button onClick={() => handleFetchData(user.id, token)}>Thử lại</button>
      </main>
    );
  }

  if (!data?.invoices || !Array.isArray(data.invoices)) {
    return (
      <main className="container__manage__payments" role="main" aria-labelledby="payments-title">
        <h1 id="payments-title">Quản lý thanh toán</h1>
        <p>Không có hóa đơn để hiển thị</p>
      </main>
    );
  }

  return (
    <main className="container__manage__payments" role="main" aria-labelledby="payments-title">
      <h1 id="payments-title">Quản lý thanh toán</h1>
      <ListPayment
        payments={data.invoices}
        isManagement={true}
        onPay={handlePay}
      />
    </main>
  );
};

export default ManagePayments;