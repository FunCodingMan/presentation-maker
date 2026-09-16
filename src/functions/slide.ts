import { Slide } from "../types/slide.js";


function setSlideBackgroundColor(slide: Slide, color: string): Slide {
    return {
        ...slide,
        background: {type: 'color', color}
    }
}
//TODO: Проверка на то, что старый файл не поменялся (только то поле которое меняем)

function setSlideBackgroundImage(slide: Slide, imageUrl: string): Slide {

    return {
        ...slide,
        background: {type: 'image', src: imageUrl}
    }
}

function setSlideBackgroundGradient(slide: Slide, colors: string[], angle?: number): Slide {
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