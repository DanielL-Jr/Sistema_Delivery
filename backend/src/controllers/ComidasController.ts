import { Request, Response } from 'express';
import Zod from 'zod';
import { prisma } from '../lib/prisma';
import { hash } from 'bcrypt';
import { AppError } from '../errors/AppError';
import { excludeFields } from '../utils/excludeFields';

export class ComidasController{

    public async create(request: Request, response: Response){

        //Esquema para verificação dos dados que virão do request
        const bodySchema = Zod.object({
            nome: Zod.string(),
            imagem: Zod.string(),
            valor: Zod.number(),
            descricao: Zod.string(),
            tipo: Zod.string(),
        }).strict();

        //Compara os dados do request com o esquema
        const {
            nome, imagem, valor, descricao, tipo
        } = bodySchema.parse(request.body);

        
        //Procura por comidas cadastrados com o mesmo nome
        const comidaExists = await prisma.comida.findFirst({
            where: { nome },
        });

        if(comidaExists) throw new AppError('Comida já cadastrada', 409);

        const comida = await prisma.comida.create({
            data: {
                nome,
                imagem,
                valor,
                descricao,
                tipo,
            },
        });

        return response.status(200).json(comida);
    }

    public async list(_request: Request, response: Response){

        const comidas = await prisma.comida.findMany();

        return response.status(200).json(comidas);
    }

    public async show(request: Request, response: Response){

        //Converte id pego na requisição
        const id = parseInt(request.params.id);

        //Procura a comida pelo id
        const comida = await prisma.comida.findUnique({
            where: {id},
        });

        if(!comida) throw new AppError('Food not found', 404);

        return response.status(200).json(comida);
    }

    public async update(request: Request, response: Response){

        //Esquema para verificação dos dados que virão do request
        const bodySchema = Zod.object({
            nome: Zod.string().nullish(),
            imagem: Zod.string().nullish(),
            valor: Zod.number().nullish(),
            descricao: Zod.string().nullish(),
            tipo: Zod.string().nullish(),
        }).strict();

        //Compara os dados do request com o esquema
        const {
            nome, imagem, valor, descricao, tipo
        } = bodySchema.parse(request.body);


        //Testa se o usuário existe
        const id = parseInt(request.params.id);

        const comidaExists = await prisma.comida.findUnique({
            where: {id},
        });

        if(!comidaExists) throw new AppError('Food not found', 404);


        //Guarda somente os dados que foram alterados
        let data = {};

        if(nome) data = {nome};
        if(imagem) data = { ...data, imagem};
        if(valor) data = { ...data, valor};
        if(descricao) data = { ...data, descricao};
        if(tipo) data = { ...data, tipo};

        const comida = await prisma.comida.update({
            where: {id},
            data,
        });
        

        return response.status(200).json(comida);
    }

    public async delete(request: Request, response: Response){

        //Converte id pego na requisição
        const id = parseInt(request.params.id);

        //Procura a comida pelo id
        const comidaExists = await prisma.comida.findUnique({
            where: {id},
        });

        if(!comidaExists) throw new AppError('Food not found', 404);

        const comida = await prisma.comida.delete({
            where: {id},
        });

        return response.status(200).json("Food deleted");
    }

}