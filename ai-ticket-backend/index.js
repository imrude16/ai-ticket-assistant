import express, { urlencoded } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { serve } from "inngest/express";
import dotenv from "dotenv";
dotenv.config();

import userRoutes from "./routes/user.route.js";
import ticketRoutes from "./routes/ticket.route.js";
import { inngest } from "./inngest/client.inngest.js";
import { onUserSignup } from "./inngest/functions/on-signup.function.inngest.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.function.inngest.js";


const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use('/api/auth', userRoutes);
app.use('/api/tickets', ticketRoutes);

app.use("/api.inngest", serve({
    client: inngest,
    functions: [onUserSignup, onTicketCreated]
}));

mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Connected to MongoDB ✅")
            app.listen(PORT, () => {
                console.log(`Server is running on port http://localhost:${PORT}`);
            })})
        .catch((error) => console.error(`❌ Error connecting to MongoDB: ${error}`));
