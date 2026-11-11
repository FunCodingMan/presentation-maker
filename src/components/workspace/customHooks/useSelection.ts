import { useState, useEffect } from 'react'
import { SlideObject } from '../../../model/types/objects'

type UseSelectionProps = {
    activeSlideId: string | null,
    objects: SlideObject[]
}

function useSelection({activeSlideId, objects}: UseSelectionProps) {
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
            const selectedObject = objects.filter(obj => obj.id == objectId)[0]
            const otherObjects = objects.filter(obj => obj.id != objectId)

            objects = [
                selectedObject,
                ...otherObjects,
            ]

            console.log(objects)
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