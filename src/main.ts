import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './modules/app.module';
import { config } from "dotenv"

async function bootstrap(){
	config();
	const app = await NestFactory.create(ApplicationModule);

    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        next();
    });

	await app.listen(3100);
}
bootstrap();
