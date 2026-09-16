import { describe, it, expect } from 'vitest';
import { Slide
        } from '../types/slide.js';
import {setSlideBackgroundColor,
        setSlideBackgroundGradient, 
        setSlideBackgroundImage,
        clearSlideBackground
        } from '../functions/slide.js'

function createTestSlide(slideName: string): Slide {
    return {
        id: slideName,
        name: slideName,
        background: {type: 'color', color: 'white'},
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
            background: {type: 'color', color: 'red'},
            objects: []
        })

        expect(oldSlide.background).toEqual({
            "color": "white",
            "type": "color",
        })

        expect(coloredSlide).not.toBe(oldSlide)
    })
    it('sets background image', () => {
        const oldSlide = createTestSlide('1-slide')

        const slideWithImage = setSlideBackgroundImage(oldSlide, 'images/image.png')

        expect(slideWithImage).toEqual({
            id: '1-slide',
            name: '1-slide',
            background: {type: 'image', src: 'images/image.png'},
            objects: []
        })

        expect(oldSlide.background).toEqual({
            "color": "white",
            "type": "color",
        })

        expect(slideWithImage).not.toBe(oldSlide)
    })
    it ('sets background gradient', () => {
        const oldSlide = createTestSlide('1-slide')

        const slideWithGradient = setSlideBackgroundGradient(oldSlide, ['red', 'blue', 'green'], 120)

        expect(slideWithGradient).toEqual({
            id: '1-slide',
            name: '1-slide',
            background: {type: 'gradient', colors: ['red', 'blue', 'green'], angle: 120},
            objects: []
        })
        expect(oldSlide.background).toEqual({
            "color": "white",
            "type": "color",
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
            background: {type: 'color', color: 'white'},
            objects: []
        })
        expect(oldSlide.background).toEqual({
            type: "color",
            color: "white",
        })
        expect(slideWithImage.background).toEqual({
            type: 'image',
            src: 'images/image.png'
        })

        expect(slideWithClearedBackground).not.toBe(slideWithImage)
    })
})