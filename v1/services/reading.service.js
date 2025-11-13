import Reading from '../models/reading.model.js';
import { setReadingDates } from '../utils/set-reading-date.js';
import { ShelfService } from './shelf.service.js';
import { UserService } from './user.service.js';
import { ReadingStatus } from '../models/enums/reading-status.enum.js';
import { BookService } from './book.service.js';
import Shelf from '../models/shelf.model.js';

// Agreagr una nueva lectura POST

export const ReadingService = {
	createReading: async (readingData) => {
		try {
			const shelf = await ShelfService.findShelfById(readingData.shelfId);
			const user = await UserService.getUserById(shelf.userId);
			let limit = await user.getAllowedReadingsMax();

			if (limit !== null) {
				const currentCount = await ReadingService.countReadingsByShelfId(
					shelf._id
				);
				if (currentCount >= limit) {
					const err = new Error('Se alcanzó el límite de lecturas.');
					err.status = 403;
					throw err;
				}
			}

			const newReading = new Reading(readingData);

			// Que se autocompleten las fechas según status
			setReadingDates(newReading);

			await newReading.save();

			await Shelf.findByIdAndUpdate(
				readingData.shelfId,
				{
					$addToSet: { readings: newReading._id },
					$set: { updatedAt: new Date() },
				},
				{ new: true }
			);

			const book = await BookService.findOrCreateBook(
				readingData.googleBooksId
			);
			const readingObj = newReading.toObject();
			readingObj.book = book;

			return readingObj;
		} catch (error) {
			let err = new Error(`Error al agregar la lectura: ${error.message}`);
			err.status = error.status || 500;
			throw err;
		}
	},

	getAllReadings: async () => {
		const readings = await Reading.find();

		if (!readings || readings.length === 0) {
			let err = new Error('No se encontraron lecturas');
			err.status = 404;
			throw err;
		}

		const readingsWithBooks = await Promise.all(
			readings.map(async (reading) => {
				const book = await BookService.findOrCreateBook(reading.googleBooksId);
				const readingObj = reading.toObject();
				readingObj.book = book;
				return readingObj;
			})
		);

		return readingsWithBooks;
	},

	// Obtener una lectura por ID GET
	getReadingById: async (id) => {
		let reading;
		try {
			reading = await Reading.findById(id);
		} catch (error) {
			let err = new Error('Error al encotrar la lectura');
			err.status = 400;
			throw err;
		}

		if (!reading) {
			let err = new Error('No se encontró la lectura');
			err.status = 404;
			throw err;
		}

		// agregar toda la info del libro en la respuesta
		const book = await BookService.findOrCreateBook(reading.googleBooksId);
		const readingObj = reading.toObject();
		readingObj.book = book;

		return readingObj;
	},
	// Actualizar una lectura por ID PUT
	updateReadingById: async (id, updateData) => {
		const reading = await Reading.findById(id);
		if (!reading) {
			const err = new Error('No se encontró la lectura');
			err.status = 404;
			throw err;
		}

		const book = await BookService.findOrCreateBook(reading.googleBooksId);
		if (!book) {
			const err = new Error('Libro no encontrado');
			err.status = 404;
			throw err;
		}

		const pageCount = book.pages;
		if (updateData.status === ReadingStatus.FINISHED) {
			updateData.currentPage = pageCount;
		}
		if (
			updateData &&
			!ReadingService.pageCountIsValid(updateData.currentPage, pageCount)
		) {
			const err = new Error(
				'La página actual no puede ser mayor al total de páginas'
			);
			err.status = 400;
			throw err;
		}

		// Aseguramos formato de "update operator" para que el middleware pueda operar ($set/$unset)
		const update = { $set: { ...updateData } };

		// Aplica reglas de fechas/updatedAt según status/cambios
		setReadingDates(update);

		let updatedReading;
		try {
			updatedReading = await Reading.findByIdAndUpdate(id, update, {
				new: true,
				runValidators: true, // valida contra el schema
			});
		} catch (error) {
			let err = new Error('Error al actualizar la lectura');
			err.status = 400;
			throw err;
		}

		if (!updatedReading) {
			const err = new Error('No se encontró la lectura para actualizar');
			err.status = 404;
			throw err;
		}

		const readingObj = updatedReading.toObject();
		readingObj.book = book;

		return readingObj;
	},

	deleteReadingById: async (id) => {
		let deleted;
		try {
			deleted = await Reading.findByIdAndDelete(id);
		} catch {
			const err = new Error('Error al eliminar la lectura');
			err.status = 400;
			throw err;
		}
		if (!deleted) {
			const err = new Error('No se encontró la lectura para eliminar');
			err.status = 404;
			throw err;
		}
		return deleted;
	},
	deleteReadingsByShelfId: async (shelfId) => {
		try {
			const result = await Reading.deleteMany({ shelfId });
			return result;
		} catch (error) {
			console.error(
				'[ReadingService.deleteReadingsByShelfId] ERROR:',
				error
			);
			const err = new Error(
				'Error al eliminar las lecturas asociadas a la shelf'
			);
			err.status = 500;
			err.cause = error;
			throw err;
		}
	},
	getReadingsByShelfId: async (shelfId) => {
		try {
			if (!shelfId) {
				throw new Error('Shelf ID requerido');
			}
			const readings = await Reading.find({ shelfId });

			// Agregar información del libro a cada reading
			const readingsWithBooks = await Promise.all(
				readings.map(async (reading) => {
					const book = await BookService.findOrCreateBook(
						reading.googleBooksId
					);
					const readingObj = reading.toObject();
					readingObj.book = book;
					return readingObj;
				})
			);

			return readingsWithBooks;
		} catch (error) {
			throw new Error(`Error al obtener las lecturas: ${error.message}`);
		}
	},

	countReadingsByShelfId: async (shelfId) => {
		return await Reading.countDocuments({ shelfId });
	},

	pageCountIsValid: (currentPage, pageCount) => {
		return currentPage <= pageCount;
	},
};