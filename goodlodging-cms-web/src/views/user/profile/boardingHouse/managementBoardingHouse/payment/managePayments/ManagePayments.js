import  { useEffect, useState } from 'react';
import { useAuth } from '../../../../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../../../../utils/router/Router';
import { fetchMyRoomBills } from '../../../../../../../apis/bill/BillService';
import { toast } from 'react-toastify';
import ListPayment from '../../../../../../../components/payment/payment-list/ListPayment';
import { createOrder } from '../../../../../../../apis/vn-pay/VNPayService';

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
      const result = await fetchMyRoomBills(userId, accessToken);
      setData(result.data);
    } catch (err) {
      setError(err.message);
      toast.error('Có lỗi xảy ra khi lấy dữ liệu thanh toán');
    } finally {
      setLoadingData(false);
    }
  };

  const handlePay = async ( formData) => {
    const payload={
      invoiceId: formData.paymentId,
      amount: formData.amount,
    }   
    try {
      const result = await createOrder(payload, token);
      if (result.status === 200) {
        window.location.href = result.data.url; // Redirect to payment page
      } else {
        toast.error('Có lỗi xảy ra khi thanh toán');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Có lỗi xảy ra khi thanh toán');
    }

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