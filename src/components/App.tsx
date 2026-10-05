import type { Presentation } from '../types/presentation.js';
import { getPreviewMode, setPreviewMode } from '../editor.js';
import { Toolbar } from './Toolbar.js';
import { SlideList } from './SlideList.js';
import { Workspace } from './Workspace.js';
import { PreviewOverlay } from './PreviewOverlay.js';
import { setActiveSlideId } from '../editor.js';
import styles from './App.module.css';

type AppProps = {
    presentation: Presentation
    activeSlideId: string | null
};

function App({ presentation, activeSlideId }: AppProps) {
   
    const ValidateIdx = (idx: number) => {
        if (idx < 0) return 0;
        if (idx >= presentation.slides.length) return presentation.slides.length - 1
        return idx
    }

    const ToPrevSlide = () => {
        const idx = presentation.slides.findIndex(slide => slide.id === activeSlideId);
        setActiveSlideId(presentation.slides[ValidateIdx(idx - 1)].id);
    }

    const ToNextSlide = () => {
        const idx = presentation.slides.findIndex(slide => slide.id === activeSlideId);
        setActiveSlideId(activeSlideId = presentation.slides[ValidateIdx(idx + 1)].id);
    }
    if (getPreviewMode()) {
        return (
            <PreviewOverlay
                presentation={presentation}
                onClose={() => setPreviewMode(false)}
                onNextSlide={ToNextSlide}
                onPrevSlide={ToPrevSlide}
                activeSlideId={activeSlideId}
            />
        );
    }

    return (
        <div className={styles.appContainer}>
            <Toolbar presentation={presentation} activeSlideId={activeSlideId} />
            
            <div className={styles.mainArea}>
                <SlideList presentation={presentation} activeSlideId={activeSlideId} />
                <Workspace presentation={presentation} activeSlideId={activeSlideId} />
            </div>
        </div>
    );
}

export { App };