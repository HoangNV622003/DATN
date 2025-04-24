import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import SelectPayerPopup from '../../popup/selectPayerPopup/SelectPayerPopup';
import { toast } from 'react-toastify';

const PaymentItem = ({ payment, isManagement, members, onPay, onEdit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const payButtonRef = useRef(null);
  const navigate = useNavigate();

  console.log('PaymentItem - isManagement:', isManagement, 'members:', members); // Debug

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('vi-VN') : '-';
  };

  const formatUsage = (value, unit) => {
    return value || value === 0 ? `${value} ${unit}` : '-';
  };

  const calculateTotal = (payment) => {
    const electricityCost = (payment.electricityUsage || 0) * (payment.electricityPrice || 0);
    const waterCost = (payment.waterUsage || 0) * (payment.waterPrice || 0);
    return (
      (payment.roomRent || 0) +
      (payment.fineAmount || 0) +
      (payment.otherPrice || 0) +
      electricityCost +
      waterCost
    );
  };

  const handleOpenModal = () => {
    console.log('Opening modal for paymentId:', payment.id); // Debug
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal'); // Debug
    setIsModalOpen(false);
    payButtonRef.current?.focus(); // Focus lại nút Thanh Toán
  };

  const handleConfirmPay = async (paymentId, userId) => {
    console.log('Confirming payment:', { paymentId, userId }); // Debug
    try {
      await onPay(paymentId, userId); // Đảm bảo onPay trả về Promise
      handleCloseModal(); // Đóng modal (dự phòng)
    } catch (error) {
      console.error('Payment error in PaymentItem:', error);
      throw error; // Ném lỗi để SelectPayerPopup xử lý
    }
  };

  if (!payment?.id) {
    console.warn('Payment thiếu id:', payment);
    return null;
  }

  return (
    <div className="payment-card">
      <div className="card-header">
        <span className="card-id">Mã Hóa Đơn: {payment.id}</span>
        <span className="card-due-date">Ngày Đến Hạn: {formatDate(payment.dueDate)}</span>
      </div>
      <div className="card-body">
        <div className="usage-info">
          <span>
            <span className="label">Điện Tiêu Thụ:</span>
            <span className="value">{formatUsage(payment.electricityUsage, 'kWh')}</span>
          </span>
          <span>
            <span className="label">Nước Sử Dụng:</span>
            <span className="value">{formatUsage(payment.waterUsage, 'm³')}</span>
          </span>
        </div>
        <div className="financial-info">
          <span>
            <span className="label">Tiền Phạt:</span>
            <span className="value">{formatCurrency(payment.fineAmount || 0)}</span>
          </span>
          <span>
            <span className="label">Tổng Tiền:</span>
            <span className="value">{formatCurrency(calculateTotal(payment))}</span>
          </span>
        </div>
        <div className="description">
          <span title={payment.description || ''}>
            Mô Tả: {payment.description || '-'}
          </span>
        </div>
      </div>
      <div className="card-footer">
        <div className="status">
          {payment.status === 1 ? (
            <div className="paid-status">
              Đã thanh toán<br />
              Ngày: {formatDate(payment.paymentDate)}<br />
              Người thanh toán: {payment.payerName || 'N/A'}
            </div>
          ) : (
            <span className="unpaid-status">Chưa thanh toán</span>
          )}
        </div>
        {payment.status === 0 && (
          <div className="actions">
            <button
              ref={payButtonRef}
              className="pay-button"
              onClick={isManagement ? () => onPay({
                paymentId: payment.id,
                amount: calculateTotal(payment),
              }) : handleOpenModal}
              aria-label="Thanh toán hóa đơn"
            >
              Thanh Toán
            </button>
            {!isManagement && (
              <button
                className="edit-button"
                onClick={() => onEdit(payment)}
                aria-label="Chỉnh sửa hóa đơn"
              >
                Chỉnh Sửa
              </button>
            )}
          </div>
        )}
      </div>

      <SelectPayerPopup
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        members={members}
        onConfirm={handleConfirmPay}
        paymentId={payment.id}
        isManagement={isManagement}
      />
    </div>
  );
};

PaymentItem.propTypes = {
  payment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    dueDate: PropTypes.string,
    electricityUsage: PropTypes.number,
    electricityPrice: PropTypes.number,
    waterUsage: PropTypes.number,
    waterPrice: PropTypes.number,
    roomRent: PropTypes.number,
    fineAmount: PropTypes.number,
    otherPrice: PropTypes.number,
    description: PropTypes.string,
    status: PropTypes.number,
    paymentDate: PropTypes.string,
    payerName: PropTypes.string,
  }).isRequired,
  isManagement: PropTypes.bool.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onPay: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default PaymentItem;