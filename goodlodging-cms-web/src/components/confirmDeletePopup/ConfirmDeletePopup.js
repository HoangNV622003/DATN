import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const ConfirmDeletePopup = ({ isOpen, onClose, onConfirm, paymentId }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-delete-popup">
      <div className="popup-content">
        <h2>Xác nhận xóa hóa đơn</h2>
        <p>Bạn có chắc chắn muốn xóa hóa đơn #{paymentId} không? Hành động này không thể hoàn tác.</p>
        <div className="popup-actions">
          <button className="cancel-button" onClick={onClose}>
            Hủy
          </button>
          <button className="confirm-button" onClick={() => onConfirm(paymentId)}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmDeletePopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  paymentId: PropTypes.number.isRequired,
};

export default ConfirmDeletePopup;