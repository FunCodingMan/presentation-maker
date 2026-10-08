import type { Presentation } from '../../types/presentation.js';
import { getPreviewMode, setPreviewMode } from '../../editor.js';
import { Toolbar } from '../Toolbar/Toolbar.js';
import { SlideList } from '../SlideList/SlideList.js';
import { Workspace } from '../Workspace/Workspace.js';
import { PreviewOverlay } from '../PreviewOverlay/PreviewOverlay.js';
import { setActiveSlideId } from '../../editor.js';
import styles from './App.module.css';

type AppProps = {
    presentation: Presentation
    activeSlideId: string | null
};

function App({ presentation, activeSlideId }: AppProps) {
    //TODO с маленькой буквы
    const validateIdx = (idx: number) => {
        if (idx < 0) return 0;
        if (idx >= presentation.slides.length) return presentation.slides.length - 1
        return idx
    }

    //TODO директория viewmodule

    const toPrevSlide = () => {
        const idx = presentation.slides.findIndex(slide => slide.id === activeSlideId);
        setActiveSlideId(presentation.slides[validateIdx(idx - 1)].id);
    }

    const toNextSlide = () => {
        const idx = presentation.slides.findIndex(slide => slide.id === activeSlideId);
        setActiveSlideId(activeSlideId = presentation.slides[validateIdx(idx + 1)].id);
    }

    const closePreviewMode = () => {
        document.exitFullscreen()
        setPreviewMode(false)
    }

    if (getPreviewMode()) {
        return (
            <PreviewOverlay
                presentation={presentation}
                onClose={closePreviewMode}
                onNextSlide={toNextSlide}
                onPrevSlide={toPrevSlide}
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