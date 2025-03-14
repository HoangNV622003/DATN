import React, { memo } from 'react';
import './style.scss';
import prices from '../../constants/PricesConstants';
import areas from '../../constants/AreaConstants';
const ConfigView = () => {
    
    return (
        <div className="container-config-view">
            <h3>Bộ lọc tìm kiếm</h3>
            <label htmlFor="config-room-price">Giá phòng</label>
            <ul className='config-room-price'>
                {prices.roomPrice.map((price, index) => (
                    <li key={index}>
                        <input type="radio" id={`price-${index}`} name="roomPrice" />
                        <label htmlFor={`price-${index}`}>{price.name}</label>
                    </li>
                ))}
            </ul>

            <label htmlFor="config-electricity-price">Giá tiền điện</label>
            <ul className='config-electricity-price'>
               {
                     prices.electricityPrice.map((price, index) => (
                          <li key={index}>
                            <input type="radio" id={`price-${index}`} name="electricityPrice" />
                            <label htmlFor={`price-${index}`}>{price.name}</label>
                          </li>
                     ))
               }
            </ul>

           <label htmlFor="config-price">Giá tiền nước</label>
            <ul className='config-price'>
                {
                    prices.waterPrice.map((price, index) => (
                        <li key={index}>
                            <input type="radio" id={`price-${index}`} name="waterPrice"/>
                            <label htmlFor={`price-${index}`}>{price.name}</label>
                        </li>
                    ))
                }
            </ul>
            <label htmlFor="config-area">Diện tích</label>
            <ul className='config-area'>
                {
                    areas.map((area, index) => (
                        <li key={index}>
                            <input type="radio" id={`area-${index}`} name={`area-${index}`} />
                            <label htmlFor={`area-${index}`}>{area.name}</label>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
};
export default memo(ConfigView);