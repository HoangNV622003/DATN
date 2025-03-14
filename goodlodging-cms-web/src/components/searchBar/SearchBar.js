// src/components/searchBar/SearchBar.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import "./style.scss";
import { fetchAllAddress } from "../../apis/address/AddressService";
import { LuMapPinned } from "react-icons/lu";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "../../utils/router/Router";

const SearchBar = ({
  initialProvince = null,
  initialDistricts = [],
  initialWards = [],
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchContainerRef = useRef(null);
  const [addressData, setAddressData] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(initialProvince);
  const [selectedDistricts, setSelectedDistricts] = useState(initialDistricts);
  const [selectedWards, setSelectedWards] = useState(initialWards);
  const navigate = useNavigate();

  const handlerLoadAddress = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const addressData = await fetchAllAddress();
      setAddressData(addressData || []);
    } catch (error) {
      console.error("Lỗi khi tải địa chỉ:", error);
      setError("Không thể tải dữ liệu địa chỉ. Vui lòng thử lại sau.");
      setAddressData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handlerLoadAddress();
  }, [handlerLoadAddress]);

  // Chỉ cập nhật state nếu props thay đổi thực sự
  useEffect(() => {
    if (initialProvince !== selectedProvince) {
      setSelectedProvince(initialProvince);
    }
    if (
      JSON.stringify(initialDistricts) !== JSON.stringify(selectedDistricts)
    ) {
      setSelectedDistricts(initialDistricts);
    }
    if (JSON.stringify(initialWards) !== JSON.stringify(selectedWards)) {
      setSelectedWards(initialWards);
    }
  }, [initialProvince, initialDistricts, initialWards]);

  const handleProvinceSelect = (province) => {
    setSelectedProvince(province);
    setSelectedDistricts([]);
    setSelectedWards([]);
    setIsDropdownOpen(true);
  };

  const handleDistrictSelect = (district) => {
    if (
      selectedDistricts.length < 3 &&
      !selectedDistricts.some((d) => d.districtId === district.districtId)
    ) {
      setSelectedDistricts([...selectedDistricts, district]);
    }
  };

  const handleWardSelect = (ward) => {
    if (!selectedWards.some((w) => w.wardsId === ward.wardsId)) {
      setSelectedWards([...selectedWards, ward]);
    }
  };

  const handleRemoveDistrict = (districtId) => {
    const districtToRemove = selectedDistricts.find(
      (d) => d.districtId === districtId
    );
    const wardsToRemove = districtToRemove?.wards || [];
    setSelectedDistricts(
      selectedDistricts.filter((d) => d.districtId !== districtId)
    );
    setSelectedWards(
      selectedWards.filter(
        (w) => !wardsToRemove.some((ward) => ward.wardsId === w.wardsId)
      )
    );
  };

  const handleRemoveWard = (wardsId) => {
    setSelectedWards(selectedWards.filter((w) => w.wardsId !== wardsId));
  };

  const handleSearch = (e) => {
    e.stopPropagation();

    let wardsIdList = [];

    if (!selectedProvince) {
      wardsIdList = addressData.flatMap((province) =>
        province.districts.flatMap((district) =>
          district.wards.map((ward) => ward.wardsId)
        )
      );
    } else {
      if (selectedDistricts.length === 0 && selectedWards.length === 0) {
        wardsIdList = selectedProvince.districts.flatMap((district) =>
          district.wards.map((ward) => ward.wardsId)
        );
      } else {
        selectedDistricts.forEach((district) => {
          const districtWards = district.wards.map((ward) => ward.wardsId);
          const selectedWardsInDistrict = selectedWards
            .filter((w) => districtWards.includes(w.wardsId))
            .map((w) => w.wardsId);

          if (selectedWardsInDistrict.length > 0) {
            wardsIdList.push(...selectedWardsInDistrict);
          } else {
            wardsIdList.push(...districtWards);
          }
        });
      }
    }

    wardsIdList = [...new Set(wardsIdList)];

    setIsDropdownOpen(false);
    navigate(ROUTERS.USER.SEARCH, {
      state: {
        wardsId: wardsIdList,
        selectedProvince,
        selectedDistricts,
        selectedWards,
      },
    });
  };

  const handleClear = () => {
    setSelectedProvince(null);
    setSelectedDistricts([]);
    setSelectedWards([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const renderDistrictSummary = () => {
    if (selectedDistricts.length === 0) return null;
    if (selectedDistricts.length === 1) {
      return (
        <span className="district-summary">
          {selectedDistricts[0].districtName}
          <button
            onClick={() =>
              handleRemoveDistrict(selectedDistricts[0].districtId)
            }
          >
            ×
          </button>
        </span>
      );
    }
    return (
      <span className="district-summary">
        {selectedDistricts[0].districtName} + {selectedDistricts.length - 1} Địa
        điểm
      </span>
    );
  };

  const renderWardSummary = () => {
    if (selectedWards.length === 0) return null;
    if (selectedWards.length === 1) {
      return (
        <span className="ward-summary">
          {selectedWards[0].wardsName}
          <button onClick={() => handleRemoveWard(selectedWards[0].wardsId)}>
            ×
          </button>
        </span>
      );
    }
    return (
      <span className="ward-summary">
        {selectedWards[0].wardsName} + {selectedWards.length - 1} phường khác
      </span>
    );
  };

  const getAvailableWards = () => {
    return selectedDistricts.reduce((wards, district) => {
      return [...wards, ...(district.wards || [])];
    }, []);
  };

  return (
    <div className="search-container" ref={searchContainerRef}>
      <div
        className="search-bar-wrapper"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="selected-province">
          {selectedProvince ? (
            <div className="nationwide">
              <div>
                <LuMapPinned />
                {selectedProvince.provinceName.trim()}{" "}
              </div>
              {isDropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>
          ) : (
            <div className="nationwide">
              <LuMapPinned />
              <div>Trên toàn quốc</div>
              {isDropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>
          )}
        </div>
        <div className="selected-district">
          {selectedDistricts.length > 0 &&
            !isDropdownOpen &&
            renderDistrictSummary()}
        </div>
        <div className="selected-wards">
          {selectedWards.length > 0 && !isDropdownOpen && renderWardSummary()}
        </div>
        <button className="search-button" onClick={handleSearch}>
          Tìm kiếm
        </button>
      </div>
      {isDropdownOpen &&
        (selectedDistricts.length > 0 || selectedWards.length > 0) && (
          <div className="selected-items">
            {selectedDistricts.map((district) => (
              <span key={district.districtId} className="chip district-chip">
                {district.districtName}
                <button
                  onClick={() => handleRemoveDistrict(district.districtId)}
                >
                  ×
                </button>
              </span>
            ))}
            {selectedWards.map((ward) => (
              <span key={ward.wardsId} className="chip ward-chip">
                {ward.wardsName}
                <button onClick={() => handleRemoveWard(ward.wardsId)}>
                  ×
                </button>
              </span>
            ))}
            <button className="clear-button" onClick={handleClear}>
              Xóa tất cả
            </button>
          </div>
        )}
      {isDropdownOpen && (
        <div className="filter-dropdown">
          <div className="filter-section">
            {!selectedProvince ? (
              <>
                <label className="filter-label">Tất cả tỉnh thành</label>
                {isLoading ? (
                  <div className="loading-text">Đang tải...</div>
                ) : error ? (
                  <div className="error-text">{error}</div>
                ) : addressData.length > 0 ? (
                  <div className="province-grid">
                    {addressData.map((province) => (
                      <div
                        key={province.provinceId}
                        className="province-item"
                        onClick={() => handleProvinceSelect(province)}
                      >
                        {province.provinceName.trim()}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">Không có dữ liệu tỉnh thành</div>
                )}
              </>
            ) : (
              <>
                <div className="filter-header">
                  <button
                    className="back-button"
                    onClick={() => setSelectedProvince(null)}
                  >
                    Quay lại
                  </button>
                  <label className="filter-label">Chọn quận (tối đa 3)</label>
                </div>
                {selectedDistricts.length >= 3 ? (
                  <div className="no-data">Đã chọn đủ 3 quận</div>
                ) : (
                  <div className="district-grid">
                    {selectedProvince.districts.map((district) => (
                      <div
                        key={district.districtId}
                        className={`district-item ${
                          selectedDistricts.some(
                            (d) => d.districtId === district.districtId
                          )
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleDistrictSelect(district)}
                      >
                        {district.districtName}
                      </div>
                    ))}
                  </div>
                )}
                {selectedDistricts.length > 0 && (
                  <>
                    <label className="filter-label">Chọn phường</label>
                    <div className="ward-grid">
                      {getAvailableWards().map((ward) => (
                        <div
                          key={ward.wardsId}
                          className={`ward-item ${
                            selectedWards.some(
                              (w) => w.wardsId === ward.wardsId
                            )
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => handleWardSelect(ward)}
                        >
                          {ward.wardsName}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;