import { describe, it, expect } from 'vitest';
import { updatePresentationName,
         createPresentation,
         savePresentation,
         loadPresentation,
         addSlide,
         removeSlides,
         generateId
        } from '../functions/presentation.js';
import type { Presentation } from '../types/presentation.js';

describe('presentation actions', () => {
    it('updates presenation name', () => {
        const presentation: Presentation = {
            id: 'presentation-id',
            name: 'my presentation',
            slides: [{ id: 'slide-1', name: 'Intro', objects: [] }],
            active_slide_idx: 0
        }

        const renamed = updatePresentationName(
            presentation,
            'new presentation',
        )

        expect(renamed.name).toEqual('new presentation')
        expect(renamed.id).toEqual(presentation.id)
        expect(renamed.slides).toEqual(presentation.slides)
        expect(renamed.active_slide_idx).toEqual(presentation.active_slide_idx)

        expect(presentation.name).toEqual('my presentation')
    })
    it('creates presentation', () => {
        const presentation = createPresentation(generateId(), 'new presentation');

        expect(presentation).toEqual({
            id: expect.any(String),
            name: 'new presentation',
            slides: [],
            active_slide_idx: 0
        })
    })
    it('successfully restores presentation via save and load cycle', () => {
        const oldPresentation = createPresentation(generateId(), 'old presentation')

        const jsonPresentation = savePresentation(oldPresentation)

        const restoredPresentation = loadPresentation(jsonPresentation)

        expect(restoredPresentation).toEqual(oldPresentation)
    })

    it('adds slide to presentation', () => {
        const presentation = createPresentation(generateId(), 'old presentation')

        const newPresentation = addSlide(presentation, '1 slide')
        
        expect(newPresentation.slides?.length).toEqual(1);

        expect(newPresentation.slides ? newPresentation.slides[0] : {}).toEqual({
            id: expect.any(String),
            name: '1 slide',
            objects: []
        })
    })
    it('removes one presentation slide', () => {
        const oldPresentation = createPresentation(generateId(), 'old presentation')

        const presentationWithSlide = addSlide(oldPresentation, '1 slide')

        const presentationRemoved = removeSlides(presentationWithSlide, presentationWithSlide.slides?.map(slide => slide.id) ?? [])

        expect(presentationRemoved.slides?.length).toEqual(0);
        expect(oldPresentation).toEqual(presentationRemoved);
    })
    it('removes all presentations slides', () => {
        const oldPresentation = createPresentation(generateId(), 'old presenation')

        const presentationWithOneSlide = addSlide(oldPresentation, '1 slide')

        const presentationWithTwoSlides = addSlide(presentationWithOneSlide, '2 slide')

        const slideIds = presentationWithTwoSlides.slides?.map(slide => slide.id) ?? []

        const presentationWithoutSlides = removeSlides(presentationWithTwoSlides, slideIds)

        expect(presentationWithoutSlides).toEqual(oldPresentation)

    })

    it('removes slide from empty presentation', () => {
        const oldPresentation = createPresentation(generateId(), 'old presentation')

        const presentationWithRemovedSlide = removeSlides(oldPresentation, [generateId()]);

        expect(presentationWithRemovedSlide.slides?.length).toEqual(0);
        expect(presentationWithRemovedSlide).toEqual(oldPresentation);
    })

    

    
});