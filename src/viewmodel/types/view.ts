export type ViewModel = {
    activeSlideId: string | null;
    selectedObjectIds: string[]; // Подготовка к выделению текста и фигур
    isPreviewMode: boolean;
};