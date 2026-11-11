import { useEffect } from 'react'
import { dispatch } from '../../../editor.js'
import { modifyPresentation } from '../../../viewmodel/functions/navigation.js'
import { modifySlide } from '../../../model/functions/presentation.js'
import { removeObjects, bringToFront, sendToBack } from '../../../model/functions/objects.js'

type UseWorkspaceShortcutsProps = {
    selectedObjectIds: string[]
    activeSlideId: string | null
    onDelete: () => void
}

export function useWorkspaceShortcuts({ selectedObjectIds, activeSlideId, onDelete }: UseWorkspaceShortcutsProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeElement = document.activeElement
            const isTyping = activeElement?.hasAttribute('contenteditable')
            if (isTyping) return

            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedObjectIds.length > 0 && activeSlideId) {
                dispatch(modifyPresentation, {
                    operation: modifySlide,
                    args: {
                        slideId: activeSlideId,
                        operation: removeObjects,
                        args: { objectIds: selectedObjectIds },
                    },
                })
                onDelete()
            }

            if ((e.key === ']' || e.key === 'ArrowUp') && e.ctrlKey && selectedObjectIds.length > 0 && activeSlideId) {
                e.preventDefault()
                dispatch(modifyPresentation, {
                    operation: modifySlide,
                    args: {
                        slideId: activeSlideId,
                        operation: bringToFront,
                        args: { objectId: selectedObjectIds[0] },
                    },
                })
            }

            if ((e.key === '[' || e.key === 'ArrowDown') && e.ctrlKey && selectedObjectIds.length > 0 && activeSlideId) {
                e.preventDefault()
                dispatch(modifyPresentation, {
                    operation: modifySlide,
                    args: {
                        slideId: activeSlideId,
                        operation: sendToBack,
                        args: { objectId: selectedObjectIds[0] },
                    },
                })
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedObjectIds, activeSlideId, onDelete])
}