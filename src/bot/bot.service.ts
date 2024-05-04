import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class BotService implements OnModuleInit {
    constructor(private readonly prisma: PrismaClient) {}
  async onModuleInit() {
    await this.prisma.$connect();
  }

  async botMesssage(){
    const bot = new TelegramBot(process.env.BOT_API_TOKEN, {
        polling: true
    })
  }
}