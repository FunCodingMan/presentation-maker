import { describe, it, expect } from 'vitest'
import { updatePresentationName,
         createPresentation,
         savePresentation,
         loadPresentation,
         addSlide,
         removeSlides,
         generateId,
         moveSlide,
         duplicateSlide
        } from '../functions/presentation.js'
import type { Presentation } from '../types/presentation.js'

function createTestPresentation(name: string, slides: string[]): Presentation {
    //TODO: аменить на метод reduce
    const presentation = createPresentation(generateId(), name)

    return slides.reduce((presentation, slide) => {
        return addSlide(presentation, slide, slide)
    }, presentation)
}

describe('presentation actions', () => {
    it('updates presenation name', () => {
        const presentation = createPresentation('presentation-id', 'my presentation')
        const renamed = updatePresentationName(presentation, 'new presentation')
        
        expect(renamed.name).toEqual('new presentation')
        expect(presentation.name).toEqual('my presentation')
        expect(renamed).not.toBe(presentation)
    })

    it('creates presentation', () => {
        const presentation = createPresentation('presentation', 'new presentation')
        expect(presentation).toEqual({ id: 'presentation', name: 'new presentation', slides: [] })
    })

    it('successfully restores presentation via save and load cycle', () => {
        const oldPresentation = createPresentation('id', 'old presentation')
        const jsonPresentation = savePresentation(oldPresentation)
        const restoredPresentation = loadPresentation(jsonPresentation)
        
        expect(restoredPresentation).toEqual(oldPresentation)
        expect(restoredPresentation).not.toBe(oldPresentation)
    })

    it('adds slide to empty presentation', () => {
        const presentation = createPresentation('id', 'old presentation')
        const newPresentation = addSlide(presentation, '1-slide', '1 slide')
        
        expect(newPresentation.slides).toHaveLength(1)
        expect(newPresentation.slides[0]).toMatchObject({ id: '1-slide', name: '1 slide' })
        expect(presentation.slides).toHaveLength(0)
        expect(newPresentation).not.toBe(presentation)
    })

    it('adds slide to presentation with slides', () => {
        const presentation = createPresentation('id', 'old presentation')
        const presentationWithOneSlide = addSlide(presentation, '1-slide', '1 slide')
        const presentationWithTwoSlides = addSlide(presentationWithOneSlide, '2-slide', '2 slide')
        
        expect(presentationWithOneSlide.slides).toHaveLength(1)
        expect(presentationWithTwoSlides.slides).toHaveLength(2)
        expect(presentationWithTwoSlides.slides[0]).toMatchObject({ id: '1-slide', name: '1 slide' })
        expect(presentationWithTwoSlides.slides[1]).toMatchObject({ id: '2-slide', name: '2 slide' })
        expect(presentationWithOneSlide).not.toBe(presentation)
        expect(presentationWithTwoSlides).not.toBe(presentationWithOneSlide)
    })
    it('inserts slide at specific index', () => {
        const presentation = createTestPresentation('test', ['s-1', 's-2']);
        const res = addSlide(presentation, 's-new', 'New Slide', 1);
        expect(res.slides.map(s => s.id)).toEqual(['s-1', 's-new', 's-2']);
        expect(res).not.toBe(presentation);
    });    

    it('removes one presentation slide', () => {
        const oldPresentation = createPresentation('id', 'old presentation')
        const presentationWithSlide = addSlide(oldPresentation, '1-slide', '1 slide')
        const presentationRemoved = removeSlides(presentationWithSlide, ['1-slide'])
        
        expect(presentationRemoved.slides).toHaveLength(0)
        expect(presentationRemoved).not.toBe(presentationWithSlide)
    })

    it('removes all presentations slides', () => {
        const oldPresentation = createTestPresentation('old presenation', ['1-slide', '2-slide'])
        const presentationWithoutSlides = removeSlides(oldPresentation, ['1-slide', '2-slide'])
        
        expect(presentationWithoutSlides.slides).toHaveLength(0)
        expect(presentationWithoutSlides).not.toBe(oldPresentation)
    })

    it('removes slide from empty presentation', () => {
        const oldPresentation = createPresentation('id', 'old presentation')
        const presentationWithRemovedSlide = removeSlides(oldPresentation, ['1-slide'])
        
        expect(presentationWithRemovedSlide.slides).toHaveLength(0)
        expect(presentationWithRemovedSlide).not.toBe(oldPresentation)
    })

    it('moves presentation slide to begin', () => {
        const presentation = createTestPresentation('old presentation', ['1-slide', '2-slide', '3-slide'])
        const movedPresentation = moveSlide(presentation, '3-slide', 0)
        
        expect(movedPresentation.slides).toHaveLength(3)
        expect(movedPresentation.slides.map(s => s.id)).toEqual(['3-slide', '1-slide', '2-slide'])
        expect(movedPresentation).not.toBe(presentation)
    })

    it('moves presentation slide to end', () => {
        const presentation = createTestPresentation('old presentation', ['1-slide', '2-slide', '3-slide'])
        const movedPresentation = moveSlide(presentation, '1-slide', 2)
        
        expect(movedPresentation.slides).toHaveLength(3)
        expect(movedPresentation.slides.map(s => s.id)).toEqual(['2-slide', '3-slide', '1-slide'])
        expect(movedPresentation).not.toBe(presentation)
    })

    it('moves presentation slide to middle', () => {
        const presentation = createTestPresentation('old presentation', ['1-slide', '2-slide', '3-slide'])
        const movedPresentation = moveSlide(presentation, '1-slide', 1)
        
        expect(movedPresentation.slides).toHaveLength(3)
        expect(movedPresentation.slides.map(s => s.id)).toEqual(['2-slide', '1-slide', '3-slide'])
        expect(movedPresentation).not.toBe(presentation)
    })

    it('moves presentation slide to the same position', () => {
        const presentation = createTestPresentation('old presentation', ['1-slide', '2-slide', '3-slide'])
        const movedPresentation = moveSlide(presentation, '3-slide', 2)
        
        expect(movedPresentation.slides).toHaveLength(3)
        expect(movedPresentation.slides.map(s => s.id)).toEqual(['1-slide', '2-slide', '3-slide'])
        expect(movedPresentation).not.toBe(presentation)
    })

    it('moves presentation slide to the wrong position', () => {
        const presentation = createTestPresentation('old presentation', ['1-slide', '2-slide', '3-slide'])
        const movedPresentation = moveSlide(presentation, '3-slide', 10)
        
        expect(movedPresentation.slides).toHaveLength(3)
        expect(movedPresentation.slides.map(s => s.id)).toEqual(['1-slide', '2-slide', '3-slide'])
        expect(movedPresentation).not.toBe(presentation)
    })

    it('duplicates slide', () => {
        const presentation = createTestPresentation('old presentation', ['1-slide', '2-slide'])
        const duplicated = duplicateSlide(presentation, '1-slide', '1-slide-copy')
        
        expect(duplicated.slides).toHaveLength(3)
        expect(duplicated.slides.map(s => s.id)).toEqual(['1-slide', '1-slide-copy', '2-slide'])
        expect(duplicated.slides[0]).not.toBe(duplicated.slides[1])
        expect(duplicated.slides[0].name).toEqual(duplicated.slides[1].name)
        expect(duplicated).not.toBe(presentation)
    })

    it('duplicates non-existing slide', () => {
        const presentation = createTestPresentation('old presentation', ['1-slide'])
        const duplicated = duplicateSlide(presentation, '2-slide', '2-slide-copy')
        
        expect(duplicated).toEqual(presentation)
    })

    it('duplicate slide in empty presentation', () => {
        const presentation = createPresentation('id', 'old presentation')
        const duplicated = duplicateSlide(presentation, '1-slide', '1-slide-copy')
        
        expect(duplicated).toEqual(presentation)
    })
})