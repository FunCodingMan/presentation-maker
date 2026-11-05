import { useEffect, useState } from 'react'
import type { TextObject, TextStyle, SlideObject } from '../../../model/types/objects.js'
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

function useTextStylePanel({ selectedObjectIds, activeSlideId, objects }: UseTextStylePanelProps) {
    const selectedTextObject: TextObject | null = (() => {
        if (!activeSlideId || selectedObjectIds.length !== 1) return null
        const obj = objects.find(o => o.id === selectedObjectIds[0])
        if (!obj || obj.type !== 'text') return null
        return obj
    })()

    const selectedObjectId = selectedTextObject?.id ?? null
    const baseStyle = selectedTextObject?.spans[0]?.style ?? DEFAULT_STYLE

    const [fontFamily, setFontFamily] = useState(baseStyle.fontFamily)
    const [fontSize, setFontSize] = useState<number>(baseStyle.fontSize)
    const [fontSizeInput, setFontSizeInput] = useState<string>(String(baseStyle.fontSize))
    const [fontColor, setFontColor] = useState(baseStyle.fontColor)
    const [fontStyle, setFontStyle] = useState<FontStyle[]>(baseStyle.fontStyle)

    useEffect(() => {
        if (!selectedTextObject) return
        const style = selectedTextObject.spans[0]?.style ?? DEFAULT_STYLE
        setFontFamily(style.fontFamily)
        setFontSize(style.fontSize)
        setFontSizeInput(String(style.fontSize))
        setFontColor(style.fontColor)
        setFontStyle(style.fontStyle)
    }, [selectedObjectId])

    const applyStyle = (updates: Partial<TextStyle>) => {
        if (!selectedTextObject || !activeSlideId) return
        const newStyle: TextStyle = {
            ...baseStyle,
            fontFamily,
            fontSize,
            fontColor,
            fontStyle,
            ...updates,
        }
        dispatch(modifyPresentation, {
            operation: modifySlide,
            args: {
                slideId: activeSlideId,
                operation: updateTextObjectStyle,
                args: { objectId: selectedTextObject.id, newTextStyle: newStyle },
            },
        })
    }

    const handleFontFamilyChange = (value: string) => {
        setFontFamily(value)
        applyStyle({ fontFamily: value })
    }

    const commitFontSize = (value: number) => {
        const clamped = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, value))
        setFontSize(clamped)
        setFontSizeInput(String(clamped))
        applyStyle({ fontSize: clamped })
    }

    const handleFontSizeInputChange = (raw: string) => {
        setFontSizeInput(raw)
        const parsed = Number(raw)
        if (!isNaN(parsed) && parsed >= MIN_FONT_SIZE && parsed <= MAX_FONT_SIZE) {
            setFontSize(parsed)
            applyStyle({ fontSize: parsed })
        }
    }

    const handleFontSizeBlur = () => {
        const parsed = Number(fontSizeInput)
        if (isNaN(parsed)) {
            setFontSizeInput(String(fontSize))
            return
        }
        commitFontSize(parsed)
    }

    const handleFontSizeStep = (delta: number) => {
        commitFontSize(fontSize + delta)
    }

    const handleFontColorChange = (value: string) => {
        setFontColor(value)
        applyStyle({ fontColor: value })
    }

    const handleFontStyleToggle = (styleToToggle: FontStyle) => {
        const newFontStyle = fontStyle.includes(styleToToggle)
            ? fontStyle.filter(s => s !== styleToToggle)
            : [...fontStyle, styleToToggle]
        
        setFontStyle(newFontStyle)
        applyStyle({ fontStyle: newFontStyle })
    }

    return {
        isVisible: selectedTextObject !== null,
        fontFamily,
        fontSizeInput,
        fontColor,
        fontStyle,
        handleFontFamilyChange,
        handleFontSizeInputChange,
        handleFontSizeBlur,
        handleFontSizeStep,
        handleFontColorChange,
        handleFontStyleToggle,
    }
}

export { useTextStylePanel, MIN_FONT_SIZE, MAX_FONT_SIZE }
export type { FontStyle }