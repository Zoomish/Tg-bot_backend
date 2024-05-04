import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { BotService } from './bot/bot.service'
import { PrismaService } from './prizma.service'
import { AppService } from './app.service'

@Module({
    imports: [],
    controllers: [AppController],
    providers: [BotService, PrismaService, AppService],
})
export class AppModule {}
