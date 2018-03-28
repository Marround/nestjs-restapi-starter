export interface IFaq {
    _id: string;
    question: string;
    answer?: string;
    visible: boolean;
    description: string;
    link_str: string,
    created?: any;
}