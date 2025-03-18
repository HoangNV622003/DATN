import { memo } from 'react';
import BoardingHouseItem from '../BoardingHouseItem/BoardingHouseItem';
import './style.scss';

const ListBoardingHouse = ({ boardingHouses, onSelect, selectedId, isSavePost }) => {
    return (
        <div className='list__boarding__house'>
            {boardingHouses.length > 0 ? (
                boardingHouses.map((item, key) => (
                    <BoardingHouseItem
                        key={key}
                        data={item}
                        onSelect={onSelect}
                        isSelected={selectedId === item.id}
                        isSavePost={isSavePost}
                    />
                ))
            ) : (
                <div className="no-data">Không có nhà trọ nào.</div>
            )}
        </div>
    );
};

export default memo(ListBoardingHouse);