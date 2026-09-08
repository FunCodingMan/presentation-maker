type Point = {
    x: number,
    y: number
}

type BaseObject = {
    id: string,
    posistion: Point,
    type: 'figure' | 'image' | 'text',
    width: number,
    height: number
}

type TextObject = BaseObject & {
    type: 'text';
    content: string;
    fontFamilyq: string;
    fontSize: number;
    color: string;
    style: string;
    textLayout: string;
}

type ImageObject = {
    id: string;
    type: 'image';
    src: string;
}

type SlideObject = TextObject | ImageObject;

export { 
    type TextObject, 
    type ImageObject, 
    type SlideObject 
}