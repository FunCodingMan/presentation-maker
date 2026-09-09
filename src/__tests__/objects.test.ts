import { describe, it, expect } from 'vitest';
import { Slide } from '../types/slide.js';
import { addTextObject,
         addImageObject,
         addFigureObject,
         removeObject,
         moveObject,
         resizeObject,
         updateTextObjectStyle,
         updateImageObjectStyle,
         updateFigureObjectStyle
        } from '../functions/objects.js'

function createTestSlide(slideName: string): Slide {
    return {
        id: slideName,
        name: slideName,
        background: {type: 'bg-color', color: 'white'},
        objects: []
    }
}

function createTestSlideWithObject(slideName: string): Slide {
    return addTextObject(
            createTestSlide(slideName), 
            '1-text', 
            'Привет',
            {x: 100, y: 100},
            {width: 20, height: 30},
            {
                fontFamily: 'Arial',
                fontSize: 5,
                fontColor: 'black',
                fontStyle: 'normal',
                textLayout: 'center'
            }
        )
}

function createTestSlideWithFewObjects(slideName: string, objects: string[]): Slide {
    let slide = createTestSlide(slideName)

    for (const obj of objects) {
        slide = addTextObject(
            slide, 
            obj, 
            obj,
            {x: 100, y: 100},
            {width: 20, height: 30},
            {
                fontFamily: 'Arial',
                fontSize: 5,
                fontColor: 'black',
                fontStyle: 'normal',
                textLayout: 'center'
            }
        )
    }

    return slide
}

