import type { Presentation } from '../../model/types/presentation.js';
import type { ViewModel } from '../../viewmodel/types/view.js';
import { dispatch } from '../../editor.js';
import { setPreviewMode, goToNextSlide, goToPrevSlide } from '../../viewmodel/functions/navigation.js';
import { Toolbar } from '../toolbar/Toolbar.js';
import { SlideList } from '../slideList/SlideList.js';
import { Workspace } from '../workspace/Workspace.js';
import { PreviewOverlay } from '../previewOverlay/PreviewOverlay.js';
import styles from './App.module.css';

type AppProps = {
    presentation: Presentation
    viewModel: ViewModel
};

function App({ presentation, viewModel }: AppProps) {
    const handleClosePreview = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.error(err));
        }
        dispatch(setPreviewMode, false);
    };
    //TODO с маленькой буквы

    //TODO директория viewmodule


    if (viewModel.isPreviewMode) {
        return (
            <PreviewOverlay
                presentation={presentation}
                activeSlideId={viewModel.activeSlideId}
                onClose={handleClosePreview}
                onNextSlide={() => dispatch(goToNextSlide, presentation.slides)}
                onPrevSlide={() => dispatch(goToPrevSlide, presentation.slides)}
            />
        );
    }

    return (
        <div className={styles.appContainer}>
            <Toolbar presentation={presentation} activeSlideId={viewModel.activeSlideId} />
            
            <div className={styles.mainArea}>
                <SlideList slides={presentation.slides} activeSlideId={viewModel.activeSlideId} />
                <Workspace slides={presentation.slides} activeSlideId={viewModel.activeSlideId} />
            </div>
        </div>
    );
}

export { App };