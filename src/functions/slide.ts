import { Slide } from "../types/slide.js";


function setSlideBackgroundColor(slide: Slide, color: string): Slide
{
    return {
        ...slide,
        background: {type: 'bg-color', color}
    }
}

function setSlideBackgroundImage(slide: Slide, imageUrl: string): Slide
{
    return {
        ...slide,
        background: {type: 'bg-image', src: imageUrl}
    }
}

function setSlideBackgroundGradient(slide: Slide, colors: string[], angle?: number): Slide
{
    return {
        ...slide,
        background: {type: 'bg-gradient', colors, angle}
    }
}

function clearSlideBackground(slide: Slide): Slide
{
    return setSlideBackgroundColor(slide, 'white')
}

export {
    setSlideBackgroundColor,
    setSlideBackgroundImage,
    setSlideBackgroundGradient,
    clearSlideBackground
}