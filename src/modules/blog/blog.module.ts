import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {BlogSchema} from "./blog.schema";
import {BlogController} from "./blog.controller";
import {BlogService} from "./blog.service";

@Module({
    imports: [
        MongooseModule.forFeature([{name: "Blog", schema: BlogSchema}])
    ],
    controllers: [BlogController],
    components: [BlogService]
})

export class BlogModule{}