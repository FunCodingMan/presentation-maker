import type { Slide, Background } from "../types/slide.js";
import type { Filter, Animation, Size, Point, TextStyle, FigureStyle, textObjectArgs, imageObjectArgs, figureObjectArgs } from "../types/objects.js";


//TODO: Отдельный тип для параметров args
function addTextObject(slide: Slide, {id, spans, position, size, textLayout}: textObjectArgs): Slide {
    return {
        ...slide,
        objects: [...slide.objects, {
            type: 'text',
            id,
            position,
            size,
            spans,
            textLayout
        }],
    }
}

function addImageObject(slide: Slide, {id, url, position, size, filters}: imageObjectArgs): Slide {
    return {
        ...slide,
        objects: [...slide.objects, {
            type: 'image',
            id,
            position,
            size,
            src: url,
            filters: filters
        }]
    }
}

function addFigureObject(slide: Slide, {id, position, size, figureStyle}: figureObjectArgs): Slide {
    return {
        ...slide,
        objects: [...slide.objects, {
            type: 'figure',
            id,
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
    if (newSize.width <= 0 || newSize.width <= 0) {
        return slide
    }

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
            if (obj.id === objectId && obj.type === 'text') {
                return {
                    ...obj,
                    spans: obj.spans.map(span => ({
                        ...span,
                        style: newTextStyle
                    }))
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