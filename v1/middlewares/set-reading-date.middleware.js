import { ReadingStatus } from '../models/enums/reading-status.enum.js';

export const setReadingDateMiddleware = (req, res, next) => {
    req.body.updatedAt = new Date();
    const started = req.body.startedReading;
    const finished = req.body.finishedReading;
    
    if (req.body.status === ReadingStatus.CURRENTLY_READING) {
        started = new Date();
    }
    if (req.body.status === ReadingStatus.FINISHED) {
        finished = new Date();
        req.body.currentPage = req.body.pageCount;
    }
    if (req.body.status === ReadingStatus.ABANDONED) {
        finished = undefined;
    }
    if (req.body.status === ReadingStatus.WANT_TO_READ) {
        started = undefined;
        finished = undefined;
    }
    next();
};