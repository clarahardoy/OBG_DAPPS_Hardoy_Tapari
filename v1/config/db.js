import mongoose from 'mongoose';

export const connectDB = async () => {
	const isDev = process.env.NODE_ENV === 'development';
	const uri = isDev ? process.env.MONGO_URI_DEV : process.env.MONGO_URI;

	console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
	console.log('🔍 Usando URI de', isDev ? 'DEV' : 'PROD');
	console.log('🔍 URI definida?', !!uri);
	try {
		await mongoose.connect(
			process.env.NODE_ENV === 'development'
				? process.env.MONGO_URI_DEV
				: process.env.MONGO_URI
		);
		console.log('Base de datos conectada');
	} catch (error) {
		console.error('Error al conectar a la base de datos', error);
	}
};
