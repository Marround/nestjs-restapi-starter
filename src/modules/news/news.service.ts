import { Model } from 'mongoose';
import {Component} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {NewsSchema} from "./news.schema";
import { INews } from "./news.interface";
import {NewsDto} from "./create-news.dto";

@Component()
export class NewsService {
    constructor(@InjectModel(NewsSchema) private readonly newsModel: Model<NewsDto>) {}

    async createNews(createNewsDto: NewsDto): Promise<any> {
        const createNews = new this.newsModel(createNewsDto);
        return await createNews.save();
    }

    async findOne(params: Object) {
        return await this.newsModel.findOne(params).exec();
    }

    async findAll(): Promise<INews[]> {
        return await this.newsModel.find().exec();
    }

    async getPage(page: number): Promise<INews[]> {
        let paginateStep = 10;
        return await this.newsModel.find().sort({_id: -1}).skip(page*paginateStep).limit(paginateStep).exec();
    }

    async updateNews(id: string, updateNewsDto: NewsDto): Promise<any> {
        return await this.newsModel.findByIdAndUpdate(id, updateNewsDto, {new: true}).exec().then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    }

    async deleteNews(id: string): Promise<INews[]> {
        return await this.newsModel.findByIdAndRemove(id).exec().then(doc => {
            return doc;
        }).catch(err => {
            throw err;
        });
    }
}