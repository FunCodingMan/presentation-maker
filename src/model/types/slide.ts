import type { SlideObject } from "./objects.js"

type Slide = {
    id: string
    name?: string
    background: Background
    objects: SlideObject[]
}

type Background = BackgroundNone | BackgroundColor | BackGroundImage | BackgroundGradient

type BackgroundNone = {
    type: 'none'
}

type BackgroundColor = {
    type: 'color'
    color: string
}

type BackGroundImage = {
    type: 'image'
    src: string
}

type BackgroundGradient = {
    type: 'gradient'
    colors: string[]
    angle?: number
    gradientType?: 'linear' | 'radial'
}

export type {
    Slide, 
    Background,
    BackgroundNone,
    BackgroundColor,
    BackGroundImage,
    BackgroundGradient,
}