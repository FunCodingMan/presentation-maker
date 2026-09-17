import { describe, it, expect } from 'vitest'
import type { Slide } from '../types/slide.js'
import {
    addTextObject, addImageObject, addFigureObject,
    removeObject, moveObject, resizeObject,
    updateTextObjectStyle, updateImageObjectStyle, updateFigureObjectStyle
} from '../functions/objects.js'
import type {
    TextObjectArgs, ImageObjectArgs, FigureObjectArgs
} from '../functions/objects.js'
import type {
    Point, Size, TextStyle, TextObject, ImageObject, FigureObject
} from '../types/objects.js'

const defaultPosition: Point = { x: 100, y: 100 }
const defaultSize: Size = { width: 20, height: 30 }
const defaultTextStyle: TextStyle = {
    fontFamily: 'Arial', fontSize: 5, fontColor: 'black', fontStyle: 'normal'
}

function getTextArgs(id = '1-text', text = 'Привет'): TextObjectArgs {
    return {
        id,
        spans: [{ text, style: defaultTextStyle }],
        position: defaultPosition,
        size: defaultSize,
        textLayout: 'center'
    }
}

function getImageArgs(id = '1-image'): ImageObjectArgs {
    return {
        id,
        url: 'images/image.png',
        position: { x: 150, y: 150 },
        size: { width: 120, height: 180 },
        filters: { blur: 10, brightness: 20 }
    }
}

function getFigureArgs(id = '1-figure'): FigureObjectArgs {
    return {
        id,
        position: { x: 160, y: 123 },
        size: { width: 122, height: 123 },
        figureStyle: { 
            shape: 'circle', 
            fillColor: 'red', 
            strokeColor: 'blue', 
            strokeWidth: 5 
        }
    }
}

function createTestSlide(slideName = '1-slide'): Slide {
    return { 
        id: slideName, 
        name: slideName, 
        background: { type: 'color', color: 'white' }, 
        objects: [] 
    }
}

function createTestSlideWithObject(slideName = '1-slide'): Slide {
    return addTextObject(createTestSlide(slideName), getTextArgs())
}

function createTestSlideWithFewObjects(slideName: string, objects: string[]): Slide {
    return objects.reduce(
        (slide, objId) => addTextObject(slide, getTextArgs(objId, objId)), 
        createTestSlide(slideName)
    )
}

function createTestImage(slide: Slide): Slide {
    return addImageObject(slide, getImageArgs())
}

function createTestFigure(slide: Slide): Slide {
    return addFigureObject(slide, getFigureArgs())
}

