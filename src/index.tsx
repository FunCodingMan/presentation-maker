import { createRoot } from 'react-dom/client'
import { App } from './components/App/App.js'
import { addEditorChangeHandler, setInitialState, getState, getViewModel } from './editor.js'
import { createTestPresentation } from './data.js'

const initialData = createTestPresentation()
setInitialState(initialData)

const root = createRoot(document.getElementById('root')!)

function renderApp(): void {
  const viewModel = getState();

  if (viewModel) {
    root.render(<App presentation={viewModel.presentation} viewModel={viewModel} />)
  }
}

renderApp()

addEditorChangeHandler(() => {
  renderApp()
})