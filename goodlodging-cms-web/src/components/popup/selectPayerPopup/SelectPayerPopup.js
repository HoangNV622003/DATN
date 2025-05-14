import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import './style.scss';
import { toast } from 'react-toastify';

const SelectPayerPopup = ({ isManagement, isOpen, onClose, members, onConfirm, paymentId }) => {
  const [selectedPayer, setSelectedPayer] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const confirmButtonRef = useRef(null);

  console.log('SelectPayerPopup - isManagement:', isManagement, 'members:', members); // Debug

  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!selectedPayer) {
      toast.error('Vui lòng chọn người thanh toán');
      return;
    }
    setIsPaying(true);
    try {
      await onConfirm(paymentId, selectedPayer);
      setSelectedPayer('');
      console.log('Payment successful, closing popup'); // Debug
      onClose(); // Đóng modal sau khi thanh toán thành công
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.');
    } finally {
      setIsPaying(false);
    }
  };

  const handleClose = () => {
    setSelectedPayer('');
    setIsPaying(false);
    console.log('Closing popup'); // Debug
    onClose();
  };

  if (isManagement) {
    console.log('isManagement = true, skipping popup'); // Debug
    return null; // Không hiển thị modal nếu là quản lý
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="payment-modal"
      overlayClassName="payment-modal-overlay"
      aria={{
        labelledby: "modal-title",
        describedby: "modal-description",
        modal: true,
      }}
    >
      <h2 id="modal-title">Chọn Người Thanh Toán</h2>
      <p id="modal-description">Vui lòng chọn một thành viên để thanh toán hóa đơn.</p>
      {members.length === 0 ? (
        <p aria-live="polite">Không có thành viên trong phòng.</p>
      ) : (
        <select
          value={selectedPayer}
          onChange={(e) => setSelectedPayer(e.target.value)}
          className="payer-select"
          aria-label="Chọn người thanh toán"
          disabled={isPaying}
        >
          <option value="">-- Chọn người thanh toán --</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      )}
      <div className="modal-actions">
        <button
          ref={confirmButtonRef}
          className="confirm-button"
          onClick={handleConfirm}
          disabled={!selectedPayer || isPaying}
          aria-label="Xác nhận thanh toán"
        >
          {isPaying ? 'Đang xử lý...' : 'Xác Nhận'}
        </button>
        <button
          className="cancel-button"
          onClick={handleClose}
          disabled={isPaying}
          aria-label="Hủy chọn"
        >
          Hủy
        </button>
      </div>
    </Modal>
  );
};

SelectPayerPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onConfirm: PropTypes.func.isRequired,
  paymentId: PropTypes.number.isRequired,
  isManagement: PropTypes.bool.isRequired,
};

export default SelectPayerPopup;