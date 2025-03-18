// src/components/FeatureSelector.jsx
import React, { useState } from 'react';
import './style.scss';
import { BsChevronDown, BsChevronRight, BsChevronUp, BsX } from 'react-icons/bs';

const FeatureSelector = ({ selectedFeatures = [], onFeaturesChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Danh sách tính năng giả lập từ API
  const availableFeaturesFromApi = [
    'Wifi',
    'Máy giặt',
    'Thang máy',
    'Điều hòa',
    'Máy nước nóng',
    'Bãi đỗ xe',
    'Camera an ninh',
    'Ban công',
    'Tủ lạnh',
    'Bếp gas',
  ];

  const handleFeatureToggle = (feature) => {
    const updatedFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter(f => f !== feature)
      : [...selectedFeatures, feature];
    onFeaturesChange(updatedFeatures); // Gửi danh sách mới lên parent
  };

  const handleRemoveFeature = (feature) => {
    const updatedFeatures = selectedFeatures.filter(f => f !== feature);
    onFeaturesChange(updatedFeatures); // Xóa item khỏi danh sách
  };

  const handleRemoveAllFeatures = () => {
    onFeaturesChange([]); // Xóa tất cả item
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Logic cho Khối A: Hiển thị 2 item đầu tiên và số lượng còn lại
  const displayedItems = selectedFeatures.slice(0, 2); // Lấy 2 item đầu
  const remainingCount = selectedFeatures.length > 2 ? selectedFeatures.length - 2 : 0;

  return (
    <div className="feature-selector">
      {/* Khối A */}
      <h4>Tính năng đã chọn:</h4>
      <div className="feature-summary">
        <div className="selected-items">
          {selectedFeatures.length > 0 ? (
            <>
              {displayedItems.map((item, index) => (
                <span key={index} className="selected-item">
                  {item}
                  <BsX className="remove-icon" onClick={() => handleRemoveFeature(item)} />
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="remaining-count">+{remainingCount} tính năng</span>
              )}
            </>
          ) : (
            <span>Chưa chọn tính năng</span>
          )}
        </div>
        <button type="button" className="toggle-btn" onClick={toggleDropdown}>
          <BsChevronDown className={isOpen ? 'active' : ''} />
        </button>
      </div>

      {/* Khối B */}
      {isOpen && selectedFeatures.length > 0 && (
        <div className="selected-features">
          <div className="selected-items">
            {selectedFeatures.map((feature, index) => (
              <span key={index} className="selected-item">
                {feature}
                <BsX className="remove-icon" onClick={() => handleRemoveFeature(feature)} />
              </span>
            ))}
          </div>
          <button type="button" className="clear-all-btn" onClick={handleRemoveAllFeatures}>
            Xóa tất cả
          </button>
        </div>
      )}

      {/* Danh sách tính năng từ API (Grid layout) */}
      {isOpen && (
        <div className="feature-grid">
          {availableFeaturesFromApi.map((feature) => (
            <div
              key={feature}
              className={`feature-item ${selectedFeatures.includes(feature) ? 'selected' : ''}`}
              onClick={() => handleFeatureToggle(feature)}
            >
              {feature}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeatureSelector;