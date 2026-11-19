import type { Presentation } from './model/types/presentation.js'
import type { ViewModel } from './viewmodel/types/view.js'

type HistoryEntry = {
    presentation: Presentation
    activeSlideId: string | null
}

let currentViewModel: ViewModel | null = null
let past: HistoryEntry[] = []
let future: HistoryEntry[] = []

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

    const nextViewModel = modifier(currentViewModel, params)

    if (nextViewModel.presentation !== currentViewModel.presentation) {
        past = [
            ...past,
            {
                presentation: currentViewModel.presentation,
                activeSlideId: currentViewModel.activeSlideId,
            },
        ]
        future = []
    }

    currentViewModel = nextViewModel
    notifyChange()
}

function undo(): void {
    if (past.length === 0 || !currentViewModel) return
    const prevEntry = past[past.length - 1]

    future = [
        {
            presentation: currentViewModel.presentation,
            activeSlideId: currentViewModel.activeSlideId,
        },
        ...future,
    ]
    past = past.slice(0, -1)

    currentViewModel = {
        ...currentViewModel,
        presentation: prevEntry.presentation,
        activeSlideId: prevEntry.activeSlideId,
        selectedObjectIds: []
    }
    notifyChange()
}

function redo(): void {
    if (future.length === 0 || !currentViewModel) return
    const nextEntry = future[0]

    past = [
        ...past,
        {
            presentation: currentViewModel.presentation,
            activeSlideId: currentViewModel.activeSlideId,
        },
    ]
    future = future.slice(1)

    currentViewModel = {
        ...currentViewModel,
        presentation: nextEntry.presentation,
        activeSlideId: nextEntry.activeSlideId,
        selectedObjectIds: []
    }
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