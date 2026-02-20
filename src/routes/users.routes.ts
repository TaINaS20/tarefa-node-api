import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', async (request, reply) => {
    const createUserSchema = z.object({
      nome: z.string(),
      email: z.string().email(),
      senha: z.string().min(6),
      foto: z.string().nullable().optional(),
    })

    const { nome, email, senha, foto } = createUserSchema.parse(request.body)

    const userAlreadyExists = await prisma.user.findUnique({
      where: { email },
    })

    if (userAlreadyExists) {
      return reply.status(400).send({
        message: 'Email já cadastrado.',
      })
    }

    const hashedPassword = await bcrypt.hash(senha, 10)

    try {
      const user = await prisma.user.create({
        data: {
          nome,
          email,
          senha: hashedPassword,
          foto: foto ?? null,
        },
      })

      return reply.status(201).send(user)
    } catch (error: any) {
      if (error.code === 'P2002') {
        return reply.status(409).send({
          message: 'Este email já está cadastrado no sistema.',
        })
      }
      throw error
    }
  })

  app.get('/users', async () => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        publicId: true,
        nome: true,
        email: true,
        foto: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return users
  })

  app.get('/users/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })

    const { id } = paramsSchema.parse(request.params)

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        publicId: true,
        nome: true,
        email: true,
        foto: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return reply.status(404).send({
        message: 'Usuário não encontrado.',
      })
    }

    return user
  })

  app.put('/users/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })

    const bodySchema = z.object({
      nome: z.string().optional(),
      email: z.string().email().optional(),
      senha: z.string().min(6).optional(),
      foto: z.string().nullable().optional(),
    })

    const { id } = paramsSchema.parse(request.params)
    const body = bodySchema.parse(request.body)

    const updateData: any = {}
    if (body.nome !== undefined) updateData.nome = body.nome
    if (body.email !== undefined) updateData.email = body.email
    if (body.foto !== undefined) updateData.foto = body.foto
    if (body.senha !== undefined) {
      updateData.senha = await bcrypt.hash(body.senha, 10)
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    })

    return user
  })

  app.delete('/users/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.user.delete({
      where: { id },
    })

    return reply.status(204).send()
  })

  app.get('/users/:id/posts', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })

    const { id } = paramsSchema.parse(request.params)

    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return reply.status(404).send({
        message: 'Usuário não encontrado.',
      })
    }

    const posts = await prisma.post.findMany({
      where: { userId: id },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return posts
  })
}
