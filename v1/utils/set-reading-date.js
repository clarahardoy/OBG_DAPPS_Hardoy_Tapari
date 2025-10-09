export const setReadingDates = (reading) => {
    reading.updatedAt = new Date();
    
    if (reading.status === ReadingStatus.CURRENTLY_READING) {
        reading.startedReading = new Date();
    }
    if (reading.status === ReadingStatus.FINISHED) {
        reading.finishedReading = new Date();
        reading.currentPage = reading.pageCount;
    }
    if (reading.status === ReadingStatus.ABANDONED) {
        reading.finishedReading = undefined;
    }
    if (reading.status === ReadingStatus.WANT_TO_READ) {
        reading.startedReading = undefined;
        reading.finishedReading = undefined;
    }
};