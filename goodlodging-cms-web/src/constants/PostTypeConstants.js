export const postTypeConstants = [
    {
        id: 1,
        name: "Tất cả",
        value: 0
    },
    
    {
        id: 3,
        name: "Tìm phòng trống",
        value: 1
    },
    {
        id: 2,
        name: "Tìm phòng ở ghép",
        value: 2
    },
]
export const getValuesExcludingId = (id,postTypeConstants) => {
    return postTypeConstants
        .filter(item => item.id !== id)
        .map(item => item.value);
};