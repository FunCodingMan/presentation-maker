import type { Presentation } from "../types/presentation.js";
import type { Slide, Background, AddSlideArgs } from "../types/slide.js";

function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomPart}`;
}

function createPresentation(id: string, name: string): Presentation {
    return {
        id: id,
        name,
        slides: []
    }
}

function updatePresentationName(presentation: Presentation, name: string): Presentation {
    return {
        ...presentation,
        name
    }
}

function savePresentation(presentation: Presentation): string {
    return JSON.stringify(presentation);
}

function loadPresentation(json: string): Presentation {
    return JSON.parse(json);
}

//TODO: Вставка по индексу

function addSlide(presentation: Presentation, {id, slideName, insertIndex}: AddSlideArgs): Presentation {
    if (insertIndex !== undefined && (insertIndex < 0 || insertIndex > presentation.slides.length)) {
        return presentation;
    }
    const idx = insertIndex ?? presentation.slides.length;
    const slide: Slide = {
        id: id,
        name: slideName,
        background: {type: 'color', color: 'white'},
        objects: []
    } 

    return {
        ...presentation,
        slides: [
            ...presentation.slides.slice(0, idx),
            slide,
            ...presentation.slides.slice(idx)
        ]
    }
}

//TODO: Убрать ?? []

function removeSlides(presentation: Presentation, slideIds: string[]): Presentation {
    return {
        ...presentation,
        slides: (presentation.slides).filter(slide => !slideIds.includes(slide.id))
    }
}

function moveSlide(presentation: Presentation, slideId: string, newIndex: number): Presentation {
    if (!presentation.slides) {
        return presentation
    }

    const oldIndex = presentation.slides?.findIndex(slide => slide.id === slideId)

    if (oldIndex === -1) return presentation;

    const slide = presentation.slides[oldIndex]

    const withoutSlide = [
        ...presentation.slides.slice(0, oldIndex),
        ...presentation.slides.slice(oldIndex + 1)
    ]

    const updatedSlides = [
        ...withoutSlide.slice(0, newIndex),
        {...slide},
        ...withoutSlide.slice(newIndex)
    ]

    return {
        ...presentation,
        slides: updatedSlides
    }
}
//TODO: Подмать об id обектах, сделать здесь, или при копировании давать
function duplicateSlide(presentation: Presentation, slideId: string, duplicateSlideId: string): Presentation {
    if (!presentation.slides) return presentation;

    const slideIndex = presentation.slides.findIndex(slide => slide.id === slideId)

    if (slideIndex === -1) return presentation;

    const slide = presentation.slides[slideIndex]

    const clonedSlide = structuredClone(slide)

    clonedSlide.id = duplicateSlideId;

    const updatedSlides = [
        ...presentation.slides.slice(0, slideIndex + 1),
        clonedSlide,
        ...presentation.slides.slice(slideIndex + 1)
    ]

    return {
        ...presentation,
        slides: updatedSlides
    }
}  

export {
    updatePresentationName,
    createPresentation,
    savePresentation,
    loadPresentation,
    addSlide,
    removeSlides,
    generateId,
    moveSlide,
    duplicateSlide
}