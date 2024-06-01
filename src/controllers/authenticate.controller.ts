import { UnauthorizedException, UsePipes } from '@nestjs/common'
import { Body, Controller, Post } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>
@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService
  ) {}
  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException('user credentials do not match.')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('user credentials do not match.')
    }
    const accessToken = this.jwt.sign({
      sub: user.id,
    })
    return {
      access_token: accessToken,
    }
  }
}
