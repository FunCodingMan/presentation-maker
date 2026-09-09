import { describe, it, expect } from 'vitest';
import { Slide,
         Background,
         BackgroundColor,
         BackGroundImage,
         BackgroundGradient
        } from '../types/slide.js';
import { generateId } from '../functions/presentation';
import {setSlideBackgroundColor,
        setSlideBackgroundGradient, 
        setSlideBackgroundImage,
        clearSlideBackground
        } from '../functions/slide.js'

function createTestSlide(slideName: string): Slide {
    return {
        id: slideName,
        name: slideName,
        background: {type: 'bg-color', color: 'white'},
        objects: []
    }
}
describe('slide actions', () => {
    it('sets background color', () => {
        const oldSlide = createTestSlide('1-slide')

        const coloredSlide = setSlideBackgroundColor(oldSlide, 'red')

        expect(coloredSlide).toEqual({
            id: '1-slide',
            name: '1-slide',
            background: {type: 'bg-color', color: 'red'},
            objects: []
        })

        expect(coloredSlide).not.toBe(oldSlide)
    })
    it('sets background image', () => {
        const oldSlide = createTestSlide('1-slide')

        const slideWithImage = setSlideBackgroundImage(oldSlide, 'images/image.png')

        expect(slideWithImage).toEqual({
            id: '1-slide',
            name: '1-slide',
            background: {type: 'bg-image', src: 'images/image.png'},
            objects: []
        })

        expect(slideWithImage).not.toBe(oldSlide)
    })
    it ('sets background gradient', () => {
        const oldSlide = createTestSlide('1-slide')

        const slideWithGradient = setSlideBackgroundGradient(oldSlide, ['red', 'blue', 'green'], 120)

        expect(slideWithGradient).toEqual({
            id: '1-slide',
            name: '1-slide',
            background: {type: 'bg-gradient', colors: ['red', 'blue', 'green'], angle: 120},
            objects: []
        })
        expect(slideWithGradient).not.toBe(oldSlide)
    })
    it('clears background', () => {
        const oldSlide = createTestSlide('1-slide')

        const slideWithImage = setSlideBackgroundImage(oldSlide, 'images/image.png')

        const slideWithClearedBackground = clearSlideBackground(slideWithImage)

        expect(slideWithClearedBackground).toEqual({
            id: '1-slide',
            name: '1-slide',
            background: {type: 'bg-color', color: 'white'},
            objects: []
        })

        expect(slideWithClearedBackground).not.toBe(slideWithImage)
    })
})