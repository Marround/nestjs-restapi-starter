import {Module} from '@nestjs/common';
import {NewsController} from "./news.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {NewsSchema} from "./news.schema";
import {NewsService} from "./news.service";

@Module({
    imports: [
        MongooseModule.forFeature([{name: "News", schema: NewsSchema}])
    ],
    controllers: [NewsController],
    components: [NewsService]
})
export class NewsModule {
}