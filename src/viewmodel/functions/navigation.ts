import type { ViewModel } from '../types/view.js';
import type { Presentation } from '../../model/types/presentation.js';
import { removeSlides } from '../../model/functions/presentation.js';

type PresentationOperation<T = any> = {
    operation: (presentation: Presentation, args: T) => Presentation;
    args: T;
};

export function modifyPresentation(view: ViewModel, { operation, args }: PresentationOperation): ViewModel {
    return {
        ...view,
        presentation: operation(view.presentation, args)
    };
}

function validateSlideIndex(idx: number, maxIdx: number): number {
    if (idx < 0) return 0;
    if (idx > maxIdx) return maxIdx;
    return idx;
}

export function setPreviewMode(view: ViewModel, mode: boolean): ViewModel {
    return {
        ...view,
        isPreviewMode: mode
    };
}

export function setActiveSlideId(view: ViewModel, id: string): ViewModel {
    return {
        ...view,
        activeSlideId: id,
        selectedObjectIds: []
    };
}

export function goToNextSlide(view: ViewModel): ViewModel {
    const slides = view.presentation.slides;
    if (!view.activeSlideId || slides.length === 0) return view;
    
    const currentIdx = slides.findIndex(slide => slide.id === view.activeSlideId);
    const nextIdx = validateSlideIndex(currentIdx + 1, slides.length - 1);
    
    return setActiveSlideId(view, slides[nextIdx].id);
}

export function goToPrevSlide(view: ViewModel): ViewModel {
    const slides = view.presentation.slides;
    if (!view.activeSlideId || slides.length === 0) return view;
    
    const currentIdx = slides.findIndex(slide => slide.id === view.activeSlideId);
    const prevIdx = validateSlideIndex(currentIdx - 1, slides.length - 1);
    
    return setActiveSlideId(view, slides[prevIdx].id);
}

export function removeActiveSlide(view: ViewModel): ViewModel {
    if (!view.activeSlideId || view.presentation.slides.length <= 1) {
        return view; 
    }
    
    const currentIndex = view.presentation.slides.findIndex(s => s.id === view.activeSlideId);
    const updatedPresentation = removeSlides(view.presentation, [view.activeSlideId]);

    const newIndex = Math.min(currentIndex, updatedPresentation.slides.length - 1);
    const newActiveSlideId = updatedPresentation.slides[newIndex].id;

    return {
        ...view,
        presentation: updatedPresentation,
        activeSlideId: newActiveSlideId,
        selectedObjectIds: []
    };
}
