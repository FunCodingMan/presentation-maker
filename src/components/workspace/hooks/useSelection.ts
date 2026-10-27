import { useState, useEffect } from 'react';

export function useSelection(activeSlideId: string | null) {
    const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([]);

    useEffect(() => {
        setSelectedObjectIds([]);
    }, [activeSlideId]);

    const handleSelect = (objectId: string, isShiftPressed: boolean) => {
        if (isShiftPressed) {
            setSelectedObjectIds(prev => 
                prev.includes(objectId)
                    ? prev.filter(id => id !== objectId)
                    : [...prev, objectId]
            );
        } else {
            setSelectedObjectIds([objectId]);
        }
    };

    const clearSelection = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setSelectedObjectIds([]);
    };

    return {
        selectedObjectIds,
        handleSelect,
        clearSelection
    };
}