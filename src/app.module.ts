import { Module } from '@nestjs/common'
import { BotService } from './bot/bot.service'
import { PrismaService } from './prizma.service'

@Module({
    providers: [BotService, PrismaService],
})
export class AppModule {}
