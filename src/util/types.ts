export type Card = {
    code: string;
    image: string;
    images: {svg: string, png: string};
    value: string;
    suit: string;
};

export type ImageAndDesc = {
    image: string;
    desc: string;
};