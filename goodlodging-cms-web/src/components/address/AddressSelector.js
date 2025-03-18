// src/components/AddressSelector.jsx
import React, { useState, useEffect } from 'react';
import './style.scss';
import { useAuth } from '../../context/AuthContext';

const AddressSelector = ({ onAddressChange, initialProvinceId, initialDistrictId, initialWardsId, initialHouseNumber = '', initialStreetName = '' }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(initialProvinceId || '');
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrictId || '');
  const [selectedWard, setSelectedWard] = useState(initialWardsId || '');
  const [houseNumber, setHouseNumber] = useState(initialHouseNumber);
  const [streetName, setStreetName] = useState(initialStreetName);
  const [fullAddress, setFullAddress] = useState('');
  const { addressData, loading } = useAuth();

  useEffect(() => {
    if (!loading && addressData.length > 0) {
      setProvinces(addressData);
      if (initialProvinceId) {
        const province = addressData.find(p => p.provinceId === parseInt(initialProvinceId));
        if (province) {
          setDistricts(province.districts);
          if (initialDistrictId) {
            const district = province.districts.find(d => d.districtId === parseInt(initialDistrictId));
            if (district) {
              setWards(district.wards);
            }
          }
        }
      }
      updateFullAddress(initialProvinceId, initialDistrictId, initialWardsId, initialHouseNumber, initialStreetName); // Cập nhật ban đầu
    }
  }, [addressData, loading, initialProvinceId, initialDistrictId, initialWardsId]);

  const generateFullAddress = (currentProvinceId, currentDistrictId, currentWardsId, currentHouseNumber, currentStreetName) => {
    let addressParts = [];

    if (currentHouseNumber) addressParts.push(currentHouseNumber);
    if (currentStreetName) addressParts.push(currentStreetName);
    if (currentWardsId && wards.length > 0) {
      const ward = wards.find(w => w.wardsId === parseInt(currentWardsId));
      if (ward) addressParts.push(ward.wardsName.trim());
    }
    if (currentDistrictId && districts.length > 0) {
      const district = districts.find(d => d.districtId === parseInt(currentDistrictId));
      if (district) addressParts.push(district.districtName.trim());
    }
    if (currentProvinceId && provinces.length > 0) {
      const province = provinces.find(p => p.provinceId === parseInt(currentProvinceId));
      if (province) addressParts.push(province.provinceName.trim());
    }

    return addressParts.join(', ').trim();
  };

  const updateFullAddress = (
    newProvinceId = selectedProvince,
    newDistrictId = selectedDistrict,
    newWardsId = selectedWard,
    newHouseNumber = houseNumber,
    newStreetName = streetName
  ) => {
    const newFullAddress = generateFullAddress(newProvinceId, newDistrictId, newWardsId, newHouseNumber, newStreetName);
    setFullAddress(newFullAddress);
    onAddressChange({
      provinceId: newProvinceId ? parseInt(newProvinceId) : null,
      districtId: newDistrictId ? parseInt(newDistrictId) : null,
      wardsId: newWardsId ? parseInt(newWardsId) : null,
      houseNumber: newHouseNumber,
      streetName: newStreetName,
      fullAddress: newFullAddress,
    });
  };

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setSelectedDistrict('');
    setSelectedWard('');
    setDistricts([]);
    setWards([]);

    if (provinceId) {
      const province = provinces.find(p => p.provinceId === parseInt(provinceId));
      setDistricts(province ? province.districts : []);
    }
    updateFullAddress(provinceId, '', '', houseNumber, streetName); // Truyền giá trị mới trực tiếp
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setSelectedWard('');
    setWards([]);

    if (districtId) {
      const district = districts.find(d => d.districtId === parseInt(districtId));
      setWards(district ? district.wards : []);
    }
    updateFullAddress(selectedProvince, districtId, '', houseNumber, streetName); // Truyền giá trị mới trực tiếp
  };

  const handleWardChange = (e) => {
    const wardsId = e.target.value;
    setSelectedWard(wardsId);
    updateFullAddress(selectedProvince, selectedDistrict, wardsId, houseNumber, streetName); // Truyền giá trị mới trực tiếp
  };

  const handleHouseNumberChange = (e) => {
    const value = e.target.value;
    setHouseNumber(value);
    updateFullAddress(selectedProvince, selectedDistrict, selectedWard, value, streetName); // Truyền giá trị mới trực tiếp
  };

  const handleStreetNameChange = (e) => {
    const value = e.target.value;
    setStreetName(value);
    updateFullAddress(selectedProvince, selectedDistrict, selectedWard, houseNumber, value); // Truyền giá trị mới trực tiếp
  };

  if (loading) return <div>Loading address data...</div>;

  return (
    <div className="address-selector">
      <h3>Chọn địa chỉ</h3>
      <div className="address-row">
        <div className="form-group">
          <label>Tỉnh/Thành phố:</label>
          <select value={selectedProvince} onChange={handleProvinceChange}>
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map((province) => (
              <option key={province.provinceId} value={province.provinceId}>
                {province.provinceName.trim()}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Quận/Huyện:</label>
          <select value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedProvince}>
            <option value="">Chọn quận/huyện</option>
            {districts.map((district) => (
              <option key={district.districtId} value={district.districtId}>
                {district.districtName.trim()}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Phường/Xã:</label>
          <select value={selectedWard} onChange={handleWardChange} disabled={!selectedDistrict}>
            <option value="">Chọn phường/xã</option>
            {wards.map((ward) => (
              <option key={ward.wardsId} value={ward.wardsId}>
                {ward.wardsName.trim()}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Tên đường:</label>
          <input
            type="text"
            value={streetName}
            onChange={handleStreetNameChange}
            placeholder="Tên đường"
          />
        </div>
        <div className="form-group">
          <label>Số nhà:</label>
          <input
            type="number"
            value={houseNumber}
            onChange={handleHouseNumberChange}
            placeholder="Số nhà"
          />
        </div>
      </div>
      <div className="form-group full-address">
        <label>Địa chỉ đầy đủ:</label>
        <div>{fullAddress}</div>
      </div>
    </div>
  );
};

export default AddressSelector;