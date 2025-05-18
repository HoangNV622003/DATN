import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../../../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTERS } from '../../../../../../../utils/router/Router';
import { confirmPayment, createBill, fetchRoomBills, updateBill, deleteBill } from '../../../../../../../apis/bill/BillService';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import ListPayment from '../../../../../../../components/payment/payment-list/ListPayment';
import CreateInvoiceForm from '../../../../../../../components/payment/create-invoice-form/CreateInvoiceForm';
import './style.scss';

const RoomPaymentHistory = () => {
  const { user, isLogin, loading, token } = useAuth();
  const [data, setData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  console.log('Auth context:', { user, isLogin, loading, token }); // Debug auth context

  const handleFetchData = async (accessToken) => {
    if (!id || isNaN(parseInt(id))) {
      setError('Mã phòng không hợp lệ');
      setLoadingData(false);
      return;
    }
    setLoadingData(true);
    try {
      const result = await fetchRoomBills(id, accessToken);
      const mappedData = {
        ...result.data,
        members: result.data.members.map((member) => ({
          id: member.id,
          name: `${member.firstName} ${member.lastName}`.trim(),
        })),
      };
      console.log('Mapped members:', mappedData.members);
      setData(mappedData);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Không thể tải dữ liệu thanh toán';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoadingData(false);
    }
  };

  const handlePay = async (paymentId, userId) => {
    if (!paymentId || !userId) {
      throw new Error('Mã hóa đơn hoặc người thanh toán không hợp lệ');
    }
    try {
      const response = await confirmPayment(paymentId, userId, token);
      toast.success('Thanh toán thành công!');
      setData((prev) => ({
        ...prev,
        invoices: prev.invoices.map((inv) => (inv.id === response.data.id ? response.data : inv)),
      }));
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.status === 401
          ? 'Xác thực thất bại: Token không hợp lệ hoặc đã hết hạn'
          : error.response?.data?.message || error.message || 'Lỗi không xác định';
      console.error('Confirm payment error:', error.response?.data, error.response?.status);
      toast.error('Thanh toán thất bại: ' + errorMessage);
      if (error.response?.status === 401) {
        navigate(ROUTERS.AUTH.LOGIN);
      }
      throw error;
    }
  };

  const handleCreateInvoice = async (invoiceData) => {
    try {
      const response = await createBill({ ...invoiceData, roomId: data.roomId }, token);
      toast.success('Tạo hóa đơn thành công!');
      setSelectedInvoice(null);
      setData((prev) => ({
        ...prev,
        invoices: [...prev.invoices, response.data],
      }));
    } catch (error) {
      toast.error('Tạo hóa đơn thất bại!');
    }
  };

  const handleUpdateInvoice = async (invoiceData) => {
    if (!selectedInvoice?.id) {
      toast.error('Mã hóa đơn không hợp lệ, không thể cập nhật');
      return;
    }
    try {
      const payload = {
        roomId: data.roomId || '',
        dueDate: invoiceData.dueDate ? new Date(invoiceData.dueDate).toISOString() : null,
        fineAmount: parseFloat(invoiceData.fineAmount) || 0,
        electricityUsage: parseInt(invoiceData.electricityUsage) || 0,
        waterUsage: parseInt(invoiceData.waterUsage) || 0,
        description: invoiceData.description || '',
      };
      const response = await updateBill(selectedInvoice.id, payload, token);
      toast.success('Cập nhật hóa đơn thành công!');
      setSelectedInvoice(null);
      setData((prev) => ({
        ...prev,
        invoices: prev.invoices.map((inv) => (inv.id === response.data.id ? response.data : inv)),
      }));
    } catch (error) {
      toast.error('Cập nhật hóa đơn thất bại: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleDelete = async (paymentId) => {
    try {
      await deleteBill(paymentId, token);
      toast.success('Xóa hóa đơn thành công!');
      setData((prev) => ({
        ...prev,
        invoices: prev.invoices.filter((inv) => inv.id !== paymentId),
      }));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Xóa hóa đơn thất bại';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (payment) => {
    if (!payment?.id) {
      toast.error('Hóa đơn không hợp lệ, không thể chỉnh sửa');
      return;
    }
    setSelectedInvoice({
      id: payment.id,
      roomId: data.roomId || '',
      dueDate: payment.dueDate ? new Date(payment.dueDate).toISOString().slice(0, 16) : '',
      fineAmount: payment.fineAmount ?? '',
      electricityUsage: payment.electricityUsage ?? '',
      waterUsage: payment.waterUsage ?? '',
      description: payment.description ?? '',
    });
  };

  useEffect(() => {
    if (loading) return;
    if (!isLogin) navigate(ROUTERS.AUTH.LOGIN);
    else handleFetchData(token);
  }, [isLogin, loading, token, navigate, id]);

  if (loadingData) {
    return (
      <main className="container__my_payment_history" role="main" aria-labelledby="payment-history-title">
        <h1 id="payment-history-title">Lịch sử thanh toán</h1>
        <p>Đang tải dữ liệu...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container__my_payment_history error" role="main" aria-labelledby="payment-history-title">
        <h1 id="payment-history-title">Lịch sử thanh toán</h1>
        <p>Lỗi: {error}</p>
        <button onClick={() => handleFetchData(token)}>Thử lại</button>
      </main>
    );
  }

  if (!data?.invoices || !Array.isArray(data.invoices)) {
    return (
      <main className="container__my_payment_history" role="main" aria-labelledby="payment-history-title">
        <h1 id="payment-history-title">Lịch sử thanh toán</h1>
        <p>Không có hóa đơn để hiển thị</p>
      </main>
    );
  }

  return (
    <main className="container__my_payment_history" role="main" aria-labelledby="payment-history-title">
      <h1 id="payment-history-title">Lịch sử thanh toán - Phòng {data?.roomName || 'N/A'}</h1>
      <CreateInvoiceForm
        data={data.invoices}
        roomId={data.roomId}
        selectedInvoice={selectedInvoice}
        onSubmit={selectedInvoice ? handleUpdateInvoice : handleCreateInvoice}
        onCancel={() => setSelectedInvoice(null)}
      />
      <ListPayment
        payments={data.invoices}
        members={data.members || []}
        isManagement={false}
        onPay={handlePay}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </main>
  );
};

RoomPaymentHistory.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  isLogin: PropTypes.bool,
  loading: PropTypes.bool,
  token: PropTypes.string,
};

export default RoomPaymentHistory;