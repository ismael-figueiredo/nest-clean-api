import { UseGuards } from '@nestjs/common'
import { Controller, Post } from '@nestjs/common'

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor() {}
  @Post()
  async handle() {
    return 'ok'
  }
}
