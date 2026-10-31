import React, { useCallback, useEffect, useRef, useState } from "react"
import { Size, SlideObject } from "../../../model/types/objects"
import { moveObjects, ObjectSizeUpdate } from "../../../model/functions/objects"
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
    
    const handleMouseDown = useCallback((e: React.MouseEvent, objectId: string) => {
        e.preventDefault()

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
        const handleMouseMove = (e: MouseEvent) => {
            if (!resizeRef.current.isResizing || !activeSlideId) return

            const dw = e.clientX - resizeRef.current.startMouseX
            const dh = e.clientY - resizeRef.current.startMouseY

            resizeRef.current.currentDw = dw;
            resizeRef.current.currentDh = dh;
            setResizeOffset({ dw, dh })
        }

        const handleMouseUp = () => {
            const { isResizing, currentDw, currentDh, initialSizes } = resizeRef.current
            if(!resizeRef.current.isResizing || !activeSlideId) return

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
                    operation: moveObjects,
                    args: { updates }
                }
            })

            resizeRef.current.isResizing = false;
            setResizeOffset({dw: 0, dh: 0})
        }


        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [activeSlideId])

    return { handleMouseDown, resizeOffset }
}

export {
    useObjectResize
}