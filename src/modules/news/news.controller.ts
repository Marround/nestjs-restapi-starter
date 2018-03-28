import {Get, Controller, Post, Res, HttpStatus, Query, Body, Put, Delete} from '@nestjs/common';
import {NewsDto, UpdateNewsDto} from "./create-news.dto";
import {NewsService} from "./news.service";

@Controller('api/news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Put()
    update(@Res() res, @Body() postBody: UpdateNewsDto) {
        if(postBody.id && postBody.news) {
            this.newsService.updateNews(postBody.id, postBody.news).then(data => {
                data? res.status(HttpStatus.CREATED).json(data) :
                    res.status(HttpStatus.NOT_FOUND).send({
                        code: HttpStatus.NOT_FOUND,
                        message: "Запись не найдена!"
                    });
            }, error => {
                res.status(HttpStatus.BAD_REQUEST).send(error);
            })
        }else {
            res.status(HttpStatus.NOT_FOUND).json(
                {
                    message: Object.keys(postBody).toString() + ' - Параметр не найден, или не верно задан',
                    code: HttpStatus.NOT_FOUND
                }
            );
        }
    }

    @Post()
    create(@Res() res, @Body() createNewsDto: NewsDto){
        this.newsService.createNews(createNewsDto).then(data => {
                res.status(HttpStatus.OK).json(data);
            },err => {
                res.status(HttpStatus.BAD_REQUEST).json(err);
            });
    }

    @Get()
    public showNews(@Query() query, @Res() res){
        if (query.id){
            this.newsService.findOne({'_id': query.id}).then(data => {
                data? res.status(HttpStatus.OK).json(data) : res.status(HttpStatus.NO_CONTENT).send();
            }, error => {
                res.status(HttpStatus.NO_CONTENT).send();
            });
        } else if (Object.keys(query).length === 0) {
            this.newsService.findAll().then(data => {
                res.status(HttpStatus.OK).send(data);
            });
        } else if(query.page && !isNaN(query.page)) {
            this.newsService.getPage(Number(query.page)).then(data => {
                data.length? res.status(HttpStatus.OK).json(data) : res.status(HttpStatus.NO_CONTENT).send();
            }, error => {
                res.status(HttpStatus.NO_CONTENT).send();
            });
        } else {
            res.status(HttpStatus.NOT_FOUND).json(
                {
                    message: Object.keys(query).toString() + ' - Параметр не найден, или не верно задан',
                    code: HttpStatus.NOT_FOUND
                }
            );
        }
    }

    @Delete()
    public deleteNews(@Res() res, @Body() delBody: DelResponse) {
        if(delBody.id) {
            this.newsService.deleteNews(delBody.id).then(doc => {
                doc? res.status(HttpStatus.OK).send() :
                    res.status(HttpStatus.NOT_FOUND).json({
                        status: HttpStatus.NOT_FOUND,
                        code: 404,
                        message: "Запись не найдена!"
                    });
            }, error => {
                res.status(HttpStatus.BAD_REQUEST).json(error);
            })
        } else if(Object.keys(delBody).length === 0) {
            res.status(HttpStatus.NOT_FOUND).json(
                {
                    message: 'Укажите ID новости!',
                    code: HttpStatus.BAD_REQUEST
                }
            );
        } else {
            res.status(HttpStatus.BAD_REQUEST).json(
                {
                    message: Object.keys(delBody).toString() + ' - Параметр не найден',
                    code: HttpStatus.BAD_REQUEST
                }
            );
        }
    }
}

export interface DelResponse {
    id: string
}