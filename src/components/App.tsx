import type { Presentation } from '../types/presentation.js';
import { getPreviewMode, setPreviewMode } from '../editor.js';
import { Toolbar } from './Toolbar.js';
import { SlideList } from './SlideList.js';
import { Workspace } from './Workspace.js';
import { PreviewOverlay } from './PreviewOverlay.js';
import styles from './App.module.css';

type AppProps = {
    presentation: Presentation
    activeSlideId: string | null;
};

function App({ presentation, activeSlideId }: AppProps) {
    if (getPreviewMode()) {
        return (
            <PreviewOverlay
                presentation={presentation}
                onClose={() => setPreviewMode(false)}
            />
        );
    }

    return (
        <div className={styles.appContainer}>
            <Toolbar presentation={presentation} />
            
            <div className={styles.mainArea}>
                <SlideList presentation={presentation} activeSlideId={activeSlideId} />
                <Workspace presentation={presentation} activeSlideId={activeSlideId} />
            </div>
        </div>
    );
}

export { App };