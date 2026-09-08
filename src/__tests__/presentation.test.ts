import { describe, it, expect } from 'vitest';
import { updatePresentationName,
         createPresentation,
         savePresentation,
         loadPresentation,
         addSlide,
         removeSlides,
         generateId,
         moveSlide,
         setActiveSlide,
         duplicateSlide
        } from '../functions/presentation.js';
import type { Presentation } from '../types/presentation.js';

describe('presentation actions', () => {
    it('updates presenation name', () => {
        const presentation: Presentation = {
            id: 'presentation-id',
            name: 'my presentation',
            slides: [{ id: 'slide-1', name: 'Intro', objects: [] }],
            activeSlideId: 'slide-1'
        }

        const renamed = updatePresentationName(
            presentation,
            'new presentation',
        )

        expect(renamed.name).toEqual('new presentation')
        expect(renamed.id).toEqual(presentation.id)
        expect(renamed.slides).toEqual(presentation.slides)
        expect(renamed.activeSlideId).toEqual(presentation.activeSlideId)
        expect(presentation.name).toEqual('my presentation')
        expect(renamed).not.toBe(presentation);
    })
    it('creates presentation', () => {
        const presentation = createPresentation('presentation', 'new presentation');

        expect(presentation).toEqual({
            id: 'presentation',
            name: 'new presentation',
            slides: [],
            activeSlideId: ''
        })
    })
    it('successfully restores presentation via save and load cycle', () => {
        const oldPresentation = createPresentation(generateId(), 'old presentation')

        const jsonPresentation = savePresentation(oldPresentation)

        const restoredPresentation = loadPresentation(jsonPresentation)

        expect(restoredPresentation).toEqual(oldPresentation)
    })

    it('adds slide to empty presentation', () => {
        const presentation = createPresentation(generateId(), 'old presentation')

        const newPresentation = addSlide(presentation, '1-slide', '1 slide')
        
        expect(newPresentation.slides?.length).toEqual(1);

        expect((newPresentation.slides ?? [])[0]).toEqual({
            id: '1-slide',
            name: '1 slide',
            objects: []
        })

        expect(newPresentation).not.toBe(presentation);
    })

    it('adds slide to presentation with slides', () => {
        const presentation = createPresentation(generateId(), 'old presentation')

        const presentationWithOneSlide = addSlide(presentation, '1-slide', '1 slide')
        const presentationWithTwoSlides = addSlide(presentationWithOneSlide, '2-slide', '2 slide')
        
        expect(presentationWithOneSlide.slides?.length).toEqual(1);
        expect(presentationWithTwoSlides.slides?.length).toEqual(2);

        expect((presentationWithTwoSlides.slides ?? [])[0]).toEqual({
            id: '1-slide',
            name: '1 slide',
            objects: []
        })
        expect((presentationWithTwoSlides.slides ?? [])[1]).toEqual({
            id: '2-slide',
            name: '2 slide',
            objects: []
        })
        expect(presentationWithOneSlide).not.toBe(presentation);
        expect(presentationWithTwoSlides).not.toBe(presentation);
    })

    it('removes one presentation slide', () => {
        const oldPresentation = createPresentation(generateId(), 'old presentation')

        const presentationWithSlide = addSlide(oldPresentation, generateId(), '1 slide')

        const presentationRemoved = removeSlides(presentationWithSlide, presentationWithSlide.slides?.map(slide => slide.id) ?? [])

        expect(presentationRemoved.slides?.length).toEqual(0)
        expect(oldPresentation).toEqual(presentationRemoved)
        expect(oldPresentation).not.toBe(presentationRemoved)
    })
    it('removes all presentations slides', () => {
        const oldPresentation = createPresentation(generateId(), 'old presenation')

        const presentationWithOneSlide = addSlide(oldPresentation, generateId(), '1 slide')

        const presentationWithTwoSlides = addSlide(presentationWithOneSlide, generateId(), '2 slide')

        const slideIds = presentationWithTwoSlides.slides?.map(slide => slide.id) ?? []

        const presentationWithoutSlides = removeSlides(presentationWithTwoSlides, slideIds)

        expect(presentationWithoutSlides).toEqual(oldPresentation)
        
        expect(presentationWithoutSlides).not.toBe(oldPresentation)
    })

    it('removes slide from empty presentation', () => {
        const oldPresentation = createPresentation(generateId(), 'old presentation')

        const presentationWithRemovedSlide = removeSlides(oldPresentation, [generateId()]);

        expect(presentationWithRemovedSlide.slides?.length).toEqual(0);
        expect(presentationWithRemovedSlide).toEqual(oldPresentation);
        expect(presentationWithRemovedSlide).not.toBe(oldPresentation);
    })

    it('moves presentation slide to begin', () => {
        const oldPresentation = createPresentation(generateId(), 'old presentation');

        const presentationWithOneSlide = addSlide(oldPresentation, '1-slide', '1 slide')
        const presentationWithTwoSlides = addSlide(presentationWithOneSlide, '2-slide', '2 slide')
        const presentationWithThreeSlides = addSlide(presentationWithTwoSlides, '3-slide', '3 slide')

        const movedPresentation = moveSlide(presentationWithThreeSlides, '3-slide', 0);

        expect(movedPresentation.slides?.length).toEqual(3);

        expect((movedPresentation.slides ?? [])[0]).toEqual({
            "id": "3-slide",
            "name": "3 slide",
            "objects": [],
        })

        expect((movedPresentation.slides ?? [])[1]).toEqual({
            "id": "1-slide",
            "name": "1 slide",
            "objects": [],
        })

        expect((movedPresentation.slides ?? [])[2]).toEqual({
            "id": "2-slide",
            "name": "2 slide",
            "objects": [],
        })
    })

    it('moves presentation slide to end', () => {
        const oldPresentation = createPresentation(generateId(), 'old presentation');

        const presentationWithOneSlide = addSlide(oldPresentation, '1-slide', '1 slide')
        const presentationWithTwoSlides = addSlide(presentationWithOneSlide, '2-slide', '2 slide')
        const presentationWithThreeSlides = addSlide(presentationWithTwoSlides, '3-slide', '3 slide')

        const movedPresentation = moveSlide(presentationWithThreeSlides, '1-slide', 2);

        expect(movedPresentation.slides?.length).toEqual(3);

        expect((movedPresentation.slides ?? [])[0]).toEqual({
            "id": "2-slide",
            "name": "2 slide",
            "objects": [],
        })

        expect((movedPresentation.slides ?? [])[1]).toEqual({
            "id": "3-slide",
            "name": "3 slide",
            "objects": [],
        })

        expect((movedPresentation.slides ?? [])[2]).toEqual({
            "id": "1-slide",
            "name": "1 slide",
            "objects": [],
        })
    })

    it('moves presentation slide to middle', () => {
        const oldPresentation = createPresentation(generateId(), 'old presentation');

        const presentationWithOneSlide = addSlide(oldPresentation, '1-slide', '1 slide')
        const presentationWithTwoSlides = addSlide(presentationWithOneSlide, '2-slide', '2 slide')
        const presentationWithThreeSlides = addSlide(presentationWithTwoSlides, '3-slide', '3 slide')

        const movedPresentation = moveSlide(presentationWithThreeSlides, '1-slide', 1);

        expect(movedPresentation.slides?.length).toEqual(3);

        expect((movedPresentation.slides ?? [])[0]).toEqual({
            "id": "2-slide",
            "name": "2 slide",
            "objects": [],
        })

        expect((movedPresentation.slides ?? [])[1]).toEqual({
            "id": "1-slide",
            "name": "1 slide",
            "objects": [],
        })

        expect((movedPresentation.slides ?? [])[2]).toEqual({
            "id": "3-slide",
            "name": "3 slide",
            "objects": [],
        })
    })

    it('moves presentation slide to the same position', () => {
        const oldPresentation = createPresentation(generateId(), 'old presentation');

        const presentationWithOneSlide = addSlide(oldPresentation, '1-slide', '1 slide')
        const presentationWithTwoSlides = addSlide(presentationWithOneSlide, '2-slide', '2 slide')
        const presentationWithThreeSlides = addSlide(presentationWithTwoSlides, '3-slide', '3 slide')

        const movedPresentation = moveSlide(presentationWithThreeSlides, '3-slide', 2);

        expect(movedPresentation.slides?.length).toEqual(3);
        
        expect(movedPresentation).toEqual(presentationWithThreeSlides)
        expect(movedPresentation).not.toBe(presentationWithThreeSlides)
    })

    it('moves presentation slide to the wrong position', () => {
        const oldPresentation = createPresentation(generateId(), 'old presentation');

        const presentationWithOneSlide = addSlide(oldPresentation, '1-slide', '1 slide')
        const presentationWithTwoSlides = addSlide(presentationWithOneSlide, '2-slide', '2 slide')
        const presentationWithThreeSlides = addSlide(presentationWithTwoSlides, '3-slide', '3 slide')

        const movedPresentation = moveSlide(presentationWithThreeSlides, '3-slide', 10);

        expect(movedPresentation.slides?.length).toEqual(3);
        
        expect(movedPresentation).toEqual(presentationWithThreeSlides)
        expect(movedPresentation).not.toBe(presentationWithThreeSlides)
    })

    it('sets active slide', () => {
        const oldPresentation = createPresentation(generateId(), 'old presentation');
        const presentationWithOneSlide = addSlide(oldPresentation, '1-slide', '1 slide')

        const presentationWithActiveSlide = setActiveSlide(presentationWithOneSlide, '1-slide')

        expect(presentationWithActiveSlide.activeSlideId).toEqual('1-slide')

        expect(presentationWithActiveSlide).not.toBe(presentationWithOneSlide)
    })

    it('sets active slide on empty presentation', () => {
        const emptyPresentation = createPresentation(generateId(), 'old presentation');

        const presentationWithActiveSlide = setActiveSlide(emptyPresentation, '1-slide')

        expect(presentationWithActiveSlide).toEqual(emptyPresentation)

        expect(presentationWithActiveSlide).not.toBe(emptyPresentation)
    })

    it('sets non-existive active slide', () => {
        const oldPresentation = createPresentation(generateId(), 'old presentation');
        const presentationWithOneSlide = addSlide(oldPresentation, '1-slide', '1 slide')

        const presentationWithActiveSlide = setActiveSlide(presentationWithOneSlide, '1-slide')
        const presentationWithNonExistiveActiveSlide = setActiveSlide(presentationWithActiveSlide, '2-slide')

        expect(presentationWithNonExistiveActiveSlide).toEqual(presentationWithActiveSlide)

        expect(presentationWithNonExistiveActiveSlide).not.toBe(presentationWithActiveSlide)
    })

    it('duplicates slide', () => {
        const oldPresentation = createPresentation(generateId(), 'old presentation');
        const presentationWithOneSlide = addSlide(oldPresentation, '1-slide', '1 slide')
        const presentationWithTwoSlides = addSlide(presentationWithOneSlide, '2-slide', '2 slide')

        const presentationWithDuplicatedSlide = duplicateSlide(presentationWithTwoSlides, '1-slide')

        expect(presentationWithDuplicatedSlide.slides?.length).toEqual(3)

        expect((presentationWithDuplicatedSlide.slides ?? [])[0]).toEqual((presentationWithDuplicatedSlide.slides ?? [])[1])
        expect((presentationWithDuplicatedSlide.slides ?? [])[0]).not.toBe((presentationWithDuplicatedSlide.slides ?? [])[1])

        expect((presentationWithDuplicatedSlide.slides ?? [])[0]).toEqual({
            "id": "1-slide",
            "name": "1 slide",
            "objects": [],
        })

        expect((presentationWithDuplicatedSlide.slides ?? [])[2]).toEqual({
            "id": "2-slide",
            "name": "2 slide",
            "objects": [],
        })        
    })

    it('duplicates non-existing slide', () => {
        const oldPresentation = createPresentation(generateId(), 'old presentation');
        const presentationWithOneSlide = addSlide(oldPresentation, '1-slide', '1 slide')

        const presentationWithDuplicateSlide = duplicateSlide(presentationWithOneSlide, '1-slide')
        const presentationWithNonExistiveDuplicateSlide = duplicateSlide(presentationWithDuplicateSlide, '2-slide')

        expect(presentationWithNonExistiveDuplicateSlide).toEqual(presentationWithDuplicateSlide)

        expect(presentationWithNonExistiveDuplicateSlide).not.toBe(presentationWithDuplicateSlide)
    })

    it('duplicate slide in empty presentation', () => {
        const emptyPresentation = createPresentation(generateId(), 'old presentation');

        const presentationWithDuplicateSlide = duplicateSlide(emptyPresentation, '1-slide')

        expect(presentationWithDuplicateSlide).toEqual(emptyPresentation)

        expect(presentationWithDuplicateSlide).not.toBe(emptyPresentation)
    })

    
});