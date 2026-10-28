import { useEffect, useRef, useCallback } from 'react'
import { dispatch } from '../../../editor.js'
import { modifyPresentation } from '../../../viewmodel/functions/navigation.js'
import { modifySlide } from '../../../model/functions/presentation.js'
import { moveObjects } from '../../../model/functions/objects.js'
import { SlideObject } from '../../../model/types/objects.js'

type Point = { x: number, y: number }

type ObjectPositionUpdate = {
    objectId: string
    position: Point
}

type UseObjectDragProps = {
    selectedObjectIds: string[]
    activeSlideId: string | null
    objects: SlideObject[]
}

export function useObjectDrag({ selectedObjectIds, activeSlideId, objects }: UseObjectDragProps) {
    const dragRef = useRef<{
        isDragging: boolean
        startX: number
        startY: number
        initialPositions: Map<string, Point>
    }>({
        isDragging: false,
        startX: 0,
        startY: 0,
        initialPositions: new Map(),
    })

    const handleMouseDown = useCallback((e: React.MouseEvent, objectId: string) => {
        if (e.button !== 0 || !activeSlideId) {
            return
        }

        e.stopPropagation()

        const startX = e.clientX
        const startY = e.clientY

        const idsToMove = selectedObjectIds.includes(objectId) 
            ? selectedObjectIds 
            : [...selectedObjectIds, objectId]

        const initialPositions = new Map<string, Point>()
        objects.forEach(obj => {
            if (idsToMove.includes(obj.id)) {
                initialPositions.set(obj.id, { x: obj.position.x, y: obj.position.y })
            }
        })

        dragRef.current = {
            isDragging: true,
            startX,
            startY,
            initialPositions,
        }
    }, [selectedObjectIds, activeSlideId, objects])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragRef.current.isDragging || !activeSlideId) return

            const dx = e.clientX - dragRef.current.startX
            const dy = e.clientY - dragRef.current.startY

            if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return

            const updates: ObjectPositionUpdate[] = []

            dragRef.current.initialPositions.forEach((pos, objectId) => {
                updates.push({
                    objectId,
                    position: {
                        x: pos.x + dx,
                        y: pos.y + dy,
                    }
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
        }

        const handleMouseUp = () => {
            if (dragRef.current.isDragging) {
                dragRef.current.isDragging = false
            }
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [activeSlideId])

    return { handleMouseDown }
}