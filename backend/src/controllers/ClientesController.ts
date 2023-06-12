import { Request, Response } from 'express';
import Zod from 'zod';
import { prisma } from '../lib/prisma';
import { hash } from 'bcrypt';
import { AppError } from '../errors/AppError';
import { excludeFields } from '../utils/excludeFields';

export class ClientesController{

    public async create(request: Request, response: Response){

        //Esquema para verificação dos dados que virão do request
        const bodySchema = Zod.object({
            cpf: Zod.string().min(11),
            nome: Zod.string().min(3),
            email: Zod.string().email(),
            password: Zod.string().min(8),
            password_confirmation: Zod.string().min(8),
            telefone: Zod.string().min(11),
            cep: Zod.string().min(8),
            estado: Zod.string(),
            cidade: Zod.string(),
            bairro: Zod.string(),
            endereco: Zod.string(),
            numero: Zod.string(),
            complemento: Zod.string().nullish()
        }).strict().refine((data)=> data.password === data.password_confirmation, {
            message: "Passwords don't match",
            path: ["password_confirmation"],
        });

        //Compara os dados do request com o esquema
        const {
            cpf,nome,email,password,telefone,cep,estado,cidade,bairro,endereco,numero,complemento
        } = bodySchema.parse(request.body);

        
        //Procura por clientes cadastrados com o mesmo cpf
        const clienteExists = await prisma.cliente.findUnique({
            where: { cpf },
        });

        if(clienteExists) throw new AppError('Usuário já registrado', 409);

        const password_hash = await hash(password, 6);

        const cliente = await prisma.cliente.create({
            data: {
                cpf,
                nome,
                email, 
                password_hash, 
                telefone,
                cep,
                estado,
                cidade,
                bairro,
                endereco,
                numero,
                complemento,
            },
        });

        //Apaga a senha do retorno da função
        const clienteWithoutPassword = excludeFields(cliente, ['password_hash']);
        return response.status(200).json(clienteWithoutPassword);
    }

    public async list(_request: Request, response: Response){

        const clientes = await prisma.cliente.findMany();

        //Apaga a senha de cada usuário do retorno
        const clienteWithoutPassword = clientes.map((cliente)=>{
            return excludeFields(cliente, ['password_hash']);
        });
        return response.status(200).json(clienteWithoutPassword);
    }

    public async show(request: Request, response: Response){

        //Converte id pego na requisição
        const id = parseInt(request.params.id);

        //Procura o cliente pelo id
        const cliente = await prisma.cliente.findUnique({
            where: {id},
        });

        if(!cliente) throw new AppError('User not found', 404);

        return response.status(200).json(excludeFields(cliente, ['password_hash']));
    }

    public async update(request: Request, response: Response){

        //Esquema para verificação dos dados que virão do request
        const bodySchema = Zod.object({
            cpf: Zod.string().min(11).nullish(),
            nome: Zod.string().min(3).nullish(),
            email: Zod.string().email().nullish(),
            password: Zod.string().min(8).nullish(),
            password_confirmation: Zod.string().min(8).nullish(),
            telefone: Zod.string().min(11).nullish(),
            cep: Zod.string().min(8).nullish(),
            estado: Zod.string().nullish(),
            cidade: Zod.string().nullish(),
            bairro: Zod.string().nullish(),
            endereco: Zod.string().nullish(),
            numero: Zod.string().nullish(),
            complemento: Zod.string().nullish()
        }).strict().refine((data)=> data.password === data.password_confirmation, {
            message: "Passwords don't match",
            path: ["password_confirmation"],
        });

        //Compara os dados do request com o esquema
        const {
            cpf,nome,email,password,telefone,cep,estado,cidade,bairro,endereco,numero,complemento
        } = bodySchema.parse(request.body);


        //Testa se o usuário existe
        const id = parseInt(request.params.id);

        const clientExists = await prisma.cliente.findUnique({
            where: {id},
        });

        if(!clientExists) throw new AppError('User not found', 404);


        //Guarda somente os dados que foram alterados
        let data = {};

        if(cpf) data = {cpf};
        if(nome) data = { ...data, nome};
        if(email) data = { ...data, email};
        if(password) data = { ...data, password};
        if(telefone) data = { ...data, telefone};
        if(cep) data = { ...data, cep};
        if(estado) data = { ...data, estado};
        if(cidade) data = { ...data, cidade};
        if(bairro) data = { ...data, bairro};
        if(endereco) data = { ...data, endereco};
        if(numero) data = { ...data, numero};
        if(complemento) data = { ...data, complemento};

        const cliente = await prisma.cliente.update({
            where: {id},
            data,
        });
        

        return response.status(200).json(excludeFields(cliente, ['password_hash']));
    }

    public async delete(request: Request, response: Response){

        //Converte id pego na requisição
        const id = parseInt(request.params.id);

        //Procura o cliente pelo id
        const clientExists = await prisma.cliente.findUnique({
            where: {id},
        });

        if(!clientExists) throw new AppError('User not found', 404);

        const cliente = await prisma.cliente.delete({
            where: {id},
        });

        return response.status(200).json("User delete sucess");
    }

}