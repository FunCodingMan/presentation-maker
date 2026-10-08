import type { Slide, Background } from "../types/slide.js";
import type { Filter, Animation, Size, Point, TextStyle, FigureStyle, TextSpan, SlideObject } from "../types/objects.js";
import { SlideObjectComponent } from "../components/SlideObject/SlideObject.js";

type TextObjectArgs = {
    id: string,
    spans: TextSpan[];
    position: Point,
    size: Size,
    textLayout: 'left' | 'center' | 'right';
}
type ImageObjectArgs = {
    id: string,
    url: string,
    position: Point,
    size: Size,
    filters: Filter
}

type FigureObjectArgs = {
    id: string,
    position: Point,
    size: Size,
    figureStyle: FigureStyle
}

function modifyObject(slide: Slide, objectId: string, modifyFn: (obj: SlideObject) => SlideObject): Slide {
    return {
        ...slide,
        objects: slide.objects.map(obj => 
            obj.id === objectId ? modifyFn(obj) : obj
        )
    }
}

function addTextObject(slide: Slide, {id, spans, position, size, textLayout}: TextObjectArgs): Slide {
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

function addImageObject(slide: Slide, {id, url, position, size, filters}: ImageObjectArgs): Slide {
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

function addFigureObject(slide: Slide, {id, position, size, figureStyle}: FigureObjectArgs): Slide {
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
    return modifyObject(slide, objectId, obj => ({
        ...obj,
        position: newPosition
    }));
}

function resizeObject(slide: Slide, objectId: string, newSize: Size): Slide {
    if (newSize.width <= 0 || newSize.height <= 0) {
        return slide;
    }

    return modifyObject(slide, objectId, obj => ({
        ...obj,
        size: newSize
    }));
}

function updateTextObjectStyle(slide: Slide, objectId: string, newTextStyle: TextStyle): Slide {
    return modifyObject(slide, objectId, obj => {
        if (obj.type === 'text') {
            return {
                ...obj,
                spans: obj.spans.map(span => ({
                    ...span,
                    style: newTextStyle
                }))
            };
        }
        return obj;
    });
}

function updateImageObjectStyle(slide: Slide, objectId: string, newFilter: Filter){
    return modifyObject(slide, objectId, obj => {
        if (obj.type === 'image') {
            return {
                ...obj,
                filters: newFilter
            };
        }
        return obj;
    });
}

function updateFigureObjectStyle(slide: Slide, objectId: string, newFigureStyle: FigureStyle) {
    return modifyObject(slide, objectId, obj => {
        if (obj.type === 'figure') {
            return {
                ...obj,
                figureStyle: newFigureStyle
            };
        }
        return obj;
    });   
}

type UpdateTextContentArgs = {
    objectId: string
    newText: string
}

function updateTextContent(slide: Slide, {objectId, newText} : UpdateTextContentArgs): Slide {
    return {
        ...slide,
        objects: slide.objects.map(obj => {
            if (obj.id === objectId && obj.type === 'text') {
                const baseStyle = obj.spans[0]?.style || { fontSize: 24, fontColor: '#000000', fontStyle: [] };
                const lines = newText.split('\n');
                const newSpans = lines.map((line, idx) => ({
                    text: idx    === lines.length - 1 ? line : line + '\n',
                    style: {...baseStyle}
                }))
                return {
                    ...obj,
                    spans: newSpans
                };
            }
            return obj;
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
    updateFigureObjectStyle,
    updateTextContent
}

export type {
    TextObjectArgs,
    ImageObjectArgs,
    FigureObjectArgs
}