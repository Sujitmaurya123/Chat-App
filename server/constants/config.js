const allowedOrigins = ["http://localhost:5173", "http://localhost:4173", process.env.CLIENT_URL];

const corsOptions = {
    origin: function (origin, callback) {
        // Check if the origin is in the allowed list or if it's not defined (e.g., from Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods:["GET","POST","PUT","DELETE"],
    credentials: true
};

const CHATTU_TOKEN="chattu-token"


export{ corsOptions ,CHATTU_TOKEN};