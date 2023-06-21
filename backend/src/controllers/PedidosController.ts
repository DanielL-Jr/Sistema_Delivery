import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../errors/AppError";
import Zod from "zod";

export class PedidosController {
  public async create(request: Request, response: Response) {
    //Cria esquema de formato da requisição
    const bodySchema = Zod.object({
      id_cli: Zod.number(),
      comidas: Zod.object({
        id_food: Zod.number(),
        qntd: Zod.number(),
      })
        .array()
        .nonempty({ message: "comidas cannot be empty" }),
    }).strict();

    //Testa se a requisição está formatada como no esquema
    const { id_cli } = bodySchema.parse(request.body);

    //Verifica se o cliente que fez o pedido existe
    const cliente = await prisma.cliente.findUnique({
      where: { id: id_cli },
    });

    if (!cliente) throw new AppError("User not found", 404);

    //Cadastra o pedido no banco de dados
    const pedido = await prisma.pedido.create({
      data: {
        id_cli,
      },
    });

    //Array que guarda todas as comidas que foram pedidas
    let food = request.body.comidas;

    /*
        Identifica cada comida foi pedida e em que quantidade,
        e então, cadastra na tabela que relaciona pedidos e comidas pedidas.
        */
    for (let n in food) {
      let data_comida = {
        id_pedido: pedido.id,
        id_food: food[n].id_food,
        qntd: food[n].qntd,
      };
      const pedido_comidas = await prisma.pedido_comidas.create({
        data: data_comida,
      });
    }

    return response.status(200).json(pedido);
  }

  public async list(_request: Request, response: Response) {
    //Mostra informações do pedido e as comidas do pedido
    const pedido = await prisma.pedido.findMany({
      select: {
        id: true,
        id_cli: true,

        Pedido_comidas: {
          select: {
            id_food: true,
            qntd: true,
          },
        },
      },
    });

    return response.status(200).json(pedido);
  }

  public async show(request: Request, response: Response) {
    const id = parseInt(request.params.id);

    const pedido = await prisma.pedido.findUnique({
      where: { id },
      select: {
        id: true,
        id_cli: true,

        Pedido_comidas: {
          select: {
            id_food: true,
            qntd: true,
          },
        },
      },
    });

    return response.status(200).json(pedido);
  }

  public async delete(request: Request, response: Response) {
    const id = parseInt(request.params.id);

    const pedido_comidas = prisma.pedido_comidas.deleteMany({
      where: {
        id_pedido: id,
      },
    });

    const pedido =  prisma.pedido.delete({
      where: { id },
    });

    const transaction = await prisma.$transaction([pedido_comidas, pedido]);

    return response.status(200).json(transaction);
  }
}
