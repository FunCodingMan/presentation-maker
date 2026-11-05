import { useState, useCallback, useEffect } from 'react'
import { dispatch } from '../../../editor.js'
import { modifyPresentation } from '../../../viewmodel/functions/navigation.js'
import { modifySlide } from '../../../model/functions/presentation.js'
import type { Background } from '../../../model/types/slide.js'
import { 
    setSlideBackgroundColor, 
    setSlideBackgroundImage, 
    setSlideBackgroundGradient, 
    clearSlideBackground 
} from '../../../model/functions/slide.js'

type UseBackgroundPanelProps = {
    activeSlideId: string | null
    background: Background
}

export function useBackgroundPanel({ activeSlideId, background }: UseBackgroundPanelProps) {
    const [gradType, setGradType] = useState<'linear' | 'radial'>(
        background.type === 'gradient' ? (background.gradientType || 'linear') : 'linear'
    )
    const [gradColor1, setGradColor1] = useState(
        background.type === 'gradient' ? background.colors[0] : '#a18cd1'
    )
    const [gradColor2, setGradColor2] = useState(
        background.type === 'gradient' ? background.colors[1] : '#fbc2eb'
    )
    const [gradAngle, setGradAngle] = useState(
        background.type === 'gradient' ? (background.angle ?? 90) : 90
    )

    useEffect(() => {
        if (background.type === 'gradient') {
            setGradType(background.gradientType || 'linear')
            setGradColor1(background.colors[0] || '#a18cd1')
            setGradColor2(background.colors[1] || '#fbc2eb')
            setGradAngle(background.angle ?? 90)
        }
    }, [background])

    const updateBg = (operation: any, args: any) => {
        if (!activeSlideId) return
        dispatch(modifyPresentation, {
            operation: modifySlide,
            args: {
                slideId: activeSlideId,
                operation,
                args
            }
        })
    }

    const handleColorChange = (color: string) => {
        updateBg(setSlideBackgroundColor, color)
    }

    const handleClear = () => {
        updateBg(clearSlideBackground, undefined)
    }

    const handleGradientChange = () => {
        updateBg(setSlideBackgroundGradient, { 
            colors: [gradColor1, gradColor2], 
            angle: gradAngle, 
            gradientType: gradType 
        })
    }

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !file.type.startsWith('image/')) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const src = event.target?.result as string
            if (src) {
                updateBg(setSlideBackgroundImage, src)
            }
        }
        reader.readAsDataURL(file)
        e.target.value = ''
    }, [activeSlideId])

    return {
        handleColorChange,
        handleClear,
        handleImageUpload,
        gradType, setGradType,
        gradColor1, setGradColor1,
        gradColor2, setGradColor2,
        gradAngle, setGradAngle,
        handleGradientChange
    }
}