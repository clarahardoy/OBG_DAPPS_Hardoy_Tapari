import { ReadingStatus } from '../models/enums';

export const setReadingDateMiddleware = (req, res, next) => {
    req.body.updatedAt = new Date();
    
    if (req.body.status === ReadingStatus.CURRENTLY_READING) {
        req.body.startedReading = new Date();
    }
    if (req.body.status === ReadingStatus.FINISHED) {
        req.body.finishedReading = new Date();
        req.body.currentPage = req.body.pageCount;
    }
    next();
};