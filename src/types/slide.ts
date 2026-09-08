import type {SlideObject } from "./objects.js";

type BackgroundColor = {
    type: 'bg_color'
    color: string;
}

type BackGroundImage = {
    type: 'bg_image'
    src: string
}

type BackgroundGradient = {
    type: 'bg_gradient'
    colors: string[]
    angle?: number
}

type Slide = {
    id: string
    name?: string
    background?: Background
    objects?: SlideObject[]
}

type Background = BackgroundColor | BackGroundImage | BackgroundGradient;

export {
    type Slide, 
    type Background,
    type BackgroundGradient
}