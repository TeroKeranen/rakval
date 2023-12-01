import { useTranslation } from "react-i18next";

export const calculateWorkHours = (startDateString, startTimeString, endDateString, endTimeString,t) => {
    

    const [startDay, startMonth, startYear] = startDateString.split('.').map(Number);
    const [endDay, endMonth, endYear] = endDateString.split('.').map(Number);

    const startDateTime = new Date(startYear, startMonth - 1, startDay, ...startTimeString.split(':').map(Number));
    const endDateTime = new Date(endYear, endMonth - 1, endDay, ...endTimeString.split(':').map(Number));

    // Laske aikaero millisekunteina
    const timeDiffInSeconds = (endDateTime - startDateTime) / 1000; // Aikaero sekunteina

    const hours = Math.floor(timeDiffInSeconds / 3600); // Muunna tunneiksi
    const minutes = Math.floor((timeDiffInSeconds % 3600) / 60); // Muunna jäljellä olevat sekunnit minuuteiksi
    const seconds = timeDiffInSeconds % 60; // Jäljellä olevat sekunnit

    return ` ${hours} ${t('workingHour')}, ${minutes} ${t('workingMinutes')}, ${Math.round(seconds)} ${t('workingSeconds')}`;

}