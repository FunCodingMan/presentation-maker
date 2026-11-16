import React, { useCallback, useEffect, useRef, useState } from "react"
import { Size, SlideObject } from "../../../model/types/objects"
import { ObjectSizeUpdate, resizeObjects } from "../../../model/functions/objects"
import { dispatch } from "../../../editor"
import { modifyPresentation } from "../../../viewmodel/functions/navigation"
import { modifySlide } from "../../../model/functions/presentation"

type UseObjectResizeProps = {
    selectedObjectIds: string[],
    activeSlideId: string | null,
    objects: SlideObject[]
}

type InitialSizesMap = Map<string, Size>

function useObjectResize({selectedObjectIds, activeSlideId, objects}: UseObjectResizeProps) {
    const [resizeOffset, setResizeOffset] = useState<{dw: number, dh: number}>({dw: 0, dh: 0})
    const resizeRef = useRef<{
        isResizing: boolean
        startMouseX: number
        startMouseY: number
        currentDw: number
        currentDh: number
        initialSizes: InitialSizesMap
    }>({
        isResizing: false,
        startMouseX: 0,
        startMouseY: 0,
        currentDw: 0,
        currentDh: 0,
        initialSizes: new Map()
    })
    
    const handleResizePointerDown = useCallback((e: React.PointerEvent, objectId: string) => {
        if (e.button !== 0 || !activeSlideId) return

        const idsToMove = selectedObjectIds.includes(objectId) ? selectedObjectIds: [objectId]
        const initialSizes: InitialSizesMap = new Map();

        objects.forEach(obj => {
            if (idsToMove.includes(obj.id)) {
                initialSizes.set(obj.id, obj.size)
            }
        })

        if (initialSizes.size === 0) return

        resizeRef.current = {
            isResizing: true,
            startMouseX: e.clientX,
            startMouseY: e.clientY,
            currentDw: 0,
            currentDh: 0,
            initialSizes: initialSizes
        }
    }, [selectedObjectIds, activeSlideId, objects])

    useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            if (!resizeRef.current.isResizing || !activeSlideId) return

            let dw = e.clientX - resizeRef.current.startMouseX
            let dh = e.clientY - resizeRef.current.startMouseY

            resizeRef.current.initialSizes.forEach((oldSize) => {
                if (oldSize.width + dw < 30) {
                    dw = 30 - oldSize.width;
                }
                if (oldSize.height + dh < 30) {
                    dh = 30 - oldSize.height;
                }
            })

            resizeRef.current.currentDw = dw;
            resizeRef.current.currentDh = dh;
            setResizeOffset({ dw, dh })
        }

        const handlePointerUp = () => {
            const { isResizing, currentDw, currentDh, initialSizes } = resizeRef.current
            if(!isResizing || !activeSlideId) return

            const updates: ObjectSizeUpdate[] = []

            initialSizes.forEach((oldSize, objectId) => {
                updates.push({
                    objectId,
                    size: {width: oldSize.width + currentDw, height: oldSize.height + currentDh},
                })
            })

            dispatch(modifyPresentation, {
                operation: modifySlide,
                args: {
                    slideId: activeSlideId,
                    operation: resizeObjects,
                    args: { updates }
                }
            })

            resizeRef.current.isResizing = false;
            setResizeOffset({dw: 0, dh: 0})
        }

        document.addEventListener('pointermove', handlePointerMove)
        document.addEventListener('pointerup', handlePointerUp)
        return () => {
            document.removeEventListener('pointermove', handlePointerMove)
            document.removeEventListener('pointerup', handlePointerUp)
        }
    }, [activeSlideId])

    return { handleResizePointerDown, resizeOffset }
}

export { useObjectResize }