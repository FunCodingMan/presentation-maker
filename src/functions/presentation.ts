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
        active_slide_idx: 0
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

function addSlide(presentation: Presentation, slideName?: string): Presentation 
{
    const slide: Slide = {
        id: generateId(),
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






export {
    updatePresentationName,
    createPresentation,
    savePresentation,
    loadPresentation,
    addSlide,
    removeSlides,
    generateId
}