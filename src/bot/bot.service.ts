import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot = require('node-telegram-bot-api');
import { PrismaService } from 'src/prizma.service';

@Injectable()
export class BotService implements OnModuleInit {
    constructor(private readonly prisma: PrismaService) { }
    async onModuleInit() {
        await this.botMesssage();
    }

    async botMesssage() {
        const bot = new TelegramBot(process.env.BOT_API_TOKEN, {
            polling: true
        })

        bot.on('new_chat_members', (msg) => bot.sendMessage(msg.chat.id, `Привет, ${msg.new_chat_members[0].first_name}!`))
    }
}