import React, { useState, useEffect, memo } from 'react';
import './style.scss';
import prices from '../../constants/PricesConstants';
import areas from '../../constants/AreaConstants';
import { postTypeConstants } from '../../constants/PostTypeConstants';

const ConfigView = ({ onConfigChange, initialConfig = {} }) => {
  // Tìm các phần tử có id=1 làm giá trị mặc định
  const defaultRoomPrice = prices.roomPrice.find(price => price.id === 1) || null;
  const defaultElectricityPrice = prices.electricityPrice.find(price => price.id === 1) || null;
  const defaultWaterPrice = prices.waterPrice.find(price => price.id === 1) || null;
  const defaultArea = areas.find(area => area.id === 1) || null;
  const defaultRoomType = postTypeConstants.find(type => type.id === 1) || null;

  const [selectedConfig, setSelectedConfig] = useState({
    roomPrice: initialConfig.roomPrice || defaultRoomPrice,
    electricityPrice: initialConfig.electricityPrice || defaultElectricityPrice,
    waterPrice: initialConfig.waterPrice || defaultWaterPrice,
    area: initialConfig.area || defaultArea,
    roomType: initialConfig.roomType || defaultRoomType,
  });

  const handleChange = (type, value) => {
    const newConfig = { ...selectedConfig, [type]: value };
    setSelectedConfig(newConfig);

    const updatedPayload = {};
    if (newConfig.roomType) updatedPayload.roomType = newConfig.roomType.value;
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

    onConfigChange(updatedPayload);
  };

  // Gọi onConfigChange khi component mount với giá trị mặc định
  useEffect(() => {
    const updatedPayload = {};
    if (selectedConfig.roomType) updatedPayload.roomType = selectedConfig.roomType.value;
    if (selectedConfig.roomPrice) {
      updatedPayload.minRoomRent = selectedConfig.roomPrice.min;
      updatedPayload.maxRoomRent = selectedConfig.roomPrice.max;
    }
    if (selectedConfig.electricityPrice) {
      updatedPayload.minElectricityPrice = selectedConfig.electricityPrice.min;
      updatedPayload.maxElectricityPrice = selectedConfig.electricityPrice.max;
    }
    if (selectedConfig.waterPrice) {
      updatedPayload.minWaterPrice = selectedConfig.waterPrice.min;
      updatedPayload.maxWaterPrice = selectedConfig.waterPrice.max;
    }
    if (selectedConfig.area) {
      updatedPayload.minArea = selectedConfig.area.min;
      updatedPayload.maxArea = selectedConfig.area.max;
    }
    onConfigChange(updatedPayload);
  }, []); // Chỉ chạy một lần khi mount

  const handleReset = () => {
    // Tìm các phần tử có id=1 làm giá trị khi reset
    const resetRoomPrice = prices.roomPrice.find(price => price.id === 1) || null;
    const resetElectricityPrice = prices.electricityPrice.find(price => price.id === 1) || null;
    const resetWaterPrice = prices.waterPrice.find(price => price.id === 1) || null;
    const resetArea = areas.find(area => area.id === 1) || null;
    const resetRoomType = postTypeConstants.find(type => type.id === 1) || null;

    const resetConfig = {
      roomPrice: resetRoomPrice,
      electricityPrice: resetElectricityPrice,
      waterPrice: resetWaterPrice,
      area: resetArea,
      roomType: resetRoomType,
    };

    setSelectedConfig(resetConfig);

    // Cập nhật payload với các giá trị id=1
    const updatedPayload = {};
    if (resetRoomType) updatedPayload.roomType = resetRoomType.value;
    if (resetRoomPrice) {
      updatedPayload.minRoomRent = resetRoomPrice.min;
      updatedPayload.maxRoomRent = resetRoomPrice.max;
    }
    if (resetElectricityPrice) {
      updatedPayload.minElectricityPrice = resetElectricityPrice.min;
      updatedPayload.maxElectricityPrice = resetElectricityPrice.max;
    }
    if (resetWaterPrice) {
      updatedPayload.minWaterPrice = resetWaterPrice.min;
      updatedPayload.maxWaterPrice = resetWaterPrice.max;
    }
    if (resetArea) {
      updatedPayload.minArea = resetArea.min;
      updatedPayload.maxArea = resetArea.max;
    }

    onConfigChange(updatedPayload);
  };

  return (
    <div className="container-config-view">
      <h3>Bộ lọc tìm kiếm</h3>

      <label>Loại phòng</label>
      <ul className="config-room-type">
        {postTypeConstants.map((type, index) => (
          <li key={index}>
            <input
              type="radio"
              id={`room-type-${index}`}
              name="roomType"
              checked={selectedConfig.roomType?.name === type.name}
              onChange={() => handleChange('roomType', type)}
            />
            <label htmlFor={`room-type-${index}`}>{type.name}</label>
          </li>
        ))}
      </ul>

      <label>Giá phòng</label>
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

      <label>Giá tiền điện</label>
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

      <label>Giá tiền nước</label>
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

      <label>Diện tích</label>
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

      <button className="reset-button" onClick={handleReset}>
        Xóa bộ lọc
      </button>
    </div>
  );
};

export default memo(ConfigView);