import type { Presentation } from './model/types/presentation.js'
import type { ViewModel } from './viewmodel/types/view.js'

let currentViewModel: ViewModel | null = null
let past: ViewModel[] = []
let future: ViewModel[] = []

const editorChangeHandlers = new Set<() => void>()

type Modifier<P = any> = (view: ViewModel, params: P) => ViewModel

function notifyChange(): void {
    editorChangeHandlers.forEach(handler => handler())
}

function setInitialState(presentation: Presentation): void {
    currentViewModel = {
        presentation,
        activeSlideId: presentation.slides[0]?.id ?? null,
        selectedObjectIds: [],
        isPreviewMode: false
    }
    past = []
    future = []
}

function getState(): ViewModel | null {
    return currentViewModel
}

function getCanUndo(): boolean {
    return past.length > 0
}

function getCanRedo(): boolean {
    return future.length > 0
}

function dispatch(modifier: Modifier, params: any = null): void {
    if (!currentViewModel) {
        console.error('State is not initialized! Call setInitialState first.')
        return
    }

    past = [...past, currentViewModel]
    future = []

    currentViewModel = modifier(currentViewModel, params)

    notifyChange()
}

function undo(): void {
    if (past.length === 0 || !currentViewModel) return
    future = [currentViewModel, ...future]
    currentViewModel = past[past.length - 1]
    past = past.slice(0, -1)
    notifyChange()
}

function redo(): void {
    if (future.length === 0 || !currentViewModel) return
    past = [...past, currentViewModel]
    currentViewModel = future[0]
    future = future.slice(1)
    notifyChange()
}

function addEditorChangeHandler(handler: () => void): () => void {
    editorChangeHandlers.add(handler)
    return () => {
        editorChangeHandlers.delete(handler)
    }
}

export {
    setInitialState,
    getState,
    dispatch,
    addEditorChangeHandler,
    undo,
    redo,
    getCanUndo,
    getCanRedo,
}