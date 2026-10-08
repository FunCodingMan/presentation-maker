import type { Presentation } from './components/model/types/presentation.js'

//TODO В отдельный обьект
let currentPresentation: Presentation | null = null
let editorChangeHandler: (() => void) | null = null
let isPreviewMode = false
let modifierParams: any = null
let activeSlideId: string | null = null

function setInitialState(presentation: Presentation): void {
    currentPresentation = presentation
}

function getState(): Presentation | null {
  return currentPresentation
}

type Modifier<P = any> = (model: Presentation, params: P) => Presentation

function dispatch(modifier: Modifier, params: any = null): void {
    if(!currentPresentation) {
        console.error('State is not initialized! Call setInitialState first.')
        return
    }

    modifierParams = params;
    
    currentPresentation = modifier(currentPresentation, params);

    if (editorChangeHandler) {
        editorChangeHandler();
    }
}

function addEditorChangeHandler(handler: () => void): void {
  editorChangeHandler = handler;
}

function setPreviewMode(mode: boolean): void {
    isPreviewMode = mode;
    if (editorChangeHandler) {
        editorChangeHandler();
    }
}

function getPreviewMode(): boolean {
    return isPreviewMode;
}

function setActiveSlideId(id: string): void {
    activeSlideId = id;
    if (editorChangeHandler) {
        editorChangeHandler();
    }
}

function getActiveSlideId(): string | null {
    return activeSlideId;
}

export { setInitialState, getState, dispatch, addEditorChangeHandler, setPreviewMode, getPreviewMode, setActiveSlideId, getActiveSlideId }