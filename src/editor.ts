import type { Presentation } from './model/types/presentation.js';
import type { ViewModel } from './viewmodel/types/view.js';

let currentViewModel: ViewModel | null = null;
let editorChangeHandler: (() => void) | null = null;

type Modifier<P = any> = (view: ViewModel, params: P) => ViewModel;

function setInitialState(presentation: Presentation): void {
    currentViewModel = {
        presentation: presentation,
        activeSlideId: presentation.slides[0]?.id ?? null,
        selectedObjectIds: [],
        isPreviewMode: false
    };
}

function getState(): ViewModel | null {
    return currentViewModel;
}

function dispatch(modifier: Modifier, params: any = null): void {
    if (!currentViewModel) {
        console.error('State is not initialized! Call setInitialState first.');
        return;
    }

    currentViewModel = modifier(currentViewModel, params);

    if (editorChangeHandler) {
        editorChangeHandler();
    }
}

function addEditorChangeHandler(handler: () => void): void {
    editorChangeHandler = handler;
}

export {
    setInitialState,
    getState,
    dispatch,
    addEditorChangeHandler
};