

export const getCurrentDate = () => {
    const date = new Date();
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    let year = date.getFullYear();

    day = day.length < 2 ? '0' + day: day;
    month = month.length < 2 ? '0' + month : month;

    return `${day}.${month}.${year}`;

}