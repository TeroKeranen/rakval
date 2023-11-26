
export const calculateWorkHours = (startDateString, startTimeString, endDateString, endTimeString) => {

     // Muodosta Date-objektit aloitus- ja lopetusajoista

    const startDateTime = new Date(`${startDateString}T${startTimeString}`);
    const endDateTime = new Date(`${endDateString}T${endTimeString}`);

    // Laske aikaero millisekunteina
    const timeDiffInSeconds = (endDateTime - startDateTime) / 1000; // Aikaero sekunteina

    const hours = Math.floor(timeDiffInSeconds / 3600); // Muunna tunneiksi
    const minutes = Math.floor((timeDiffInSeconds % 3600) / 60); // Muunna jäljellä olevat sekunnit minuuteiksi
    const seconds = timeDiffInSeconds % 60; // Jäljellä olevat sekunnit

    return `${hours} tuntia, ${minutes} minuuttia ja ${Math.round(seconds)} sekuntia`;

}