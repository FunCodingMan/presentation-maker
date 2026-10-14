import type { Presentation } from './model/types/presentation.js'
import type { ViewModel } from './viewmodel/types/view.js'


let currentPresentation: Presentation | null = null
let editorChangeHandler: (() => void) | null = null
let modifierParams: any = null
//TODO В отдельный обьект
let currentViewModel: ViewModel = {
    activeSlideId: null,
    selectedObjectIds: [],
    isPreviewMode: false
};

function setInitialState(presentation: Presentation): void {
    currentPresentation = presentation
    currentViewModel = {
        activeSlideId: presentation.slides[0]?.id ?? null,
        selectedObjectIds: [],
        isPreviewMode: false
    };
}

function getState(): Presentation | null {
  return currentPresentation
}

function getViewModel(): ViewModel
{
    return currentViewModel
}

type Modifier<P = any> = (model: Presentation, params: P) => Presentation
type ViewModifier<P = any> = (view: ViewModel, params: P) => ViewModel

function dispatch(modifier: Modifier, params: any = null): void {
    if(!currentPresentation) {
        console.error('State is not initialized! Call setInitialState first.')
        return
    }

    modifierParams = params;
    
    currentPresentation = modifier(currentPresentation, params);

    if (editorChangeHandler) {
        editorChangeHandler()
    }
}

function dispatchView(modifier: ViewModifier, params: any = null): void {
    currentViewModel = modifier(currentViewModel, params)
    if (editorChangeHandler) {
        editorChangeHandler()
    }
}

function addEditorChangeHandler(handler: () => void): void {
  editorChangeHandler = handler
}

export {
    setInitialState,
    getState,
    getViewModel,
    dispatch,
    dispatchView,
    addEditorChangeHandler
}