import { getCurrentDate } from "./currentDate"


export const futureStartTime = (startTime) => {
    
    const timeNow = getCurrentDate();
    
    if (!startTime) {
        return;
    }
    const currentDateObj = new Date(timeNow.split('.').reverse().join('-'));
    const startTimeObj = new Date(startTime.split('.').reverse().join('-'));

    if (startTimeObj > currentDateObj) {
        return true;
    } else {
        return false;
    }

}