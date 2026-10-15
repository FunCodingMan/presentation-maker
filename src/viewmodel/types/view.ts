import type { Presentation } from '../../model/types/presentation.js';

export type ViewModel = {
    presentation: Presentation;
    activeSlideId: string | null;
    selectedObjectIds: string[];
    isPreviewMode: boolean;
};