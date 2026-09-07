import type { Presentation } from "../types/presentation.js";
import type { Slide } from "../types/slide.js";

function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomPart}`;
}

function createPresentation(id: string, name: string): Presentation
{
    return {
        id: id,
        name,
        slides: [],
        activeSlideId: ''
    }
}

function updatePresentationName(presentation: Presentation, name: string): Presentation {
    return {
        ...presentation,
        name
    }
}

function savePresentation(presentation: Presentation): string
{
    return JSON.stringify(presentation);
}

function loadPresentation(json: string): Presentation
{
    return JSON.parse(json);
}

function addSlide(presentation: Presentation, slideId: string, slideName?: string): Presentation 
{
    const slide: Slide = {
        id: slideId,
        name: slideName,
        objects: []
    } 

    return {
        ...presentation,
        slides: [...(presentation.slides ?? []), slide]
    }
}

function removeSlides(presentation: Presentation, slideIds: string[]): Presentation
{
    return {
        ...presentation,
        slides: (presentation.slides ?? []).filter(slide => !slideIds.includes(slide.id))
    }
}

function moveSlide(presentation: Presentation, slideId: string, newIndex: number): Presentation
{
    if (!presentation.slides) return presentation;

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

function setActiveSlide(presentation: Presentation, slideId: string): Presentation
{
    if (!presentation.slides?.map(slide => slide.id).includes(slideId)) return {...presentation}

    return {
        ...presentation,
        activeSlideId: slideId
    }
}
function duplicateSlide(presentation: Presentation, slideId: string): Presentation
{
    if (!presentation.slides) return presentation;

    const slideIndex = presentation.slides.findIndex(slide => slide.id === slideId)

    if (slideIndex === -1) return {...presentation};

    const slide = presentation.slides[slideIndex]

    const updatedSlides = [
        ...presentation.slides.slice(0, slideIndex),
        {...slide},
        ...presentation.slides.slice(slideIndex)
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
    setActiveSlide,
    duplicateSlide
}