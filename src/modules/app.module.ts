import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ApiModule} from './api/api.module';
import {NewsModule} from "./news/news.module";
import {BlogModule} from "./blog/blog.module";
import {FaqModule} from "./faq/faq.module";
import {AuthenticationModule} from "./authentication/authentication.module";
import {ManagementModule} from "./management/management.module";

@Module({
  imports: [
      MongooseModule.forRoot('mongodb://localhost:27017/restapidb'),
      AuthenticationModule,
      ManagementModule,
      ApiModule,
      NewsModule,
      BlogModule,
      FaqModule
  ]
})
export class ApplicationModule {}
