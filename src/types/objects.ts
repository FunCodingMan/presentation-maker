type SlideObject = TextObject | ImageObject;

type TextObject = BaseObject & {
    type: 'text'
    content: string
    fontFamily: string
    fontSize: number
    color: string
    style: 'normal' | 'italic' | 'bold'
    textLayout: 'left' | 'center' | 'right'
}

type ImageObject = BaseObject & {
    id: string
    type: 'image'
    src: string
}

type FigureObejct = BaseObject & {
    type: 'figure'
    shape: 'rectangle' | 'circle' | 'triangle'
    fillColor: string
    strokeColor: string
    strokeWidth: number
}

type BaseObject = {
    id: string
    position: Point
    size: Size
    type: 'figure' | 'image' | 'text'
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
    FigureObejct,
    Animation,
    Filter
}