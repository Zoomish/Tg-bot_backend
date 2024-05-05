import { Controller, Get } from '@nestjs/common'
import { BotService } from './bot/bot.service'

@Controller()
export class AppController {
    constructor(private readonly botService: BotService) {}
    @Get()
    async getPerutations() {
        return await this.botService.getReputation('123')
    }
}
