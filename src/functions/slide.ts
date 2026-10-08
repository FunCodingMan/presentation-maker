import { Slide } from "../types/slide.js";


function setSlideBackgroundColor(slide: Slide, color: string): Slide {
    return {
        ...slide,
        background: {type: 'color', color}
    }
}

function setSlideBackgroundImage(slide: Slide, imageUrl: string): Slide {

    return {
        ...slide,
        background: {type: 'image', src: imageUrl}
    }
}

type GradientArgs = {
    colors: string[], angle?: number
};

function setSlideBackgroundGradient(slide: Slide, {colors, angle}: GradientArgs): Slide {
    return {
        ...slide,
        background: {type: 'gradient', colors, angle}
    }
}

function clearSlideBackground(slide: Slide): Slide {
    return setSlideBackgroundColor(slide, 'white')
}

export {
    setSlideBackgroundColor,
    setSlideBackgroundImage,
    setSlideBackgroundGradient,
    clearSlideBackground
}