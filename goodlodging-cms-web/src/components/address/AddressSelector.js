import React, { useState, useEffect } from 'react';
import './style.scss';
import { useAuth } from '../../context/AuthContext';

const AddressSelector = ({
  onAddressChange,
  initialProvinceId,
  initialDistrictId,
  initialWardsId,
  initialHouseNumber = '',
  initialStreetName = '',
  initialFullAddress = '',
}) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [houseNumber, setHouseNumber] = useState(initialHouseNumber);
  const [streetName, setStreetName] = useState(initialStreetName);
  const [fullAddress, setFullAddress] = useState(initialFullAddress);
  const { addressData, loading } = useAuth();

  // Đồng bộ state với giá trị ban đầu từ props
  useEffect(() => {
    setSelectedProvince(initialProvinceId ? String(initialProvinceId) : '');
    setSelectedDistrict(initialDistrictId ? String(initialDistrictId) : '');
    setSelectedWard(initialWardsId ? String(initialWardsId) : '');
    setHouseNumber(initialHouseNumber);
    setStreetName(initialStreetName);
    setFullAddress(initialFullAddress);
  }, [initialProvinceId, initialDistrictId, initialWardsId, initialHouseNumber, initialStreetName, initialFullAddress]);

  // Cập nhật provinces, districts, wards từ addressData
  useEffect(() => {
    if (!loading && addressData.length > 0) {
      console.log('addressData:', addressData);
      setProvinces(addressData);

      // Cập nhật districts và wards dựa trên initial values
      if (initialProvinceId) {
        const province = addressData.find(p => String(p.provinceId) === String(initialProvinceId));
        if (province) {
          setDistricts(province.districts || []);
          if (initialDistrictId) {
            const district = province.districts.find(d => String(d.districtId) === String(initialDistrictId));
            if (district) {
              setWards(district.wards || []);
            }
          }
        }
      }

      // Gọi updateFullAddress sau khi tất cả state đã được cập nhật
      updateFullAddress(
        initialProvinceId ? String(initialProvinceId) : '',
        initialDistrictId ? String(initialDistrictId) : '',
        initialWardsId ? String(initialWardsId) : '',
        initialHouseNumber,
        initialStreetName
      );
    }
  }, [addressData, loading, initialProvinceId, initialDistrictId, initialWardsId, initialHouseNumber, initialStreetName]);

  const generateFullAddress = (currentProvinceId, currentDistrictId, currentWardsId, currentHouseNumber, currentStreetName) => {
    let addressParts = [];

    // Thêm số nhà và tên đường
    if (currentHouseNumber) addressParts.push(currentHouseNumber);
    if (currentStreetName) addressParts.push(currentStreetName);

    // Thêm phường/xã
    if (currentWardsId && wards.length > 0) {
      const ward = wards.find(w => String(w.wardsId) === String(currentWardsId));
      if (ward) {
        addressParts.push(ward.wardsName.trim());
      } else {
        console.warn(`Ward not found for wardsId: ${currentWardsId}`);
      }
    }

    // Thêm quận/huyện
    if (currentDistrictId && districts.length > 0) {
      const district = districts.find(d => String(d.districtId) === String(currentDistrictId));
      if (district) {
        addressParts.push(district.districtName.trim());
      } else {
        console.warn(`District not found for districtId: ${currentDistrictId}`);
      }
    }

    // Thêm tỉnh/thành phố
    if (currentProvinceId && provinces.length > 0) {
      const province = provinces.find(p => String(p.provinceId) === String(currentProvinceId));
      if (province) {
        addressParts.push(province.provinceName.trim());
      } else {
        console.warn(`Province not found for provinceId: ${currentProvinceId}`);
      }
    }

    const result = addressParts.join(', ').trim();
    console.log('Generated Full Address:', result, {
      currentProvinceId,
      currentDistrictId,
      currentWardsId,
      currentHouseNumber,
      currentStreetName,
    });

    // Nếu result không đầy đủ và initialFullAddress tồn tại, dùng initialFullAddress
    return result || initialFullAddress || 'Chưa có địa chỉ đầy đủ';
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
      const province = provinces.find(p => String(p.provinceId) === String(provinceId));
      setDistricts(province ? province.districts : []);
    }
    updateFullAddress(provinceId, '', '', houseNumber, streetName);
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setSelectedWard('');
    setWards([]);

    if (districtId) {
      const district = districts.find(d => String(d.districtId) === String(districtId));
      setWards(district ? district.wards : []);
    }
    updateFullAddress(selectedProvince, districtId, '', houseNumber, streetName);
  };

  const handleWardChange = (e) => {
    const wardsId = e.target.value;
    setSelectedWard(wardsId);
    updateFullAddress(selectedProvince, selectedDistrict, wardsId, houseNumber, streetName);
  };

  const handleHouseNumberChange = (e) => {
    const value = e.target.value;
    setHouseNumber(value);
    updateFullAddress(selectedProvince, selectedDistrict, selectedWard, value, streetName);
  };

  const handleStreetNameChange = (e) => {
    const value = e.target.value;
    setStreetName(value);
    updateFullAddress(selectedProvince, selectedDistrict, selectedWard, houseNumber, value);
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
            type="text"
            value={houseNumber}
            onChange={handleHouseNumberChange}
            placeholder="Số nhà"
          />
        </div>
      </div>
      <div className="form-group full-address">
        <label>Địa chỉ đầy đủ:</label>
        <div>{fullAddress || 'Chưa có địa chỉ đầy đủ'}</div>
      </div>
    </div>
  );
};

export default AddressSelector;