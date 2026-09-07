import type {SlideObject } from "./objects.js";

type BackgroundColor = {
    type: 'bg_color';
    color: string;
}

type BackGroundImage = {
    type: 'bg_image';
    src: string
}

type BackgroundGradient = {
    type: 'bg_gradient';
}

type Slide = {
    id: string;
    name?: string;
    objects?: SlideObject[];
}

type Background = BackgroundColor | BackGroundImage;

export {
    type Slide, 
    type Background
}