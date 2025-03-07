// src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import './style.scss';
import { fetchAllAddress } from '../../apis/address/AddressService';

const SearchBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading
  const searchContainerRef = useRef(null);
  const [address, setAddress] = useState([]);
  const [filter, setFilter] = useState({
    provinceId: '',
  });

  const handlerLoadAddress = async () => {
    setIsLoading(true);
    try {
      const addressData = await fetchAllAddress();
      setAddress(addressData || []);
    } catch (error) {
      console.error('Lỗi khi tải địa chỉ:', error);
      setAddress([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handlerLoadAddress();
  }, []);

  const handleProvinceSelect = (provinceId) => {
    setFilter({ provinceId });
    setIsDropdownOpen(false); // Đóng dropdown sau khi chọn
  };

  const handleSearch = (e) => {
    e.stopPropagation(); // Ngăn click vào button làm mở lại dropdown
    console.log('Search submitted:', filter);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="search-container" ref={searchContainerRef}>
      <div className="search-bar-wrapper" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <input
          type="text"
          placeholder="Tìm kiếm tỉnh thành..."
          className="search-bar"
          value={address.find((p) => p.id === filter.provinceId)?.name || ''}
          readOnly
        />
        <button className="search-button" onClick={handleSearch}>
          Tìm kiếm
        </button>
      </div>
      {isDropdownOpen && (
        <div className="filter-dropdown">
          <div className="filter-section">
            <label className="filter-label">Tất cả tỉnh thành</label>
            {isLoading ? (
              <div className="loading-text">Đang tải...</div>
            ) : address.length > 0 ? (
              <div className="province-grid">
                {address.map((province) => (
                  <div
                    key={province.id} // Sửa provinceId thành id cho khớp với dữ liệu
                    className={`province-item ${filter.provinceId === province.id ? 'selected' : ''}`}
                    onClick={() => handleProvinceSelect(province.id)}
                  >
                    {province.provinceName || province.name} {/* Hỗ trợ cả 2 kiểu dữ liệu */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">Không có dữ liệu tỉnh thành</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;