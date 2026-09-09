type SlideObject = TextObject | ImageObject;

type TextObject = BaseObject & {
    type: 'text';
    content: string;
    fontFamily: string;
    fontSize: number;
    color: string;
    style: string;
    textLayout: string;
}

type ImageObject = BaseObject & {
    id: string;
    type: 'image';
    src: string;
}


type BaseObject = {
    id: string,
    position: Point,
    size: Size,
    type: 'figure' | 'image' | 'text',
}

type Size = {
    width: number,
    height: number
}

type Point = {
    x: number,
    y: number
}

export { 
    type TextObject, 
    type ImageObject, 
    type SlideObject 
}