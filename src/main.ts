import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaService } from './prizma.service'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors()
    const prismaSerbice = app.get(PrismaService)
    await prismaSerbice.enableShutDownHooks(app)
    await app.listen(process.env.PORT)
}
bootstrap()