describe('object actions', () => {
    it('adds text object to empty slide', () => {
        const oldSlide = createTestSlide()
        const res = addTextObject(oldSlide, getTextArgs())
        
        expect(res).not.toBe(oldSlide)
        expect(oldSlide.objects).toHaveLength(0)
        expect((res.objects[0] as TextObject).spans[0].text).toBe('Привет')
    })

    it('adds text object to slide with objects', () => {
        const oldSlide = createTestSlideWithObject()
        const res = addTextObject(oldSlide, {
            ...getTextArgs('2-text', 'Пока'),
            position: { x: 50, y: 20 },
            size: { width: 42, height: 67 }
        })
        
        expect(res).not.toBe(oldSlide)
        expect(oldSlide.objects).toHaveLength(1)
        expect(res.objects).toHaveLength(2)
        expect(res.objects[0]).not.toBe(res.objects[1])
        expect((res.objects[1] as TextObject).spans[0].text).toBe('Пока')
    })

    it('adds image object to empty slide', () => {
        const oldSlide = createTestSlide()
        const res = createTestImage(oldSlide)
        
        expect(res).not.toBe(oldSlide)
        expect(oldSlide.objects).toHaveLength(0)
        expect((res.objects[0] as ImageObject).filters).toEqual({ blur: 10, brightness: 20 })
    })

    it('adds image to slide with objects', () => {
        const oldSlide = createTestSlideWithObject()
        const res = createTestImage(oldSlide)
        
        expect(res).not.toBe(oldSlide)
        expect(oldSlide.objects).toHaveLength(1)
        expect(res.objects).toHaveLength(2)
        expect(res.objects[0]).not.toBe(res.objects[1])
    })

    it('adds figure to empty slide', () => {
        const oldSlide = createTestSlide()
        const res = createTestFigure(oldSlide)
        
        expect(res).not.toBe(oldSlide)
        expect(oldSlide.objects).toHaveLength(0)
        expect((res.objects[0] as FigureObject).figureStyle.fillColor).toBe('red')
    })

    it('adds figure to slide with objects', () => {
        const oldSlide = createTestSlideWithObject()
        const res = createTestFigure(oldSlide)
        
        expect(res).not.toBe(oldSlide)
        expect(oldSlide.objects).toHaveLength(1)
        expect(res.objects).toHaveLength(2)
        expect(res.objects[0]).not.toBe(res.objects[1])
    })

    it('removes object from slide with one object', () => {
        const oldSlide = createTestSlideWithObject()
        const res = removeObject(oldSlide, '1-text')
        
        expect(res).not.toBe(oldSlide)
        expect(oldSlide.objects).toHaveLength(1)
        expect(res.objects).toHaveLength(0)
    })

    it('removes object from slide with few objects', () => {
        const oldSlide = createTestSlideWithFewObjects('1-slide', ['1-text', '2-text'])
        const res = removeObject(oldSlide, '1-text')
        
        expect(res).not.toBe(oldSlide)
        expect(oldSlide.objects).toHaveLength(2)
        expect(res.objects).toHaveLength(1)
        expect(res.objects[0].id).toBe('2-text')
    })

    it('removes object from empty slide', () => {
        const oldSlide = createTestSlide()
        const res = removeObject(oldSlide, '1-slide')
        
        expect(res).not.toBe(oldSlide)
        expect(res.objects).toHaveLength(0)
    })

    it('moves object from slide with one object', () => {
        const oldSlide = createTestSlideWithObject()
        const res = moveObject(oldSlide, '1-text', { x: 55, y: 56 })
        
        expect(res).not.toBe(oldSlide)
        expect(oldSlide.objects[0].position).toEqual(defaultPosition)
        expect(res.objects[0].position).toEqual({ x: 55, y: 56 })
    })

    it('moves object from slide with few object', () => {
        const oldSlide = createTestSlideWithFewObjects('1-slide', ['1-text', '2-text'])
        const res = moveObject(oldSlide, '2-text', { x: 99, y: 57 })
        
        expect(res).not.toBe(oldSlide)
        expect(oldSlide.objects[1].position).toEqual(defaultPosition)
        expect(res.objects[0].position).toEqual(defaultPosition)
        expect(res.objects[1].position).toEqual({ x: 99, y: 57 })
    })

    it('moves object from empty slide', () => {
        const oldSlide = createTestSlide()
        const res = moveObject(oldSlide, '1-text', { x: 20, y: 30 })
        
        expect(res).not.toBe(oldSlide)
        expect(res.objects).toHaveLength(0)
    })

    it('resizes object from slide with one object', () => {
        const oldSlide = createTestSlideWithObject()
        const res = resizeObject(oldSlide, '1-text', { width: 11, height: 12 })
        
        expect(res).not.toBe(oldSlide)
        expect(oldSlide.objects[0].size).toEqual(defaultSize)
        expect(res.objects[0].size).toEqual({ width: 11, height: 12 })
    })

    it('resizes slide from slide with few object', () => {
        const oldSlide = createTestSlideWithFewObjects('1-slide', ['1-text', '2-text'])
        const res = resizeObject(oldSlide, '1-text', { width: 12, height: 52 })
        
        expect(res).not.toBe(oldSlide)
        expect(oldSlide.objects[0].size).toEqual(defaultSize)
        expect(res.objects[0].size).toEqual({ width: 12, height: 52 })
        expect(res.objects[1].size).toEqual(defaultSize)
    })

    it('resizes object from empty slide', () => {
        const oldSlide = createTestSlide()
        const res = resizeObject(oldSlide, '1-text', { width: 12, height: 52 })
        
        expect(res).not.toBe(oldSlide)
        expect(res.objects).toHaveLength(0)
    })

    it('resizes object with size less then zero', () => {
        const oldSlide = createTestSlideWithObject()
        const res = resizeObject(oldSlide, '1-text', { width: -11, height: 12 })
        
        expect(oldSlide.objects[0].size).toEqual(defaultSize)
        expect(res.objects[0].size).toEqual(defaultSize)
    })

    it('updates text object style', () => {
        const oldSlide = createTestSlideWithObject()
        const newStyle: TextStyle = { 
            fontFamily: 'Times New Roman', 
            fontSize: 25, fontColor: 'yellow',
            fontStyle: 'bold' 
        }
        
        const res = updateTextObjectStyle(oldSlide, '1-text', newStyle)
        
        expect(res).not.toBe(oldSlide)
        expect((oldSlide.objects[0] as TextObject).spans[0].style).toEqual(defaultTextStyle)
        expect((res.objects[0] as TextObject).spans[0].style).toEqual(newStyle)
    })

    it('updates image object style', () => {
        const baseSlide = createTestImage(createTestSlideWithObject())
        const res = updateImageObjectStyle(baseSlide, '1-image', { blur: 1, brightness: 69 })
        
        expect(res).not.toBe(baseSlide)
        expect((baseSlide.objects[1] as ImageObject).filters).toEqual({ blur: 10, brightness: 20 })
        expect((res.objects[1] as ImageObject).filters).toEqual({ blur: 1, brightness: 69 })
    })

    it('updates figure object style', () => {
        const baseSlide = createTestFigure(createTestSlideWithObject())
        const res = updateFigureObjectStyle(baseSlide, '1-figure', {
            shape: 'circle', fillColor: 'yellow', strokeColor: 'red', strokeWidth: 3
        })
        
        expect(res).not.toBe(baseSlide)
        expect((baseSlide.objects[1] as FigureObject).figureStyle.fillColor).toBe('red')
        expect((res.objects[1] as FigureObject).figureStyle.fillColor).toBe('yellow')
    })
})