import { Model } from 'mongoose';
import {Component} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {FaqSchema} from "./faq.schema";
import {FaqDto} from "./faq.dto";
import {IFaq} from "./faq.interface";

@Component()
export class FaqService{
    constructor(@InjectModel(FaqSchema) private readonly faqModel: Model<FaqDto>) {}

    async createFaq(createFaqDto: FaqDto): Promise<any> {
        const createFaq = new this.faqModel(createFaqDto);
        return await createFaq.save();
    }

    async findOne(params: Object) {
        return await this.faqModel.findOne(params).exec();
    }

    async findAll(): Promise<IFaq[]> {
        return await this.faqModel.find().exec();
    }

    async getPage(page: number): Promise<IFaq[]> {
        let paginateStep = 10;
        return await this.faqModel.find().sort({_id: -1}).skip(page*paginateStep).limit(paginateStep).exec();
    }

    async updateFaq(id: string, updateFaqDto: FaqDto): Promise<any> {
        return await this.faqModel.findByIdAndUpdate(id, updateFaqDto, {new: true}).exec().then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    }

    async deleteFaq(id: string): Promise<IFaq> {
        return await this.faqModel.findByIdAndRemove(id).exec().then(doc => {
            return doc;
        }).catch(err => {
            throw err;
        });
    }
}