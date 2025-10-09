import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs:  60 * 1000, 
    max: 100, 
    message: "Demasiadas peticiones, espera 1 minuto para volver a intentarlo",
    handler: (req, res, next, options) => {
      res.status(options.statusCode).json({
        error: "Too many requests",
        limit: options.max,
        windowMs: options.windowMs,
        retryAfter: Math.ceil(options.windowMs / 1000) + ' seconds',
      });
    }
  });