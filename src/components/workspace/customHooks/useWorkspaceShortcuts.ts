import { useEffect } from 'react'
import { dispatch } from '../../../editor.js'
import { modifyPresentation } from '../../../viewmodel/functions/navigation.js'
import { modifySlide } from '../../../model/functions/presentation.js'
import { removeObjects } from '../../../model/functions/objects.js'

type UseWorkspaceShortcutsProps = {
    activeSlideId: string | null
    getSelectedIds: () => string[]
    onDelete: () => void
}

export function useWorkspaceShortcuts({ activeSlideId, getSelectedIds, onDelete }: UseWorkspaceShortcutsProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeElement = document.activeElement
            if (activeElement?.hasAttribute('contenteditable')) return

            const selectedIds = getSelectedIds()

            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds.length > 0 && activeSlideId) {
                dispatch(modifyPresentation, {
                    operation: modifySlide,
                    args: {
                        slideId: activeSlideId,
                        operation: removeObjects,
                        args: { objectIds: selectedIds },
                    },
                })
                onDelete()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [activeSlideId, getSelectedIds, onDelete])
}