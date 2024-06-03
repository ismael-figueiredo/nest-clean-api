import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import {} from '@nestjs/common'

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecenteQuestionController {
  constructor(private prisma: PrismaService) {}
  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const questions = await this.prisma.question.findMany({
      take: 20,
      skip: (page - 1) * 1,
      orderBy: {
        createdAt: 'desc',
      },
    })
    return { questions }
  }
}
