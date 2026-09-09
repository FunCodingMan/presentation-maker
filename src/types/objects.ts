type SlideObject = TextObject | ImageObject | FigureObject;

type TextObject = BaseObject & {
    type: 'text'
    content: string
    textStyle: TextStyle
}

type ImageObject = BaseObject & {
    type: 'image'
    src: string
    filters?: Filter;
}

type FigureObject = BaseObject & {
    type: 'figure'
    figureStyle: FigureStyle
}

type BaseObject = {
    id: string
    position: Point
    size: Size
    type: 'figure' | 'image' | 'text'
    animation?: Animation;
}

type Animation = {
    type: 'fade-in' | 'slide-in' | 'bounce'
    duration: number
    delay: number
}

type Filter = {
    blur?: number
    brightness?: number
}

type FigureStyle = {
    shape: 'rectangle' | 'circle' | 'triangle'
    fillColor: string
    strokeColor: string
    strokeWidth: number
}

type TextStyle = {
    fontFamily: string
    fontSize: number
    fontColor: string
    fontStyle: 'normal' | 'italic' | 'bold'
    textLayout: 'left' | 'center' | 'right'
}

type Size = {
    width: number
    height: number
}

type Point = {
    x: number
    y: number
}

export type { 
    TextObject, 
    ImageObject, 
    SlideObject,
    FigureObject,
    Animation,
    Filter,
    Size,
    Point,
    TextStyle,
    FigureStyle,
}