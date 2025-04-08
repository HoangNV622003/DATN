import React from 'react';
import './style.scss';

const TransferPopup = ({ isOpen, onClose, onTransfer, initialUsername, setUsername, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <h3>Chuyển nhượng nhà trọ</h3>
                <div className="form-group">
                    <label>Username người nhận:</label>
                    <input
                        type="text"
                        value={initialUsername}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nhập username"
                        className="username-input"
                    />
                </div>
                <div className="popup-buttons">
                    <button className="btn-cancel" onClick={onClose}>
                        Hủy
                    </button>
                    <button
                        className="btn-transfer"
                        onClick={onTransfer}
                        disabled={isLoading} // Disable khi đang loading
                    >
                        {isLoading ? 'Đang xử lý...' : 'Chuyển nhượng'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransferPopup;