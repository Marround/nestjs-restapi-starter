export class BlogDto {
    readonly title: string;
    readonly body: number;
    readonly link_str: string;
    readonly anons: string;
    readonly description: string;
    readonly created?: any;
}

export class UpdateBlogDto {
    id: string;
    blog: BlogDto
}