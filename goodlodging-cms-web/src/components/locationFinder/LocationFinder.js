import React, { useState } from 'react';
import axios from 'axios';
import './LocationFinder.scss';

const LocationFinder = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState({
    province: '',
    district: '',
    ward: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResult, setSearchResult] = useState('');

  const getCurrentLocation = () => {
    setError('');
    setLoading(true);
    setAddress({ province: '', district: '', ward: '' });
    setSearchResult('');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });
          reverseGeocode(lat, lng);
        },
        (err) => {
          setLoading(false);
          setError(`Lỗi lấy vị trí: ${err.message}`);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLoading(false);
      setError('Trình duyệt không hỗ trợ Geolocation');
    }
  };

  const reverseGeocode = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'GoodLodgingService/1.0 (your.email@example.com)', // Thay bằng email hoặc tên ứng dụng của bạn
        },
      });
      const data = response.data;

      if (data && data.address) {
        setAddress({
          province:  data.address.city || 'Không tìm thấy',
          district:  data.address.suburb|| 'Không tìm thấy',
          ward:  data.address.quarter||'Không tìm thấy',
        });
        console.log('Địa chỉ:', data.address);
        setError('');
      } else {
        setError('Không tìm thấy địa chỉ');
      }
    } catch (err) {
      setError(`Lỗi khi gọi Nominatim API: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationBasedSearch = async () => {
    if (!address.province || address.province === 'Không tìm thấy') {
      setError('Vui lòng lấy vị trí hợp lệ trước khi tìm kiếm');
      return;
    }

    setLoading(true);
    setSearchResult('');

    try {
      const response = await axios.post('http://localhost:8080/api/chat', {
        message: `Tìm nhà trọ ở ${address.province}, ${address.district}, ${address.ward}`,
        identifier: 'user123', // Thay bằng ID người dùng thực tế
      });

      setSearchResult(response.data.content);
      if (response.data.posts && response.data.posts.length > 0) {
        setSearchResult(
          `${response.data.content}\n\nDanh sách nhà trọ:\n${response.data.posts
            .map((post) => `- ${post.title} (Giá: ${post.minRent} VNĐ)`)
            .join('\n')}`
        );
      }
    } catch (err) {
      setError('Lỗi khi tìm kiếm nhà trọ: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="location-finder">
      <h2>Lấy tên tỉnh, huyện, xã từ vị trí hiện tại</h2>
      <button onClick={getCurrentLocation} disabled={loading}>
        {loading ? 'Đang lấy vị trí...' : 'Lấy vị trí hiện tại'}
      </button>
      <button
        onClick={handleLocationBasedSearch}
        disabled={loading || !address.province || address.province === 'Không tìm thấy'}
      >
        Tìm nhà trọ tại vị trí này
      </button>
      <div className="result">
        {location.lat && location.lng && (
          <p>Tọa độ: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
        )}
        {address.province && <p>Tỉnh/Thành phố: {address.province}</p>}
        {address.district && <p>Quận/Huyện: {address.district}</p>}
        {address.ward && <p>Phường/Xã: {address.ward}</p>}
        {searchResult && (
          <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>{searchResult}</pre>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default LocationFinder;