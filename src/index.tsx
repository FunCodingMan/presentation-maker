import { createRoot } from 'react-dom/client'
import { App } from './components/app/App.js'
import { addEditorChangeHandler, setInitialState, getState } from './editor.js'
import { createTestPresentation } from './data.js'

const initialData = createTestPresentation()
setInitialState(initialData)

const root = createRoot(document.getElementById('root')!)

function renderApp(): void {
  const viewModel = getState()

  if (viewModel) {
    root.render(<App presentation={viewModel.presentation} viewModel={viewModel} />)
  }
}

renderApp()

addEditorChangeHandler(() => {
  renderApp()
})