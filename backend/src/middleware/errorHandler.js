    // backend/src/middleware/errorHandler.js

    export function errorHandler(err, req, res, next) {
        console.error(" Error:", err);

        const status = err.status || 500;

        res.status(status).json({
            error: err.message || "Server Error",
        });
    }