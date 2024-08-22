

export const getCurrentDate = () => {
    const date = new Date();
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    let year = date.getFullYear();

    day = day.length < 2 ? '0' + day: day;
    month = month.length < 2 ? '0' + month : month;

    return `${day}.${month}.${year}`;

}

export const datePicker = () => {

    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Muista lisätä 1 kuukauteen
    const year = currentDate.getFullYear();
    const thisDay = `${day}.${month}.${year}`;

    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const timeOnly = `${hours}:${minutes}:${seconds}`;

    return timeOnly;

}