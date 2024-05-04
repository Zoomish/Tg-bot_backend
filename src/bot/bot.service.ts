import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import TelegramBot = require('node-telegram-bot-api')
import { PrismaService } from 'src/prizma.service'

@Injectable()
export class BotService implements OnModuleInit {
    constructor(private readonly prisma: PrismaService) {}
    async onModuleInit() {
        await this.botMesssage()
    }

    async botMesssage() {
        const bot = new TelegramBot(process.env.BOT_API_TOKEN, {
            polling: true,
        })

        bot.on('new_chat_members', (msg) =>
            bot.sendMessage(
                msg.chat.id,
                `Привет, ${msg.new_chat_members[0].first_name}!`
            )
        )

        bot.on('message', async (msg) => {
            if (msg?.sticker) {
                if (msg.sticker.emoji === '👍') {
                    this.handleThanksWordReaction(msg, bot)
                }
            }
        })
    }

    async handleThanksWordReaction(msg: TelegramBot.Message, bot: TelegramBot) {
        const avatarUrl = await this.getUserAvatarUrl(
            msg.reply_to_message.from.id,
            bot
        )
        console.log(avatarUrl)
    }

    async getUserAvatarUrl(userId: number, bot: TelegramBot) {
        const userProfile = await bot.getUserProfilePhotos(userId)
        if (!userProfile.photos.length) {
            return ''
        }

        const fileId = userProfile.photos[0][0].file_id
        const file = await bot.getFile(fileId)
        const filePath = file.file_path

        return `https://api.telegram.org/file/bot${process.env.BOT_API_TOKEN}/${filePath}`
    }
}
