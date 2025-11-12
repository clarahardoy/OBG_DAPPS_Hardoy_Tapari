import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { sign } from '../utils/sign.utils.js';
import { MembershipType } from '../models/enums/membership-type.enum.js';
import { ShelfService } from './shelf.service.js';

export const registerService = async ({
	email,
	password,
	name,
	surname,
	role,
	membership,
	avatarUrl,
	avatarPublicId
}) => {
	const userExiste = await User.findOne({ email });
	if (userExiste) {
		const error = new Error('No se ha podido registrar el usuario');
		error.status = 409;
		throw error;
	}


	if (!avatarUrl?.startsWith('https://res.cloudinary.com/')) {
		const error = new Error('Avatar inválido');
		error.status = 400;
		throw error;
	}

	const hashPassword = bcrypt.hashSync(password, 12);

	const user = new User({
		email,
		password: hashPassword,
		name,
		surname,
		role,
		membership: MembershipType.BASIC,
		avatar: {
			url: avatarUrl,
			publicId: avatarPublicId ?? null
		}
	});

	await user.save();

	const shelfName = `Estantería de ${name || 'Usuario'}`;
	const shelfData = {
		userId: user._id,
		name: shelfName,
		isDefault: true,
		readings: [],
	};
	await ShelfService.createShelf(shelfData);

	const token = sign(user);

	return {
		token,
		membership: user.membership,
		maxReadings: user.getAllowedReadingsMax(),
		role: user.role,
		avatarUrl: user.avatar.url
	};
};

export const loginService = async ({ email, password }) => {
	const user = await User.findOne({ email });
	if (!user || !bcrypt.compareSync(password, user.password)) {
		const error = new Error('Credenciales inválidas');
		error.status = 401;
		throw error;
	}

	const token = sign(user);

	return {
		token,
		membership: user.membership,
		maxReadings: user.getAllowedReadingsMax(),
		role: user.role,
		avatarUrl: user.avatar?.url ?? null
	};
};