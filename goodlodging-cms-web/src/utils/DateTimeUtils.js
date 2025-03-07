export const formatDate=(dateTime)=>{
    const date=new Date(dateTime);
    if(isNaN(date)) return "Invalid Date";
    return date.toISOString().split("T")[0];
}