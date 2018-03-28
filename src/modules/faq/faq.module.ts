import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {FaqSchema} from "./faq.schema";
import {FaqService} from "./faq.service";
import {FaqController} from "./faq.controller";

@Module({
    imports: [MongooseModule.forFeature([{name: "FAQ", schema: FaqSchema}])],
    controllers: [FaqController],
    components: [FaqService]
})
export class FaqModule {}