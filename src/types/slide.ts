import type { SlideObject } from "./objects.js";

type Slide = {
    id: string
    name?: string
    background: Background
    objects: SlideObject[]
}

type Background = BackgroundColor | BackGroundImage | BackgroundGradient;
//TODO: Без bg
type BackgroundColor = {
    type: 'color'
    color: string;
}

type BackGroundImage = {
    type: 'image'
    src: string
}

type BackgroundGradient = {
    type: 'gradient'
    colors: string[]
    angle?: number
}

export type {
    Slide, 
    Background,
    BackgroundColor,
    BackGroundImage,
    BackgroundGradient,
}