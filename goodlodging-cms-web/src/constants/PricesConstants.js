const prices={
    roomPrice: [
        {
            id: 0,
            name: 'Tất cả',
            minValue:0,
            maxValue:100000000,
        },
        {
            id: 1,
            name: 'Dưới 1 triệu',
            minValue:0,
            maxValue:10000000,
        },
        {
            id: 2,
            name: 'Từ 1 - 2 triệu',
            minValue:1000000,
            maxValue:2000000,
        },
        {
            id: 3,
            name: 'Từ 2 - 3 triệu',
            minValue:2000000,
            maxValue:3000000,
        },
        {
            id: 4,
            name: 'Từ 3 - 4 triệu',
            minValue:3000000,
            maxValue:4000000,
        },
        {
            id: 5,
            name: 'Từ 4 - 5 triệu',
            minValue:4000000,
            maxValue:5000000,
        },
        {
            id: 6,
            name: 'Trên 5 triệu',
            minValue:5000000,
            maxValue:100000000,
        }
    ],
    electricityPrice: [
        {
            id: 0,
            name: 'Tất cả',
            minValue:0,
            maxValue:1000000,
        },
        {
            id: 1,
            name: 'Dưới 3000đ/kWh',
            minValue:0,
            maxValue:3000,
        },
        {
            id: 2,
            name: 'Từ 3000đ - 4000đ/kWh',
            minValue:3000,
            maxValue:4000,
        },
        {
            id: 3,
            name: 'Từ 4000đ - 5000đ/kWh',
            minValue:4000,
            maxValue:5000,
        },
        {
            id: 4,
            name: 'Trên 5000đ/kWh',
            minValue:5000,
            maxValue:1000000,
        }
    ],
    waterPrice: [
        {
            id: 0,
            name: 'Tất cả',
            minValue:0,
            maxValue:100000,
        },
        {
            id: 1,
            name: 'Dưới 3000đ/m&sup3;',
            minValue:0,
            maxValue:3000,
        },
        {
            id: 2,
            name: 'Từ 3000đ - 4000đ/m&sup3;',
            minValue:3000,
            maxValue:4000,
        },
        {
            id: 3,
            name: 'Từ 4000đ - 5000đ/m&sup3;',
            minValue:4000,
            maxValue:5000,
        },
        {
            id: 4,
            name: 'Trên 5000đ/m&sup3;',
            minValue:5000,
            maxValue:100000,
        }
    ]
}
export default prices;