import type { Presentation } from "../types/presentation.js";
import type { Slide, Background } from "../types/slide.js";
import type { SlideObject, Filter, Animation, Size, Point, TextStyle, FigureStyle } from "../types/objects.js";

function addTextObject(slide: Slide,
                       textId: string, 
                       content: string,
                       position: Point, 
                       size: Size, 
                       textStyle: TextStyle): Slide {
    return {
        ...slide,
        objects: [...slide.objects, {
            type: 'text',
            id: textId,
            position,
            size,
            content,
            textStyle
        }],
    }
}

function addImageObject(slide: Slide, imageId: string, imageUrl: string, position: Point, size: Size, imgFilter: Filter): Slide {
    return {
        ...slide,
        objects: [...slide.objects, {
            type: 'image',
            id: imageId,
            position,
            size,
            src: imageUrl,
            filters: imgFilter
        }]
    }
}

function addFigureObject(slide: Slide, figureId: string, position: Point, size: Size, figureStyle: FigureStyle): Slide {
    return {
        ...slide,
        objects: [...slide.objects, {
            type: 'figure',
            id: figureId,
            position,
            size,
            figureStyle
        }]
    }
}

function removeObject(slide: Slide, objectId: string): Slide {
    return {
        ...slide,
        objects: slide.objects.filter(obj => obj.id !== objectId)
    }
}

function moveObject(slide: Slide, objectId: string, newPosition: Point): Slide {
    return {
        ...slide,
        objects: slide.objects.map(obj => {
            if (obj.id === objectId) {
                return {
                    ...obj,
                    position: newPosition
                }
            }
            return obj
        })
    }
}

function resizeObject(slide: Slide, objectId: string, newSize: Size): Slide {
    if (newSize.width <= 0 || newSize.width <= 0) return slide;

    return {
        ...slide,
        objects: slide.objects.map(obj => {
            if (obj.id === objectId) {
                return {
                    ...obj,
                    size: newSize
                }
            }
            return obj
        })
    }
}

function updateTextObjectStyle(slide: Slide, objectId: string, newTextStyle: TextStyle): Slide {
    return {
        ...slide,
        objects: slide.objects.map(obj => {
            if (obj.id === objectId) {
                return {
                    ...obj,
                    textStyle: newTextStyle
                }
            }
            return obj
        })
    }
}

function updateImageObjectStyle(slide: Slide, objectId: string, newFilter: Filter){
    return {
        ...slide,
        objects: slide.objects.map(obj => {
            if (obj.id === objectId) {
                return {
                    ...obj,
                    filters: newFilter
                }
            }
            return obj
        })
    }    
}

function updateFigureObjectStyle(slide: Slide, objectId: string, newFigureStyle: FigureStyle) {
    return {
        ...slide,
        objects: slide.objects.map(obj => {
            if (obj.id === objectId) {
                return {
                    ...obj,
                    figureStyle: newFigureStyle
                }
            }
            return obj
        })
    }        
}

export {
    addTextObject,
    addImageObject,
    addFigureObject,
    removeObject,
    moveObject,
    resizeObject,
    updateTextObjectStyle,
    updateImageObjectStyle,
    updateFigureObjectStyle
}



    

