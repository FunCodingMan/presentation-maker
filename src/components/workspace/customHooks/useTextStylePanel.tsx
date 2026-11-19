import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { TextStyle, SlideObject } from '../../../model/types/objects.js'
import { dispatch } from '../../../editor.js'
import { modifyPresentation } from '../../../viewmodel/functions/navigation.js'
import { modifySlide } from '../../../model/functions/presentation.js'
import { updateTextObjectStyle } from '../../../model/functions/objects.js'

const DEFAULT_STYLE: TextStyle = {
    fontFamily: 'Arial',
    fontSize: 24,
    fontColor: '#000000',
    fontStyle: [],
}

const MIN_FONT_SIZE = 8
const MAX_FONT_SIZE = 200

type FontStyle = TextStyle['fontStyle'][number]

type UseTextStylePanelProps = {
    selectedObjectIds: string[]
    activeSlideId: string | null
    objects: SlideObject[]
}

function setPreviewColor(objectId: string, color: string): void {
    const el = document.getElementById(`workspace-object-${objectId}`)
    el?.style.setProperty('--preview-font-color', color)
}

function clearPreviewColor(objectId: string): void {
    const el = document.getElementById(`workspace-object-${objectId}`)
    el?.style.removeProperty('--preview-font-color')
}

function useTextStylePanel({ selectedObjectIds, activeSlideId, objects }: UseTextStylePanelProps) {
    const colorInputRef = useRef<HTMLInputElement>(null)

    const foundObj = activeSlideId && selectedObjectIds.length === 1
        ? objects.find(o => o.id === selectedObjectIds[0])
        : null
    const selectedTextObject = foundObj?.type === 'text' ? foundObj : null

    const objectId = selectedTextObject?.id ?? null
    const style = selectedTextObject?.spans[0]?.style ?? DEFAULT_STYLE

    const [fontSizeInput, setFontSizeInput] = useState(String(style.fontSize))
    const [fontColor, setFontColor] = useState(style.fontColor)

    useEffect(() => {
        setFontSizeInput(String(style.fontSize))
        setFontColor(style.fontColor)

        return () => {
            if (objectId) clearPreviewColor(objectId)
        }
    }, [objectId, style.fontSize, style.fontColor])

    const applyStyle = (updates: Partial<TextStyle>) => {
        if (!objectId || !activeSlideId) return
        dispatch(modifyPresentation, {
            operation: modifySlide,
            args: {
                slideId: activeSlideId,
                operation: updateTextObjectStyle,
                args: { objectId, newTextStyle: { ...style, ...updates } },
            },
        })
    }

    useEffect(() => {
        const input = colorInputRef.current
        if (!input || !objectId || !activeSlideId) return

        const handleNativeColorChange = (e: Event) => {
            if (!(e.target instanceof HTMLInputElement)) return
            const finalColor = e.target.value

            clearPreviewColor(objectId)
            if (finalColor !== style.fontColor) {
                applyStyle({ fontColor: finalColor })
            }
        }

        input.addEventListener('change', handleNativeColorChange)
        return () => input.removeEventListener('change', handleNativeColorChange)
    }, [objectId, activeSlideId, style])

    const commitFontSize = (value: number) => {
        const clamped = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, value))
        setFontSizeInput(String(clamped))
        if (clamped !== style.fontSize) {
            applyStyle({ fontSize: clamped })
        }
    }

    const handleFontSizeInputChange = (raw: string) => {
        setFontSizeInput(raw)
    }

    const handleFontSizeBlur = () => {
        const parsed = Number(fontSizeInput)
        if (fontSizeInput.trim() === '' || Number.isNaN(parsed)) {
            setFontSizeInput(String(style.fontSize))
            return
        }
        commitFontSize(parsed)
    }

    const handleFontSizeKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur()
        }
    }

    const handleFontColorChange = (color: string) => {
        setFontColor(color)
        if (objectId) setPreviewColor(objectId, color)
    }

    const handleFontFamilyChange = (fontFamily: string) => applyStyle({ fontFamily })
    const handleFontSizeStep = (delta: number) => commitFontSize(style.fontSize + delta)
    const handleFontStyleToggle = (item: FontStyle) => {
        const fontStyle = style.fontStyle.includes(item)
            ? style.fontStyle.filter(s => s !== item)
            : [...style.fontStyle, item]
        applyStyle({ fontStyle })
    }

    return {
        isVisible: selectedTextObject !== null,
        colorInputRef,
        fontFamily: style.fontFamily,
        fontSizeInput,
        fontColor,
        fontStyle: style.fontStyle,
        handleFontFamilyChange,
        handleFontSizeInputChange,
        handleFontSizeBlur,
        handleFontSizeKeyDown,
        handleFontSizeStep,
        handleFontColorChange,
        handleFontStyleToggle,
    }
}

export { useTextStylePanel, MIN_FONT_SIZE, MAX_FONT_SIZE }
export type { FontStyle }