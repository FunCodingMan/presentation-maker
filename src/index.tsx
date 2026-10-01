import { createRoot } from 'react-dom/client'
import { App } from './components/App.js'
import { addEditorChangeHandler, setInitialState, getState, getActiveSlideId } from './editor.js'
import { createTestPresentation } from './data.js'

const initialData = createTestPresentation()
setInitialState(initialData)

const root = createRoot(document.getElementById('root')!)

function renderApp(): void {
  const presentation = getState();
  const activeSlideId = getActiveSlideId();

  if (presentation) {
    root.render(<App presentation={presentation} activeSlideId={activeSlideId} />)
  }
}

renderApp()

addEditorChangeHandler(() => {
  renderApp()
})