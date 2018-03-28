import {Get, Controller, Post, Res, HttpStatus, Query, Body, Put, Delete} from '@nestjs/common';
import {BlogDto, UpdateBlogDto} from "./blog.dto";
import {BlogService} from "./blog.service";

@Controller('api/blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) {}

    @Put()
    update(@Res() res, @Body() postBody: UpdateBlogDto) {
        if(postBody.id && postBody.blog) {
            this.blogService.updateBlog(postBody.id, postBody.blog).then(data => {
                data? res.status(HttpStatus.CREATED).json(data) :
                    res.status(HttpStatus.NOT_FOUND).send({
                        code: HttpStatus.NOT_FOUND,
                        message: "Запись не найдена!"
                    });
            }, error => {
                res.status(HttpStatus.BAD_REQUEST).send(error);
            })
        } else {
            res.status(HttpStatus.NOT_FOUND).json(
                {
                    message: Object.keys(postBody).toString() + ' - Параметр не найден, или не верно задан',
                    code: HttpStatus.NOT_FOUND
                }
            );
        }
    }

    @Post()
    create(@Res() res, @Body() createBlogDto: BlogDto){
        this.blogService.createBlog(createBlogDto).then(data => {
            res.status(HttpStatus.OK).json(data);
        },err => {
            res.status(HttpStatus.BAD_REQUEST).json(err);
        });
    }

    @Get()
    public showBlog(@Query() query, @Res() res){
        if (query.id){
            this.blogService.findOne({'_id': query.id}).then(data => {
                data? res.status(HttpStatus.OK).json(data) : res.status(HttpStatus.NO_CONTENT).send();
            }, error => {
                res.status(HttpStatus.NO_CONTENT).send();
            });
        } else if (Object.keys(query).length === 0) {
            this.blogService.findAll().then(data => {
                res.status(HttpStatus.OK).send(data);
            });
        } else if(query.page && !isNaN(query.page)) {
            this.blogService.getPage(Number(query.page)).then(data => {
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
    public deleteBlog(@Res() res, @Body() delBody: DelResponse) {
        if(delBody.id) {
            this.blogService.deleteBlog(delBody.id).then(doc => {
                doc? res.status(HttpStatus.OK).send() :
                    res.status(HttpStatus.NOT_FOUND).json({
                        status: 404,
                        message: "Запись не найдена!"
                    });
            }, error => {
                res.status(HttpStatus.BAD_REQUEST).json(error);
            })
        } else if(Object.keys(delBody).length === 0) {
            res.status(HttpStatus.NOT_FOUND).json(
                {
                    message: 'Укажите ID блога!',
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