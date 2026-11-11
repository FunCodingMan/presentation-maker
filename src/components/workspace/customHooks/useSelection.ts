import { useState, useEffect } from 'react'
import { SlideObject } from '../../../model/types/objects'

type UseSelectionProps = {
    activeSlideId: string | null,
}

function useSelection({ activeSlideId }: UseSelectionProps) {
    const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([])

    useEffect(() => {
        setSelectedObjectIds([])
    }, [activeSlideId])
     
    const handleSelect = (objectId: string, isShiftPressed: boolean, ) => {
        if (isShiftPressed) {
            setSelectedObjectIds(prev =>
                prev.includes(objectId)
                    ? prev.filter(id => id !== objectId)
                    : [...prev, objectId]
            )
        } else {
            setSelectedObjectIds([objectId])
        }
    }

    const clearSelection = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }
        setSelectedObjectIds([])
    }

    return { selectedObjectIds, handleSelect, clearSelection }
}

export {
    useSelection
}