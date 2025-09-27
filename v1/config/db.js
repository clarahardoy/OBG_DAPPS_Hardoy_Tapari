import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.NODE_ENV === 'development'
            ? process.env.MONGO_URI_DEV : process.env.MONGO_URI);
        console.log("Base de datos conectada");
    } catch (error) {
        console.error("Error al conectar a la base de datos", error);
    }
};