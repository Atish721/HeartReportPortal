import ENV from "../config/env.js";


export default function corsMiddleware(req, res, next) {

    const allowedOrigins = [
        ENV.FRONTEND_ORIGIN,
        'https://heart-seven-ruddy.vercel.app', // Your frontend domain
    ];

    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
        // For security, you might want to be more restrictive
        // But for now, allow any origin (adjust for production)
        res.setHeader("Access-Control-Allow-Origin", origin || "*");
    }
    
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "86400"); // 24 hours

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    next();
}
