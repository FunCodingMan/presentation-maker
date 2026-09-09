import type {SlideObject } from "./objects.js";

type BackgroundColor = {
    type: 'bg-color'
    color: string;
}

type BackGroundImage = {
    type: 'bg-image'
    src: string
}

type BackgroundGradient = {
    type: 'bg-gradient'
    colors: string[]
    angle?: number
}

type Slide = {
    id: string
    name?: string
    background: Background
    objects: SlideObject[]
}

type Background = BackgroundColor | BackGroundImage | BackgroundGradient;

export {
    type Slide, 
    type Background,
    type BackgroundGradient
}