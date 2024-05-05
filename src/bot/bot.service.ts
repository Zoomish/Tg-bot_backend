import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { Prisma, Reputations } from '@prisma/client'
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
        const thanksWords = ['спс', 'спасибо', 'заработало', '👍']

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
                return
            }
            if (msg.reply_to_message) {
                if (
                    msg.reply_to_message.from.is_bot === true ||
                    msg.reply_to_message.from.username === msg.from.username
                ) {
                    return
                }
                const thankword = msg.text
                    .toLowerCase()
                    .split(' ')
                    .find((word) =>
                        thanksWords.includes(
                            word.replace(/[&\/\\#,+()$~%.'":*?!<>{}]/g, '')
                        )
                    )
                if (thankword) {
                    this.handleThanksWordReaction(msg, bot)
                }
            }
        })
    }
    async getReputation(telegramId: string): Promise<Reputations> {
        return await this.prisma.reputations.findFirst({
            where: {
                telegramId,
            },
        })
    }

    async updateReputation(reputation: number, id: number): Promise<void> {
        await this.prisma.reputations.update({
            where: {
                id,
            },
            data: {
                reputation,
            },
        })
    }

    async addNewReputation(data: Prisma.ReputationsCreateInput): Promise<void> {
        await this.prisma.reputations.create({ data })
    }

    async increaseReputation(
        telegramId: string,
        userName: string,
        fullName: string,
        userAvatar: string
    ) {
        const reputationData = await this.getReputation(String(telegramId))

        if (reputationData) {
            await this.updateReputation(
                reputationData.reputation + 1,
                reputationData.id
            )
            return
        }
        await this.addNewReputation({
            telegramId: String(telegramId),
            userName,
            userAvatar,
            fullName,
            reputation: 1,
        })
    }

    async sendReputationMessage(
        chatId: number,
        replyUserName: string,
        fromUserName: string,
        bot: TelegramBot,
        telegramId: string
    ) {
        const reputationData = await this.getReputation(String(telegramId))

        bot.sendMessage(
            chatId,
            `Поздравляю, ${replyUserName} вы получили репутацию! Участник ${fromUserName} повысил твою репутацию. Твоя репутация ${reputationData.reputation}`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Статистика чата',
                                url: 'www.google.com',
                            },
                        ],
                    ],
                },
            }
        )
    }

    async handleThanksWordReaction(msg: TelegramBot.Message, bot: TelegramBot) {
        const telegramId = msg.reply_to_message.from.id
        const avatarUrl = await this.getUserAvatarUrl(telegramId, bot)

        await this.increaseReputation(
            String(telegramId),
            msg.reply_to_message.from?.username || '',
            avatarUrl,
            `${msg.reply_to_message.from?.first_name} ${msg.reply_to_message.from?.last_name}`
        )

        await this.sendReputationMessage(
            msg.chat.id,
            `${msg.reply_to_message.from.first_name} ${
                msg.reply_to_message.from?.username
                    ? `(@${msg.reply_to_message.from.username})`
                    : ''
            }`,
            msg.from.first_name,
            bot,
            String(telegramId)
        )
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
