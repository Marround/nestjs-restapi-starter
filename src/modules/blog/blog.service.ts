import { Model } from 'mongoose';
import {Component} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {BlogDto} from "./blog.dto";
import {IBlog} from "./blog.interface";
import {BlogSchema} from "./blog.schema";

@Component()
export class BlogService {
    constructor(@InjectModel(BlogSchema) private readonly blogModel: Model<BlogDto>) {}

    async createBlog(createBlogDto: BlogDto): Promise<any> {
        const createBlog = new this.blogModel(createBlogDto);
        return await createBlog.save();
    }

    async findOne(params: Object) {
        return await this.blogModel.findOne(params).exec();
    }

    async findAll(): Promise<IBlog[]> {
        return await this.blogModel.find().exec();
    }

    async getPage(page: number): Promise<IBlog[]> {
        let paginateStep = 10;
        return await this.blogModel.find().sort({_id: -1}).skip(page*paginateStep).limit(paginateStep).exec();
    }

    async updateBlog(id: string, updateBlogDto: BlogDto): Promise<any> {
        return await this.blogModel.findByIdAndUpdate(id, updateBlogDto, {new: true}).exec().then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    }

    async deleteBlog(id: string): Promise<IBlog> {
        return await this.blogModel.findByIdAndRemove(id).exec().then(doc => {
            return doc;
        }).catch(err => {
            throw err;
        });
    }
}