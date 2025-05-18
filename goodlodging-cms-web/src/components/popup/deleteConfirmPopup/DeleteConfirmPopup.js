import React from 'react';
import './style.scss';

const DeleteConfirmPopup = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div id="dcpPopupOverlay">
      <div id='dcpPopupContent'>
        <div id=''>
          {message || 'Bạn có chắc chắn muốn xóa phần tử này không?'}
        </div>
        <div id='dcpPopupMessage'>
          <div id="dcpPopupButtons">

            <button id='dcpBtnConfirm' onClick={onConfirm}>
              Xác nhận
            </button>
            <button id='dcpBtnCancel'  onClick={onClose}>
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmPopup;