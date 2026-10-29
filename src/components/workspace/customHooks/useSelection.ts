import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

export type SelectionReturn = {
    isSelected: (objectId: string) => boolean
    select: (objectId: string, isShiftPressed: boolean) => void
    clearSelection: () => void
    getSelectedIds: () => string[]
}

export function useSelection(activeSlideId: string | null): SelectionReturn {
    const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([])
    const idsRef = useRef<string[]>([])

    useEffect(() => {
        idsRef.current = []
        setSelectedObjectIds([])
    }, [activeSlideId])

    const select = useCallback((objectId: string, isShiftPressed: boolean) => {
        setSelectedObjectIds(prev => {
            const next = isShiftPressed
                ? (prev.includes(objectId)
                    ? prev.filter(id => id !== objectId)
                    : [...prev, objectId])
                : [objectId]
            idsRef.current = next
            return next
        })
    }, [])

    const clearSelection = useCallback(() => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }
        idsRef.current = []
        setSelectedObjectIds([])
    }, [])

    const getSelectedIds = useCallback(() => idsRef.current, [])

    const isSelected = useCallback(
        (objectId: string) => selectedObjectIds.includes(objectId),
        [selectedObjectIds]
    )

    return useMemo(() => ({
        isSelected,
        select,
        clearSelection,
        getSelectedIds,
    }), [isSelected, select, clearSelection, getSelectedIds])
}