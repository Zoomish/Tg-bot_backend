import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BotService implements OnModuleInit {
    constructor(private readonly prisma: PrismaClient) {}
  async onModuleInit() {
    await this.prisma.$connect();
  }
}