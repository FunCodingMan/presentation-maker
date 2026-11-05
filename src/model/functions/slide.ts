import { Slide } from "../types/slide.js"

function setSlideBackgroundColor(slide: Slide, color: string): Slide {
    return {
        ...slide,
        background: { type: 'color', color }
    }
}

function setSlideBackgroundImage(slide: Slide, imageUrl: string): Slide {
    return {
        ...slide,
        background: { type: 'image', src: imageUrl }
    }
}

type GradientArgs = {
    colors: string[]
    angle?: number
    gradientType?: 'linear' | 'radial'
}

function setSlideBackgroundGradient(slide: Slide, { colors, angle, gradientType = 'linear' }: GradientArgs): Slide {
    return {
        ...slide,
        background: { type: 'gradient', colors, angle, gradientType }
    }
}

function clearSlideBackground(slide: Slide): Slide {
    return {
        ...slide,
        background: { type: 'none' }
    }
}

export {
    setSlideBackgroundColor,
    setSlideBackgroundImage,
    setSlideBackgroundGradient,
    clearSlideBackground
}