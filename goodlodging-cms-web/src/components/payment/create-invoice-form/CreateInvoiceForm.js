import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import './InvoiceForm.scss';

const CreateInvoiceForm = ({ data, roomId, selectedInvoice, onSubmit, onCancel }) => {
  const [invoice, setInvoice] = useState({
    roomId: roomId || '',
    dueDate: '',
    fineAmount: '',
    electricityUsage: '',
    waterUsage: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedInvoice) {
      setInvoice({
        roomId: roomId || '',
        dueDate: selectedInvoice.dueDate || '',
        fineAmount: selectedInvoice.fineAmount || '',
        electricityUsage: selectedInvoice.electricityUsage || '',
        waterUsage: selectedInvoice.waterUsage || '',
        description: selectedInvoice.description || '',
      });
    } else {
      setInvoice({
        roomId: roomId || '',
        dueDate: '',
        fineAmount: '',
        electricityUsage: '',
        waterUsage: '',
        description: '',
      });
    }
  }, [selectedInvoice, roomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!invoice.dueDate) {
      toast.error('Vui lòng chọn ngày đến hạn');
      return;
    }
    if (parseFloat(invoice.fineAmount) < 0) {
      toast.error('Tiền phạt không thể âm');
      return;
    }
  
    if (parseInt(invoice.electricityUsage) < 0) {
      toast.error('Lượng điện sử dụng không thể âm');
      return;
    }
    if (parseInt(invoice.waterUsage) < 0) {
      toast.error('Lượng nước sử dụng không thể âm');
      return;
    }
    setIsSubmitting(true);
    try {
      // Chuyển đổi dueDate thành định dạng ISO-8601 (Instant)
      const formattedDueDate = new Date(invoice.dueDate).toISOString();
      await onSubmit({
        ...invoice,
        roomId: roomId,
        dueDate: formattedDueDate,
        fineAmount: parseFloat(invoice.fineAmount) || 0,
        electricityUsage: parseInt(invoice.electricityUsage) || 0,
        waterUsage: parseInt(invoice.waterUsage) || 0,
      });
      setInvoice({
        roomId: roomId || '',
        dueDate: '',
        fineAmount: '',
        electricityUsage: '',
        waterUsage: '',
        description: '',
      });
    } catch (error) {
      toast.error('Lỗi kết nối đến server: ' + (error.message || 'Không xác định'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="invoice-form-container">
      <h2 className="form-title">{selectedInvoice ? 'Cập Nhật Hóa Đơn' : 'Thêm Hóa Đơn Mới'}</h2>
      <div className="form-content">
        <div className="form-group">
          <label htmlFor="dueDate" className="form-label">
            Ngày Đến Hạn
          </label>
          <input
            id="dueDate"
            type="datetime-local"
            name="dueDate"
            value={invoice.dueDate}
            onChange={handleChange}
            className="form-input"
            required
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <label htmlFor="fineAmount" className="form-label">
            Tiền Phạt
          </label>
          <input
            id="fineAmount"
            type="number"
            step="0.01"
            name="fineAmount"
            value={invoice.fineAmount}
            onChange={handleChange}
            className="form-input"
            required
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <label htmlFor="electricityUsage" className="form-label">
            Lượng Điện Sử Dụng (kWh)
          </label>
          <input
            id="electricityUsage"
            type="number"
            name="electricityUsage"
            value={invoice.electricityUsage}
            onChange={handleChange}
            className="form-input"
            required
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <label htmlFor="waterUsage" className="form-label">
            Lượng Nước Sử Dụng (m³)
          </label>
          <input
            id="waterUsage"
            type="number"
            name="waterUsage"
            value={invoice.waterUsage}
            onChange={handleChange}
            className="form-input"
            required
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Mô Tả
          </label>
          <textarea
            id="description"
            name="description"
            value={invoice.description}
            onChange={handleChange}
            className="form-textarea"
            rows="4"
            required
            aria-required="true"
          />
        </div>
        <div className="form-actions">
          <button
            onClick={handleSubmit}
            className="submit-button"
            disabled={isSubmitting}
            aria-label={selectedInvoice ? 'Cập nhật hóa đơn' : 'Thêm hóa đơn'}
          >
            {isSubmitting ? 'Đang xử lý...' : selectedInvoice ? 'Cập Nhật Hóa Đơn' : 'Thêm Hóa Đơn'}
          </button>
          {selectedInvoice && (
            <button
              onClick={onCancel}
              className="cancel-button"
              disabled={isSubmitting}
              aria-label="Hủy chỉnh sửa"
            >
              Hủy
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

CreateInvoiceForm.propTypes = {
  data: PropTypes.array,
  roomId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedInvoice: PropTypes.shape({
    id: PropTypes.number,
    roomId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dueDate: PropTypes.string,
    fineAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    electricityUsage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    waterUsage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    description: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CreateInvoiceForm;