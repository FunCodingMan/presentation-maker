import { useEffect } from 'react'
import { undo, redo, getState } from '../../../editor.js'

function useHistoryShortcuts(): void {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (getState()?.isPreviewMode) return
            const activeElement = document.activeElement
            const isTyping =
                activeElement instanceof HTMLElement &&
                (
                    activeElement.isContentEditable ||
                    activeElement.tagName === 'INPUT' ||
                    activeElement.tagName === 'TEXTAREA' ||
                    activeElement.tagName === 'SELECT'
                )
            if (isTyping) return

            const isMod = e.ctrlKey
            if (!isMod) return

            const key = e.key.toLowerCase()
            if (key === 'z') {
                e.preventDefault()
                undo()
            } else if (key === 'y') {
                e.preventDefault()
                redo()
            }
        }

        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [])
}

export { useHistoryShortcuts }