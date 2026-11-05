import { useEffect } from 'react'
import { undo, redo, getState } from '../../../editor.js'

function useHistoryShortcuts(): void {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (getState()?.isPreviewMode) return
            const active = document.activeElement as HTMLElement | null
            const isTyping =
                active?.hasAttribute('contenteditable') ||
                active?.tagName === 'INPUT' ||
                active?.tagName === 'TEXTAREA'

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