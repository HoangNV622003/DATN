const prices={
    roomPrice: [
        {
            id: 0,
            name: 'Tất cả',
            min:0,
            max:100000000,
        },
        {
            id: 1,
            name: 'Dưới 1 triệu',
            min:0,
            max:1000000,
        },
        {
            id: 2,
            name: 'Từ 1 - 2 triệu',
            min:1000000,
            max:2000000,
        },
        {
            id: 3,
            name: 'Từ 2 - 3 triệu',
            min:2000000,
            max:3000000,
        },
        {
            id: 4,
            name: 'Từ 3 - 4 triệu',
            min:3000000,
            max:4000000,
        },
        {
            id: 5,
            name: 'Từ 4 - 5 triệu',
            min:4000000,
            max:5000000,
        },
        {
            id: 6,
            name: 'Trên 5 triệu',
            min:5000000,
            max:100000000,
        }
    ],
    electricityPrice: [
        {
            id: 0,
            name: 'Tất cả',
            min:0,
            max:1000000,
        },
        {
            id: 1,
            name: 'Dưới 3000đ/kWh',
            min:0,
            max:3000,
        },
        {
            id: 2,
            name: 'Từ 3000đ - 4000đ/kWh',
            min:3000,
            max:4000,
        },
        {
            id: 3,
            name: 'Từ 4000đ - 5000đ/kWh',
            min:4000,
            max:5000,
        },
        {
            id: 4,
            name: 'Trên 5000đ/kWh',
            min:5000,
            max:1000000,
        }
    ],
    waterPrice: [
        {
            id: 0,
            name: 'Tất cả',
            min:0,
            max:100000,
        },
        {
            id: 1,
            name: <>Dưới 3000đ/m&sup3;</>,
            min:0,
            max:3000,
        },
        {
            id: 2,
            name: <>Từ 3000đ - 4000đ/m&sup3;</>,
            min:3000,
            max:4000,
        },
        {
            id: 3,
            name: <>Từ 4000đ - 5000đ/m&sup3;</>,
            min:4000,
            max:5000,
        },
        {
            id: 4,
            name: <>Trên 5000đ/m&sup3;</>,
            min:5000,
            max:100000,
        }
    ]
}
export default prices;