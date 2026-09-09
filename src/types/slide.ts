import type { SlideObject } from "./objects.js";

type Slide = {
    id: string
    name?: string
    background: Background
    objects: SlideObject[]
}

type Background = BackgroundColor | BackGroundImage | BackgroundGradient;

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

export type {
    Slide, 
    Background,
    BackgroundColor,
    BackGroundImage,
    BackgroundGradient
}