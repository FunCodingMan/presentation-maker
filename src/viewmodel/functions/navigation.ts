import type { ViewModel } from '../types/view.js';
import type { Slide } from '../../model/types/slide.js';

function validateSlideIndex(idx: number, maxIdx: number): number {
    if (idx < 0) return 0;
    if (idx > maxIdx) return maxIdx;
    return idx;
}

function setPreviewMode(view: ViewModel, mode: boolean): ViewModel {
    return {
        ...view,
        isPreviewMode: mode
    };
}

function setActiveSlideId(view: ViewModel, id: string): ViewModel {
    return {
        ...view,
        activeSlideId: id,
        selectedObjectIds: []
    };
}

function goToNextSlide(view: ViewModel, slides: Slide[]): ViewModel {
    if (!view.activeSlideId || slides.length === 0) return view;
    
    const currentIdx = slides.findIndex(slide => slide.id === view.activeSlideId);
    const nextIdx = validateSlideIndex(currentIdx + 1, slides.length - 1);
    
    return setActiveSlideId(view, slides[nextIdx].id);
}

function goToPrevSlide(view: ViewModel, slides: Slide[]): ViewModel {
    if (!view.activeSlideId || slides.length === 0) return view;
    
    const currentIdx = slides.findIndex(slide => slide.id === view.activeSlideId);
    const prevIdx = validateSlideIndex(currentIdx - 1, slides.length - 1);
    
    return setActiveSlideId(view, slides[prevIdx].id);
}

export {
    setPreviewMode,
    setActiveSlideId,
    goToNextSlide,
    goToPrevSlide
}
