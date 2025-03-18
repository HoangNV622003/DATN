// src/components/SaveBoardingHouse.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTERS } from '../../../../../utils/router/Router';
import { createBoardingHouse, fetchHouse, updateBoardingHouse } from '../../../../../apis/house/BoardingHouseService';
import RoomList from '../rooms/RoomList';
import AddressSelector from '../../../../../components/address/AddressSelector';
import FeatureSelector from '../../../../../components/features/FeatureSelector';
import './style.scss';

const SaveBoardingHouse = () => {
  const { boardingHouseId } = useParams();
  const { token, isLogin, loading, addressData } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: null,
    name: '',
    description: '',
    roomRent: '',
    roomArea: '',
    images: [],
    electricityPrice: '',
    waterPrice: '',
    features: [], // Thay đổi từ string thành array
    address: {
      houseNumber: '',
      streetName: '',
      wardsId: '',
      districtId: '',
      provinceId: '',
      fullAddress: '',
    },
    rooms: [{ boardingHouseId: boardingHouseId || null, name: '', description: '', area: '', floor: '' }],
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (!isLogin || loading) return;
    if (boardingHouseId) {
      fetchBoardingHouseData();
    }
  }, [boardingHouseId, token, isLogin, loading]);

  const fetchBoardingHouseData = async () => {
    try {
      const data = await fetchHouse(boardingHouseId);
      setFormData({
        userId: data.userId || null,
        name: data.name || '',
        description: data.description || '',
        roomRent: data.roomRent || '',
        roomArea: data.roomArea || '',
        images: [],
        electricityPrice: data.electricityPrice || '',
        waterPrice: data.waterPrice || '',
        features: data.features ? data.features.split(',') : [], // Chuyển string thành array
        address: {
          houseNumber: data.address?.houseNumber || '',
          streetName: data.address?.streetName || '',
          wardsId: data.address?.wardsId || '',
          districtId: data.address?.districtId || '',
          provinceId: data.address?.provinceId || '',
          fullAddress: data.address?.fullAddress || data.address || '',
        },
        rooms: data.rooms.map(room => ({
          boardingHouseId: room.boardingHouseId,
          name: room.name || '',
          description: room.description || '',
          area: room.area || '',
          floor: room.floor || '',
        })) || [],
      });
      setExistingImages(data.images.map(img => ({ id: img.id, url: img.imageUrl })));
    } catch (error) {
      console.error('Error fetching boarding house:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (address) => {
    setFormData({
      ...formData,
      address: {
        houseNumber: address.houseNumber || '',
        streetName: address.streetName || '',
        wardsId: address.wardsId || '',
        districtId: address.districtId || '',
        provinceId: address.provinceId || '',
        fullAddress: address.fullAddress || '',
      },
    });
  };

  const handleFeaturesChange = (updatedFeatures) => {
    setFormData({ ...formData, features: updatedFeatures });
  };

  const removeRoom = (index) => {
    setFormData({
      ...formData,
      rooms: formData.rooms.filter((_, i) => i !== index),
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = boardingHouseId ? existingImages.length + files.length : files.length;

    if (totalImages < 5) {
      setImageError('Vui lòng chọn ít nhất 5 ảnh.');
      setNewImagePreviews([]);
      setFormData({ ...formData, images: [] });
      return;
    } else if (totalImages > 10) {
      setImageError('Bạn chỉ có thể chọn tối đa 10 ảnh.');
      setNewImagePreviews([]);
      setFormData({ ...formData, images: [] });
      return;
    } else {
      setImageError('');
      setFormData({ ...formData, images: files });
      const previews = files.map(file => URL.createObjectURL(file));
      setNewImagePreviews(previews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin) {
      alert('Vui lòng đăng nhập để lưu nhà trọ!');
      return;
    }

    const totalImages = boardingHouseId ? existingImages.length + formData.images.length : formData.images.length;
    if (totalImages < 5) {
      alert('Vui lòng chọn ít nhất 5 ảnh trước khi lưu!');
      return;
    } else if (totalImages > 10) {
      alert('Bạn chỉ có thể chọn tối đa 10 ảnh!');
      return;
    }

    const submitData = new FormData();
    submitData.append('userId', localStorage.getItem('userId') || formData.userId);
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('roomRent', formData.roomRent);
    submitData.append('roomArea', formData.roomArea);
    formData.images.forEach(file => submitData.append('images', file));
    submitData.append('electricityPrice', formData.electricityPrice);
    submitData.append('waterPrice', formData.waterPrice);
    submitData.append('features', formData.features.join(',')); // Chuyển array thành string
    submitData.append('address', JSON.stringify(formData.address));
    submitData.append('rooms', JSON.stringify(formData.rooms));

    try {
      if (boardingHouseId) {
        await updateBoardingHouse(boardingHouseId, submitData);
        alert('Cập nhật thành công!');
      } else {
        await createBoardingHouse(submitData);
        alert('Tạo mới thành công!');
      }
      navigate(`/${ROUTERS.USER.PROFILE}`);
    } catch (error) {
      console.error('Error saving boarding house:', error);
      alert('Lưu thất bại!');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isLogin) return <div>Vui lòng đăng nhập để lưu nhà trọ!</div>;

  return (
    <div className="save-boarding-house">
      <h2>{boardingHouseId ? 'Chỉnh sửa nhà trọ' : 'Tạo nhà trọ mới'}</h2>
      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div>
          <label>Tên nhà trọ:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Mô tả:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div className="price-area-grid">
          <div>
            <label>Giá thuê phòng (VNĐ):</label>
            <input type="number" name="roomRent" value={formData.roomRent} onChange={handleChange} required />
          </div>
          <div>
            <label>Diện tích phòng (m²):</label>
            <input type="number" name="roomArea" value={formData.roomArea} onChange={handleChange} required />
          </div>
          <div>
            <label>Giá điện (VNĐ/kWh):</label>
            <input type="number" step="0.1" name="electricityPrice" value={formData.electricityPrice} onChange={handleChange} />
          </div>
          <div>
            <label>Giá nước (VNĐ/m³):</label>
            <input type="number" name="waterPrice" value={formData.waterPrice} onChange={handleChange} />
          </div>
        </div>

        {/* Features */}
        <FeatureSelector
          selectedFeatures={formData.features}
          onFeaturesChange={handleFeaturesChange}
        />

        {/* Address */}
        <AddressSelector
          onAddressChange={handleAddressChange}
          initialProvinceId={formData.address.provinceId}
          initialDistrictId={formData.address.districtId}
          initialWardsId={formData.address.wardsId}
          initialHouseNumber={formData.address.houseNumber}
          initialStreetName={formData.address.streetName}
        />

        {/* Images */}
        <h3>Hình ảnh</h3>
        {existingImages.length > 0 && (
          <div className="image-section">
            <h4>Ảnh hiện có ({existingImages.length}):</h4>
            {existingImages.map((img) => (
              <img key={img.id} src={img.url} alt="Existing" width="100" />
            ))}
          </div>
        )}
        <div className="image-section">
          <label>Thêm ảnh mới (Tối thiểu 5, tối đa 10 ảnh):</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          {imageError && <span className="error-message">{imageError}</span>}
          {newImagePreviews.length > 0 && (
            <div className="image-previews">
              {newImagePreviews.map((preview, index) => (
                <img key={index} src={preview} alt="Preview" width="100" />
              ))}
            </div>
          )}
        </div>
        <button type="submit">{boardingHouseId ? 'Cập nhật' : 'Tạo mới'}</button>
      </form>
      <h3>Phòng trọ</h3>
      <RoomList
        rooms={formData.rooms}
        onRoomChange={(updatedRooms) => setFormData({ ...formData, rooms: updatedRooms })}
        onRemoveRoom={(index) => removeRoom(index)}
      />
    </div>
  );
};

export default SaveBoardingHouse;