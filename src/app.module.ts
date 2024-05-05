import { Module } from '@nestjs/common'
import { BotService } from './bot/bot.service'
import { PrismaService } from './prizma.service'
import { AppController } from './app.controller'

@Module({
    imports: [],
    controllers: [AppController],
    providers: [BotService, PrismaService],
})
export class AppModule {}
