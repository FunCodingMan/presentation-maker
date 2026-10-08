import type { Presentation } from './components/model/types/presentation.js';
import { createPresentation, addSlide, generateId } from './components/model/functions/presentation.js';
import { 
    setSlideBackgroundColor, 
    setSlideBackgroundImage, 
    setSlideBackgroundGradient 
} from './components/model/functions/slide.js';
import { 
    addTextObject, 
    addImageObject, 
    addFigureObject 
} from './components/model/functions/objects.js';

function createTestPresentation(): Presentation {
    let presentation = createPresentation(generateId(), "Test presentation")

    presentation = addSlide(presentation, {
        id: generateId(),
        slideName: "First slide"
    })
    let slide1 = presentation.slides[0]

    slide1 = setSlideBackgroundColor(slide1, "#f0f0f0");
    slide1 = addTextObject(slide1, {
        id: generateId(),
        spans: [
            { text: 'Добро ', style: { fontFamily: 'Arial', fontSize: 48, fontColor: '#333333', fontStyle: [] } },
            { text: 'пожаловать ', style: { fontFamily: 'Arial', fontSize: 48, fontColor: '#d32f2f', fontStyle: ['bold'] } },
            { text: 'в редактор!', style: { fontFamily: 'Georgia', fontSize: 48, fontColor: '#1976d2', fontStyle: ['italic'] } }
        ],
        position: {x: 50, y: 50},
        size: {width: 100, height: 50},
        textLayout: 'center'
    });

    presentation = addSlide(presentation, { id: generateId(), slideName: 'Фон-картинка' })
    let slide2 = presentation.slides[1]

    slide2 = setSlideBackgroundImage(slide2, 'https://img.magnific.com/free-vector/hand-drawn-abstract-shapes-background_23-2149086857.jpg?semt=ais_hybrid&w=740&q=80')

    slide2 = addFigureObject(slide2, {
        id: generateId(),
        position: { x: 175, y: 100 },
        size: { width: 600, height: 400 },
        figureStyle: { shape: 'rectangle', fillColor: 'rgba(255, 255, 255, 0.85)', strokeColor: '#000000', strokeWidth: 2 }
    });

    slide2 = addTextObject(slide2, {
        id: generateId(),
        position: { x: 200, y: 120 },
        size: { width: 560, height: 50 },
        textLayout: 'center',
        spans: [{ text: 'Текст поверх фигуры', style: { fontFamily: 'Arial', fontSize: 24, fontColor: '#000000', fontStyle: ['bold'] } }]
    });

    presentation = addSlide(presentation, { id: generateId(), slideName: 'Объекты' })
    let slide3 = presentation.slides[2];

    slide3 = setSlideBackgroundGradient(slide3, { colors: ['#001251', '#952523'], angle: 90 });

    slide3 = addImageObject(slide3, {
        id: generateId(),
        url: 'https://i.pinimg.com/236x/08/35/d9/0835d99a022ed4d72074a518bd7b451d.jpg',
        position: { x: 50, y: 50 },
        size: { width: 236, height: 236 },
        filters: { blur: 0, brightness: 110 }
    });

    slide3 = addFigureObject(slide3, {
        id: generateId(),
        position: { x: 400, y: 50 },
        size: { width: 150, height: 150 },
        figureStyle: { shape: 'circle', fillColor: '#4caf50', strokeColor: '#2e7d32', strokeWidth: 5 }
    });

    slide3 = addFigureObject(slide3, {
        id: generateId(),
        position: { x: 600, y: 50 },
        size: { width: 150, height: 150 },
        figureStyle: { shape: 'triangle', fillColor: '#ffeb3b', strokeColor: '#fbc02d', strokeWidth: 3 }
    });

    presentation = {
        ...presentation,
        slides: [slide1, slide2, slide3]
    };

    return presentation
}

export {
    createTestPresentation,
}