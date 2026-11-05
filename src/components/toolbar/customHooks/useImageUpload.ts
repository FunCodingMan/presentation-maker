import { useCallback, useRef } from 'react'
import { dispatch } from '../../../editor.js'
import { modifyPresentation } from '../../../viewmodel/functions/navigation.js'
import { modifySlide, generateId } from '../../../model/functions/presentation.js'
import { addImageObject } from '../../../model/functions/objects.js'

type UseImageUploadProps = {
    activeSlideId: string | null
}

function useImageUpload({ activeSlideId }: UseImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const chooseFile = useCallback(() => {
        fileInputRef.current?.click()
    }, [])

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !activeSlideId) return

        if (!file.type.startsWith('image/')) {
            alert('Пожалуйста, выберите файл изображения.')
            return
        }

        const reader = new FileReader()

        reader.onload = (event) => {
            const url = event.target?.result
            if (!url) return

            dispatch(modifyPresentation, {
                operation: modifySlide,
                args: {
                    slideId: activeSlideId,
                    operation: addImageObject,
                    args: {
                        id: generateId(),
                        url,
                        position: { x: 200, y: 150 },
                        size: { width: 300, height: 200 },
                        filters: {},
                    },
                },
            })
        }

        reader.readAsDataURL(file)
        e.target.value = ''
    }, [activeSlideId])

    return {
        fileInputRef,
        handleFileChange,
        chooseFile,
    }
}

export { useImageUpload }