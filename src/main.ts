import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaService } from './prizma.service'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors()
    function aaa() {
        setInterval(async () => {
            await fetch('https://tg-bot-backend-61qy.onrender.com/reputations')
        }, 1000 * 60)
    }
    const prismaSerbice = app.get(PrismaService)
    await prismaSerbice.enableShutDownHooks(app)
    await app.listen(process.env.PORT, () => aaa())
}
bootstrap()
