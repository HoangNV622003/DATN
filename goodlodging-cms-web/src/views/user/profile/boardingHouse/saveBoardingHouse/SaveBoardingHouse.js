import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import { useParams } from 'react-router-dom';
import { createBoardingHouse, fetchHouse, updateBoardingHouse } from '../../../../../apis/house/BoardingHouseService';
import RoomList from '../rooms/RoomList';
import AddressSelector from '../../../../../components/address/AddressSelector';
import FeatureSelector from '../../../../../components/features/FeatureSelector';
import './style.scss';
import { IMAGE_URL } from '../../../../../utils/ApiUrl';
import { toast } from 'react-toastify'; // Import toast

const SaveBoardingHouse = () => {
  const { boardingHouseId } = useParams();
  const { token, isLogin, loading } = useAuth();

  const [formData, setFormData] = useState({
    userId: null,
    name: '',
    description: '',
    roomRent: '',
    roomArea: '',
    electricityPrice: '',
    waterPrice: '',
    features: [],
    address: {
      houseNumber: '',
      streetName: '',
      wardsId: '',
      districtId: '',
      provinceId: '',
      fullAddress: '',
    },
    rooms: boardingHouseId ? [] : [{ id: '', boardingHouseId: null, name: '', description: '', area: '', floor: '', price: '', capacity: '' }],
  });

  const [allImages, setAllImages] = useState([]);
  const [combinedImagePreviews, setCombinedImagePreviews] = useState([]);
  const [imageError, setImageError] = useState('');
  const [savedBoardingHouseId, setSavedBoardingHouseId] = useState(boardingHouseId || null);

  useEffect(() => {
    if (!isLogin || loading) return;
    if (boardingHouseId) {
      console.log("Token:", token);
      fetchBoardingHouseData();
    }
  }, [boardingHouseId, token, isLogin, loading]);

  useEffect(() => {
    return () => {
      combinedImagePreviews.forEach(preview => {
        if (preview.startsWith('blob:')) URL.revokeObjectURL(preview);
      });
    };
  }, [combinedImagePreviews]);

  const fetchBoardingHouseData = async () => {
    try {
      const data = await fetchHouse(boardingHouseId, token);
      console.log('API Response:', data);
      console.log('Address from API:', data.address);

      const existingImageUrls = data.images.map(img => img.imageUrl);

      setFormData({
        userId: data.userId || null,
        name: data.name || '',
        description: data.description || '',
        roomRent: data.roomRent || '',
        roomArea: data.roomArea || '',
        electricityPrice: data.electricityPrice || '',
        waterPrice: data.waterPrice || '',
        features: data.features ? data.features.split(',') : [],
        address: {
          houseNumber: data.address?.houseNumber || '',
          streetName: data.address?.streetName || '',
          wardsId: data.address?.wardsId ? String(data.address.wardsId) : '',
          districtId: data.address?.districtId ? String(data.address.districtId) : '',
          provinceId: data.address?.provinceId ? String(data.address.provinceId) : '',
          fullAddress: data.address?.fullAddress || '',
        },
        rooms: data.rooms.map(room => ({
          id: room.id,
          boardingHouseId: room.boardingHouseId,
          name: room.name || '',
          description: room.description || '',
          area: room.area || '',
          floor: room.floor || '',
          price: room.price || '',
          capacity: room.capacity || '',
        })) || [],
      });

      setAllImages(existingImageUrls);
      setCombinedImagePreviews(existingImageUrls.map(url => `${IMAGE_URL}${url}`));
    } catch (error) {
      console.error('Error fetching boarding house:', error);
      toast.error('Lỗi khi tải dữ liệu nhà trọ!');
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
        wardsId: address.wardsId ? String(address.wardsId) : '',
        districtId: address.districtId ? String(address.districtId) : '',
        provinceId: address.provinceId ? String(address.provinceId) : '',
        fullAddress: address.fullAddress || '',
      },
    });
  };

  const handleFeaturesChange = (updatedFeatures) => {
    setFormData({ ...formData, features: updatedFeatures });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    const invalidFiles = files.filter(file => !validImageTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setImageError('Chỉ chấp nhận các định dạng ảnh: JPEG, PNG, GIF, WebP.');
      toast.warn('Chỉ chấp nhận các định dạng ảnh: JPEG, PNG, GIF, WebP.');
      return;
    }

    const updatedImages = [...allImages, ...files];
    const totalImages = updatedImages.length;

    if (totalImages < 5) {
      setImageError(`Vui lòng chọn thêm ${5 - totalImages} ảnh để đủ tối thiểu 5 ảnh.`);
    } else if (totalImages > 10) {
      setImageError(`Bạn đã chọn quá ${totalImages - 10} ảnh. Tối đa 10 ảnh.`);
      toast.warn(`Bạn đã chọn quá ${totalImages - 10} ảnh. Tối đa 10 ảnh.`);
      return;
    } else {
      setImageError('');
    }

    setAllImages(updatedImages);
    setCombinedImagePreviews(updatedImages.map(item =>
      typeof item === 'string' ? `${IMAGE_URL}${item}` : URL.createObjectURL(item)
    ));
  };

  const handleRemoveImage = (index) => {
    const updatedImages = allImages.filter((_, i) => i !== index);
    const preview = combinedImagePreviews[index];
    if (preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    setAllImages(updatedImages);
    setCombinedImagePreviews(updatedImages.map(item =>
      typeof item === 'string' ? `${IMAGE_URL}${item}` : URL.createObjectURL(item)
    ));

    const totalImages = updatedImages.length;
    if (totalImages < 5) {
      setImageError(`Vui lòng chọn thêm ${5 - totalImages} ảnh để đủ tối thiểu 5 ảnh.`);
    } else {
      setImageError('');
    }
    toast.success('Đã xóa ảnh!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin) {
      toast.warn('Vui lòng đăng nhập để lưu nhà trọ!');
      return;
    }

    const totalImages = allImages.length;
    if (totalImages < 5) {
      toast.warn(`Tổng số ảnh (${totalImages}) phải ít nhất 5!`);
      return;
    } else if (totalImages > 10) {
      toast.warn(`Tổng số ảnh (${totalImages}) vượt quá tối đa 10!`);
      return;
    }

    try {
      let newBoardingHouseId = boardingHouseId;
      const submitData = new FormData();
      submitData.append('userId', localStorage.getItem('userId') || formData.userId);
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('roomRent', formData.roomRent);
      submitData.append('roomArea', formData.roomArea);
      submitData.append('electricityPrice', formData.electricityPrice);
      submitData.append('waterPrice', formData.waterPrice);
      submitData.append('features', formData.features.join(','));

      submitData.append('address.houseNumber', formData.address.houseNumber);
      submitData.append('address.streetName', formData.address.streetName);
      submitData.append('address.wardsId', formData.address.wardsId);
      submitData.append('address.districtId', formData.address.districtId);
      submitData.append('address.provinceId', formData.address.provinceId);
      submitData.append('address.fullAddress', formData.address.fullAddress);

      const imageUrls = allImages.filter(item => typeof item === 'string');
      const imageFiles = allImages.filter(item => typeof item !== 'string');

      if (boardingHouseId) {
        imageUrls.forEach((url, index) => {
          submitData.append(`imageUrls[${index}].imageUrl`, url);
        });
        imageFiles.forEach((file, index) => {
          submitData.append(`imageFiles[${index}].imageFile`, file);
        });
      } else {
        imageFiles.forEach((file, index) => {
          submitData.append(`imagesFiles[${index}].imageFile`, file);
        });
      }

      let response;
      if (boardingHouseId) {
        console.log('Submitting imageUrls:', imageUrls);
        response = await updateBoardingHouse(boardingHouseId, submitData, token);
        toast.success('Cập nhật nhà trọ thành công!');
      } else {
        response = await createBoardingHouse(submitData, token);
        newBoardingHouseId = response.data.id;
        setFormData(prev => ({
          ...prev,
          rooms: prev.rooms.map(room => ({ ...room, boardingHouseId: newBoardingHouseId })),
        }));
        toast.success('Tạo nhà trọ mới thành công!');
      }

      const updatedImages = response.data.images.map(img => img.imageUrl);
      setAllImages(updatedImages);
      setCombinedImagePreviews(updatedImages.map(url => `${IMAGE_URL}${url}`));
      setSavedBoardingHouseId(newBoardingHouseId);
    } catch (error) {
      console.error('Error saving boarding house:', error);
    }
  };

  const handleRoomChange = (updatedRooms) => {
    setFormData({ ...formData, rooms: updatedRooms });
  };

  if (loading) return <div>Loading...</div>;
  if (!isLogin) return <div>Vui lòng đăng nhập để lưu nhà trọ!</div>;

  console.log('Props passed to AddressSelector:', {
    initialProvinceId: formData.address.provinceId,
    initialDistrictId: formData.address.districtId,
    initialWardsId: formData.address.wardsId,
    initialHouseNumber: formData.address.houseNumber,
    initialStreetName: formData.address.streetName,
    initialFullAddress: formData.address.fullAddress,
  });

  return (
    <div className="save-boarding-house">
      <h2>{boardingHouseId ? 'Chỉnh sửa nhà trọ' : 'Tạo nhà trọ mới'}</h2>
      <form onSubmit={handleSubmit}>
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

        <FeatureSelector
          selectedFeatures={formData.features}
          onFeaturesChange={handleFeaturesChange}
        />

        <AddressSelector
          onAddressChange={handleAddressChange}
          initialProvinceId={formData.address.provinceId}
          initialDistrictId={formData.address.districtId}
          initialWardsId={formData.address.wardsId}
          initialHouseNumber={formData.address.houseNumber}
          initialStreetName={formData.address.streetName}
          initialFullAddress={formData.address.fullAddress}
        />

        <h3>Hình ảnh</h3>
        <div className="image-section">
          <label>Chọn ảnh (Tối thiểu 5, tối đa 10 ảnh):</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          {imageError && <span className="error-message">{imageError}</span>}
          {combinedImagePreviews.length > 0 && (
            <div className="image-previews">
              {combinedImagePreviews.map((preview, index) => (
                <div key={index} className="preview-container">
                  <img src={preview} alt="Preview" width="100" />
                  <button type="button" onClick={() => handleRemoveImage(index)}>
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button type="submit">{boardingHouseId ? 'Cập nhật' : 'Tạo mới'}</button>
      </form>

      {(boardingHouseId || savedBoardingHouseId) && (
        <div>
          <h3>Phòng trọ</h3>
          <RoomList
            rooms={formData.rooms}
            onRoomChange={handleRoomChange}
            boardingHouseId={savedBoardingHouseId || boardingHouseId}
          />
        </div>
      )}
    </div>
  );
};

export default SaveBoardingHouse;