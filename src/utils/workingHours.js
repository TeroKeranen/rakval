import { useTranslation } from "react-i18next";

export const calculateWorkHours = (startDateString, startTimeString, endDateString, endTimeString,t) => {
    
    if (!startDateString || !endDateString || !startTimeString || !endTimeString) {
        console.log("ei tietoja ajoissa")
        return;
    }

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

function convertDate(dateString) {
    // Muuntaa päivämäärän muodosta "DD.MM.YYYY" muotoon "YYYY-MM-DD"
    if (!dateString) {
        return;
    }
    const parts = dateString.split(".");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

export const calculateTotaWorkTime = (workDays) => {
    let totalSeconds = 0;
    
    workDays.forEach(workDay => {
        const startDateString = convertDate(workDay.startDate) + 'T' + workDay.startTime;
        
        const endDateString = convertDate(workDay.endDate) + 'T' + workDay.endTime;

        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);

        const seconds = (endDate - startDate) / 1000;
        totalSeconds += seconds;
    })

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `${hours}h ${minutes}min`;

}

