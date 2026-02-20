import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function postsRoutes(app: FastifyInstance) {
  app.post('/posts', async (request, reply) => {
    const createPostSchema = z.object({
      titulo: z.string(),
      conteudo: z.string(),
      userId: z.number(),
    })

    const { titulo, conteudo, userId } = createPostSchema.parse(request.body)

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!userExists) {
      return reply.status(404).send({
        message: 'Usuário não encontrado.',
      })
    }

    const post = await prisma.post.create({
      data: {
        titulo,
        conteudo,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true,
            foto: true,
          },
        },
      },
    })

    return reply.status(201).send(post)
  })

  app.get('/posts', async () => {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true,
            foto: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return posts
  })

  app.get('/posts/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })

    const { id } = paramsSchema.parse(request.params)

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true,
            foto: true,
          },
        },
      },
    })

    if (!post) {
      return reply.status(404).send({
        message: 'Post não encontrado.',
      })
    }

    return post
  })

  app.put('/posts/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })

    const bodySchema = z.object({
      titulo: z.string().optional(),
      conteudo: z.string().optional(),
    })

    const { id } = paramsSchema.parse(request.params)
    const body = bodySchema.parse(request.body)

    const updateData: any = {}
    if (body.titulo !== undefined) updateData.titulo = body.titulo
    if (body.conteudo !== undefined) updateData.conteudo = body.conteudo

    try {
      const post = await prisma.post.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              nome: true,
              email: true,
              foto: true,
            },
          },
        },
      })

      return post
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.status(404).send({
          message: 'Post não encontrado.',
        })
      }
      throw error
    }
  })

  app.delete('/posts/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })

    const { id } = paramsSchema.parse(request.params)

    try {
      await prisma.post.delete({
        where: { id },
      })

      return reply.status(204).send()
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.status(404).send({
          message: 'Post não encontrado.',
        })
      }
      throw error
    }
  })
}
