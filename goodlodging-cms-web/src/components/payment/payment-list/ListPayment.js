import React from 'react';
import PropTypes from 'prop-types';
import PaymentItem from '../payment-item/PaymentItem';
import './style.scss';

const ListPayment = ({ isManagement, payments, members, onPay, onEdit, onDelete }) => {
  return (
    <div className="payment-list">
      {payments.length === 0 ? (
        <p className="no-invoices">Không có hóa đơn để hiển thị</p>
      ) : (
        payments.map((payment) => (
          <PaymentItem
            key={payment.id}
            payment={payment}
            members={members}
            isManagement={isManagement}
            onPay={onPay}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

ListPayment.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      dueDate: PropTypes.string,
      electricityUsage: PropTypes.number,
      electricityPrice: PropTypes.number,
      waterUsage: PropTypes.number,
      waterPrice: PropTypes.number,
      roomRent: PropTypes.number,
      fineAmount: PropTypes.number,
      description: PropTypes.string,
      status: PropTypes.number,
      paymentDate: PropTypes.string,
      payerName: PropTypes.string,
    })
  ).isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  isManagement: PropTypes.bool.isRequired,
  onPay: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ListPayment;