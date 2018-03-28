export class FaqDto {
    readonly question: string;
    readonly answer?: string;
    readonly visible: boolean;
    readonly description: string;
    readonly link_str: string;
    readonly created?: any;
}

export class UpdateFaqDto {
    id: string;
    faq: FaqDto;
}