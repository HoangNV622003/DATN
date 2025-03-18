// src/components/config/ConfigView.jsx
import React, { useState, memo } from 'react';
import './style.scss';
import prices from '../../constants/PricesConstants';
import areas from '../../constants/AreaConstants';

const ConfigView = ({ onConfigChange, initialConfig }) => {
    // Trạng thái để lưu giá trị đã chọn từ radio buttons
    const [selectedConfig, setSelectedConfig] = useState({
        roomPrice: initialConfig?.roomPrice || null,
        electricityPrice: initialConfig?.electricityPrice || null,
        waterPrice: initialConfig?.waterPrice || null,
        area: initialConfig?.area || null,
    });

    // Hàm xử lý khi thay đổi radio button
    const handleChange = (type, value) => {
        const newConfig = { ...selectedConfig, [type]: value };
        setSelectedConfig(newConfig);

        // Chuyển đổi giá trị đã chọn thành định dạng payload
        const updatedPayload = {};

        if (newConfig.roomPrice) {
            updatedPayload.minRoomRent = newConfig.roomPrice.min;
            updatedPayload.maxRoomRent = newConfig.roomPrice.max;
        }
        if (newConfig.electricityPrice) {
            updatedPayload.minElectricityPrice = newConfig.electricityPrice.min;
            updatedPayload.maxElectricityPrice = newConfig.electricityPrice.max;
        }
        if (newConfig.waterPrice) {
            updatedPayload.minWaterPrice = newConfig.waterPrice.min;
            updatedPayload.maxWaterPrice = newConfig.waterPrice.max;
        }
        if (newConfig.area) {
            updatedPayload.minArea = newConfig.area.min;
            updatedPayload.maxArea = newConfig.area.max;
        }

        // Gọi callback để cập nhật payload trong SearchPage
        onConfigChange(updatedPayload);
    };

    return (
        <div className="container-config-view">
            <h3>Bộ lọc tìm kiếm</h3>

            <label htmlFor="config-room-price">Giá phòng</label>
            <ul className="config-room-price">
                {prices.roomPrice.map((price, index) => (
                    <li key={index}>
                        <input
                            type="radio"
                            id={`room-price-${index}`}
                            name="roomPrice"
                            checked={selectedConfig.roomPrice?.name === price.name}
                            onChange={() => handleChange('roomPrice', price)}
                        />
                        <label htmlFor={`room-price-${index}`}>{price.name}</label>
                    </li>
                ))}
            </ul>

            <label htmlFor="config-electricity-price">Giá tiền điện</label>
            <ul className="config-electricity-price">
                {prices.electricityPrice.map((price, index) => (
                    <li key={index}>
                        <input
                            type="radio"
                            id={`electricity-price-${index}`}
                            name="electricityPrice"
                            checked={selectedConfig.electricityPrice?.name === price.name}
                            onChange={() => handleChange('electricityPrice', price)}
                        />
                        <label htmlFor={`electricity-price-${index}`}>{price.name}</label>
                    </li>
                ))}
            </ul>

            <label htmlFor="config-water-price">Giá tiền nước</label>
            <ul className="config-water-price">
                {prices.waterPrice.map((price, index) => (
                    <li key={index}>
                        <input
                            type="radio"
                            id={`water-price-${index}`}
                            name="waterPrice"
                            checked={selectedConfig.waterPrice?.name === price.name}
                            onChange={() => handleChange('waterPrice', price)}
                        />
                        <label htmlFor={`water-price-${index}`}>{price.name}</label>
                    </li>
                ))}
            </ul>

            <label htmlFor="config-area">Diện tích</label>
            <ul className="config-area">
                {areas.map((area, index) => (
                    <li key={index}>
                        <input
                            type="radio"
                            id={`area-${index}`}
                            name="area"
                            checked={selectedConfig.area?.name === area.name}
                            onChange={() => handleChange('area', area)}
                        />
                        <label htmlFor={`area-${index}`}>{area.name}</label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default memo(ConfigView);