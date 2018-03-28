import {Get, Controller} from '@nestjs/common';


@Controller('api/showRestAPI')
export class ApiController {
    @Get()
    async findAll(): Object<any[]> {
        return await {
            news: [
                {
                    uri: 'api/news',
                    method: 'get',
                    response: 'last 10 news'
                },
                {
                    uri: 'api/news:id',
                    method: 'get',
                    response: 'news with id'
                },
                {
                    uri: 'api/news?page=n',
                    method: 'get',
                    response: 'page n on 10 news'
                }
            ]
        };
    }
}