describe('object actions', () => {
    it('adds text object to empty slide', () => {
        const slideWithTextObject = createTestSlideWithObject('1-slide')

        expect(slideWithTextObject).toEqual({
            "background": {
                "color": "white",
                "type": "bg-color",
            },
            "id": "1-slide",
            "name": "1-slide",
            "objects": [
                {
                "content": "Привет",
                "id": "1-text",
                "position": {
                    "x": 100,
                    "y": 100,
                },
                "size": {
                    "height": 30,
                    "width": 20,
                },
                "textStyle": {
                    "fontColor": "black",
                    "fontFamily": "Arial",
                    "fontSize": 5,
                    "fontStyle": "normal",
                    "textLayout": "center",
                },
                "type": "text",
                },
            ]            
        })
    })
    it('adds text object to slide with objects', () => {
        const oldSlide = createTestSlideWithObject('1-slide')

        const slideWithTwoObjects = addTextObject(
            oldSlide,
            '2-text', 
            'Пока',
            {x: 50, y: 20},
            {width: 42, height: 67},
            {
                fontFamily: 'Arial',
                fontSize: 5,
                fontColor: 'black',
                fontStyle: 'normal',
                textLayout: 'center'
            } 
        )

        expect(slideWithTwoObjects.objects.length).toEqual(2)

        expect(slideWithTwoObjects).toEqual({
            "background": {
                "color": "white",
                "type": "bg-color",
            },
            "id": "1-slide",
            "name": "1-slide",
            "objects": [
                {
                "content": "Привет",
                "id": "1-text",
                "position": {
                    "x": 100,
                    "y": 100,
                },
                "size": {
                    "height": 30,
                    "width": 20,
                },
                "textStyle": {
                    "fontColor": "black",
                    "fontFamily": "Arial",
                    "fontSize": 5,
                    "fontStyle": "normal",
                    "textLayout": "center",
                },
                "type": "text",
                },
                {
                "content": "Пока",
                "id": "2-text",
                "position": {
                    "x": 50,
                    "y": 20,
                },
                "size": {
                    "height": 67,
                    "width": 42,
                },
                "textStyle": {
                    "fontColor": "black",
                    "fontFamily": "Arial",
                    "fontSize": 5,
                    "fontStyle": "normal",
                    "textLayout": "center",
                },
                "type": "text",
                },
            ],             
        })

        expect(slideWithTwoObjects.objects[0]).not.toBe(slideWithTwoObjects.objects[1])
        expect(slideWithTwoObjects.objects[0]).not.toEqual(slideWithTwoObjects.objects[1])

        expect(slideWithTwoObjects).not.toBe(oldSlide)
    })
    it('adds image object to empty slide', () => {
        const oldSlide = createTestSlide('1-slide');

        const slideWithImageObject = addImageObject(
            oldSlide,
            '1-image',
            'images/image.png',
            {x: 150, y: 150},
            {width: 120, height: 180},
            {blur: 10, brightness: 20}
        )

        expect(slideWithImageObject.objects[0]).toEqual({
            "type": "image",
            "id": "1-image",
            "filters": {
                "blur": 10,
                "brightness": 20,
            },
            "position": {
                "x": 150,
                "y": 150,
            },
            "size": {
                "height": 180,
                "width": 120,
            },
            "src": "images/image.png",           
        })

        expect(slideWithImageObject).not.toBe(oldSlide)
    })
    it ('adds image to slide with objects', () => {
        const oldSlide = createTestSlideWithObject('1-slide')

        const slideWithImageObjectAndText = addImageObject(
            oldSlide,
            '1-image',
            'images/image.png',
            {x: 150, y: 150},
            {width: 120, height: 180},
            {blur: 10, brightness: 20}
        )
        expect(slideWithImageObjectAndText.objects[0]).not.toEqual(slideWithImageObjectAndText.objects[1])
        expect(slideWithImageObjectAndText.objects[0]).not.toBe(slideWithImageObjectAndText.objects[1])

        expect(slideWithImageObjectAndText.objects.length).toEqual(2)

        expect(slideWithImageObjectAndText).not.toBe(oldSlide)
    })

    it('adds figure to empty slide', () => {
        const oldSlide = createTestSlide('1-slide');

        const slideWithFigureObject = addFigureObject(
            oldSlide,
            '1-figure',
            {x: 160, y: 123},
            {width: 122, height: 123},
            {
                shape: 'circle',
                fillColor: 'red',
                strokeColor: 'blue',
                strokeWidth: 5
            }
        )

        expect(slideWithFigureObject.objects[0]).toEqual({
            "type": "figure",            
            "id": "1-figure",
            "figureStyle": {
                "fillColor": "red",
                "shape": "circle",
                "strokeColor": "blue",
                "strokeWidth": 5,
            },
            "position": {
                "x": 160,
                "y": 123,
            },
            "size": {
                "height": 123,
                "width": 122,
            },
        })


        expect(slideWithFigureObject).not.toBe(oldSlide)
    })
    it('adds figure to slide with objects', () => {
        const oldSlide = createTestSlideWithObject('1-slide')

        const slideWithFigureObject = addFigureObject(
            oldSlide,
            '1-figure',
            {x: 160, y: 123},
            {width: 122, height: 123},
            {
                shape: 'circle',
                fillColor: 'red',
                strokeColor: 'blue',
                strokeWidth: 5
            }
        )
        expect(slideWithFigureObject.objects[0]).not.toEqual(slideWithFigureObject.objects[1])
        expect(slideWithFigureObject.objects[0]).not.toBe(slideWithFigureObject.objects[1])

        expect(slideWithFigureObject.objects.length).toEqual(2)

        expect(slideWithFigureObject).not.toBe(oldSlide)
    })
    it('removes object from slide with one object', () => {
        const oldSlide = createTestSlideWithObject('1-slide')

        const testSlideWithNoObjects = removeObject(oldSlide, '1-text')

        expect(testSlideWithNoObjects.objects.length).toEqual(0)
        expect(testSlideWithNoObjects).not.toBe(oldSlide)
    })
    it('removes object from slide with few objects', () => {
        const oldSlide = createTestSlideWithFewObjects('1-slide', ['1-text', '2-text'])

        const testSlideWithNoObjects = removeObject(oldSlide, '1-text')

        expect(testSlideWithNoObjects.objects.length).toEqual(1)
        expect(testSlideWithNoObjects.objects[0].id).toEqual('2-text')
        expect(testSlideWithNoObjects).not.toBe(oldSlide)
    })

    it('removes object from empty slide', () => {
        const oldSlide = createTestSlide('1-slide')

        const testSlide = removeObject(oldSlide, '1-slide')

        expect(testSlide.objects.length).toEqual(0)
        expect(testSlide).not.toBe(oldSlide)
    })

    it('moves object from slide with one object', () => {
        const oldSlide = createTestSlideWithObject('1-slide')

        const slideWithMovedObject = moveObject(oldSlide, '1-text', {x: 55, y: 56})

        expect(slideWithMovedObject.objects[0].position).toEqual({
            x: 55,
            y: 56
        })
        expect(slideWithMovedObject).not.toBe(oldSlide)
    })

    it('moves slide from slide with few object', () => {
        const oldSlide = createTestSlideWithFewObjects('1-slide', ['1-text', '2-text'])

        const testSlideWithMovedObject = moveObject(oldSlide, '2-text', {x: 99, y: 57})

        expect(testSlideWithMovedObject.objects.length).toEqual(2)
        expect(testSlideWithMovedObject.objects[0].position).toEqual({
            x: 100,
            y: 100
        })
        expect(testSlideWithMovedObject.objects[1].position).toEqual({
            x: 99,
            y: 57
        })
        expect(testSlideWithMovedObject).not.toBe(oldSlide)
    })
    it('moves object from empty slide', () => {
        const oldSlide = createTestSlide('1-slide')

        const testSlide = moveObject(oldSlide, '1-text', {x: 20, y: 30})

        expect(testSlide.objects.length).toEqual(0)
        expect(testSlide).not.toBe(oldSlide)
    })
    it('resizes object from slide with one object', () => {
        const oldSlide = createTestSlideWithObject('1-slide')

        const slideWithResizedObject = resizeObject(oldSlide, '1-text', {width: 11, height: 12})

        expect(slideWithResizedObject.objects[0].size).toEqual({
            width: 11,
            height: 12
        })
        expect(slideWithResizedObject).not.toBe(oldSlide)
    })

    it('resizes slide from slide with few object', () => {
        const oldSlide = createTestSlideWithFewObjects('1-slide', ['1-text', '2-text'])

        const testSlideWithResizedObject = resizeObject(oldSlide, '1-text', {width: 12, height: 52})

        expect(testSlideWithResizedObject.objects.length).toEqual(2)
        expect(testSlideWithResizedObject.objects[0].size).toEqual({
            width: 12,
            height: 52
        })
        expect(testSlideWithResizedObject.objects[1].size).toEqual({
            width: 20,
            height: 30
        })
        expect(testSlideWithResizedObject).not.toBe(oldSlide)
    })
    it('resizes object from empty slide', () => {
        const oldSlide = createTestSlide('1-slide')

        const testSlide = resizeObject(oldSlide, '1-text', {width: 12, height: 52})

        expect(testSlide.objects.length).toEqual(0)
        expect(testSlide).not.toBe(oldSlide)
    })
    it('resizes object with size less then zero', () => {
        const oldSlide = createTestSlideWithObject('1-slide')

        const slideWithWrongResizedObject = resizeObject(oldSlide, '1-text', {width: -11, height: 12})

        expect(slideWithWrongResizedObject.objects[0].size).toEqual({
            width: 20,
            height: 30
        })
    })

    it('updates text object style', () => {
        const oldSlide = createTestSlideWithObject('1-slide')

        const slideWitjUpdatedObjectStyle = updateTextObjectStyle(
            oldSlide,
            '1-text',
            {
                fontFamily: 'Times New Roman',
                fontSize: 25,
                fontColor: 'yellow',
                fontStyle: 'bold',
                textLayout: 'right'
            }
        )
        expect(slideWitjUpdatedObjectStyle.objects[0].textStyle).toEqual({
            "fontColor": "yellow",
            "fontFamily": "Times New Roman",
            "fontSize": 25,
            "fontStyle": "bold",
            "textLayout": "right",
        })

        expect(slideWitjUpdatedObjectStyle).not.toBe(oldSlide)
    })
    it('updates image object style', () => {
        const oldSlide = createTestSlideWithObject('1-slide')
        const slideWithImageObject = addImageObject(
            oldSlide,
            '1-image',
            'images/image.png',
            {x: 150, y: 150},
            {width: 120, height: 180},
            {blur: 10, brightness: 20}
        )

        const slideWitjUpdatedObjectStyle = updateImageObjectStyle(
            slideWithImageObject,
            '1-image',
            {blur: 1, brightness: 69}
        )
        expect(slideWitjUpdatedObjectStyle.objects[1].filters).toEqual({
            blur: 1,
            brightness: 69
        })

        expect(slideWitjUpdatedObjectStyle).not.toBe(oldSlide)
    })
    it('updates figure object style', () => {
        const oldSlide = createTestSlideWithObject('1-slide')

        const slideWithFigureObject = addFigureObject(
            oldSlide,
            '1-figure',
            {x: 160, y: 123},
            {width: 122, height: 123},
            {
                shape: 'circle',
                fillColor: 'red',
                strokeColor: 'blue',
                strokeWidth: 5
            }
        )

        expect(slideWithFigureObject.objects[1].figureStyle).toEqual({
                shape: 'circle',
                fillColor: 'red',
                strokeColor: 'blue',
                strokeWidth: 5            
        })

        expect(slideWithFigureObject).not.toBe(oldSlide)
    })


}) 