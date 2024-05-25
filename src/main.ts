import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaService } from './prizma.service'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors()
    function aaa() {
        setInterval(async () => {
            await fetch(
                'https://tg-bot-backend-pfuu.onrender.com/projects/AAA'
            )
        }, 1000 * 60 * 14 + 1000 * 30)
    }
    const prismaSerbice = app.get(PrismaService)
    await prismaSerbice.enableShutDownHooks(app)
    await app.listen(process.env.PORT, () => aaa())
}
bootstrap()
