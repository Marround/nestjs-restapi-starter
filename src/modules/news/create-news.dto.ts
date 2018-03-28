export class NewsDto {
    readonly title: string;
    readonly body: number;
    readonly link_str: string;
    readonly anons: string;
    readonly description: string;
    readonly created?: any;
}

export class UpdateNewsDto {
    id: string;
    news: NewsDto
}