"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const reservationRoutes_1 = __importDefault(require("./routes/reservationRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, express_mongo_sanitize_1.default)());
app.use('/auth', authRoutes_1.default);
app.use('/profile', profileRoutes_1.default);
app.use('/events', eventRoutes_1.default);
app.use('/reservations', reservationRoutes_1.default);
(0, db_1.connectDB)();
app.listen(process.env.PORT, () => {
    console.log(`Server Running`);
});
