import { Controller, Get } from '@nestjs/common'
import { BotService } from './bot/bot.service'

@Controller()
export class AppController {
    constructor(private readonly botService: BotService) {}
    @Get('/reputations')
    async getPerutations() {
        return (await this.botService.getAllReputations()).sort(
            (a, b) => b.reputation - a.reputation
        )
    }

    @Get('/loss')
    async getAAAA() {
        return {}
    }
}
