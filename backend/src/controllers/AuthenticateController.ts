import { Request, Response } from "express";
import Zod from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../errors/AppError";

import { compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";

export class AuthenticateController {
	public async login(request: Request, response: Response) {
		const bodySchema = Zod.object({
			email: Zod.string().email(),
			password: Zod.string().min(6),
		});

		const { email, password } = bodySchema.parse(request.body);

		const cliente = await prisma.cliente.findFirst({
			where: { email },
		});

		if (!cliente) {
			return response.status(401).json(cliente);
		}

		const passwordMatch = await compare(password, cliente.password_hash);

		if (!passwordMatch) {
			return response.status(401).json(passwordMatch);
		}

		const id = cliente.id.toString();

		const token = sign({}, "system_delivery", {
			subject: id,
			expiresIn: "1d",
		});

		return response.status(200).json(token);
	}

	public async verify(request: Request, response: Response) {
		const token = request.params.token;

		if (!token) {
			return response.status(401).json({
				message: "Token required",
			});
		}

		try {
			const {sub} = verify(token, "system_delivery");
			return response.status(200).json(sub);
		} catch (error) {
			throw new AppError("Token invalid", 401);
		}
	}
}
