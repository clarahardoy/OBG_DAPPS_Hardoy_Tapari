import mongoose from 'mongoose';

export const connectDB = async () => {
	const isDev = process.env.NODE_ENV === 'development';
	const uri = isDev ? process.env.MONGO_URI_DEV : process.env.MONGO_URI;

	console.log('intentando conectar a la base de datos - uri:', uri);
	try {
		await mongoose.connect(uri, {
			serverSelectionTimeoutMS: 30000, // 30 segundos
			socketTimeoutMS: 45000, // 45 segundos
			connectTimeoutMS: 30000, // 30 segundos
			maxPoolSize: 10,
			retryWrites: true,
			w: 'majority',
		});
		console.log('Base de datos conectada correctamente');
	} catch (error) {
		console.error('Error al conectar a la base de datos:', error.message);
		console.error('Error completo:', error);
		throw error;
	}
};
