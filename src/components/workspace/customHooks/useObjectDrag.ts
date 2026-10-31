import { useEffect, useRef, useState, useCallback } from 'react'
import { dispatch } from '../../../editor.js'
import { modifyPresentation } from '../../../viewmodel/functions/navigation.js'
import { modifySlide } from '../../../model/functions/presentation.js'
import { moveObjects } from '../../../model/functions/objects.js'
import { SlideObject } from '../../../model/types/objects.js'

type Point = { x: number, y: number }
type ObjectPositionUpdate = { objectId: string; position: Point }

type UseObjectDragProps = {
    selectedObjectIds: string[]
    activeSlideId: string | null
    objects: SlideObject[]
}

export function useObjectDrag({ selectedObjectIds, activeSlideId, objects }: UseObjectDragProps) {
    const [dragOffset, setDragOffset] = useState<{ dx: number; dy: number }>({ dx: 0, dy: 0 })
    const dragRef = useRef<{
        isDragging: boolean
        startX: number
        startY: number
        currentDx: number
        currentDy: number
        initialPositions: Map<string, Point>
    }>({
        isDragging: false,
        startX: 0,
        startY: 0,
        currentDx: 0,
        currentDy: 0,
        initialPositions: new Map(),
    })

    const handleMouseDown = useCallback((e: React.MouseEvent, objectId: string) => {
        if (e.button !== 0 || !activeSlideId) return

        let idsToMove: string[]

        if (selectedObjectIds.includes(objectId)) {
            idsToMove = selectedObjectIds
        } else if (e.shiftKey) {
            idsToMove = [...selectedObjectIds, objectId]
        } else {
            idsToMove = [objectId]
        }

        const initialPositions = new Map<string, Point>()
        objects.forEach(obj => {
            if (idsToMove.includes(obj.id)) {
                initialPositions.set(obj.id, { x: obj.position.x, y: obj.position.y })
            }
        })

        dragRef.current = {
            isDragging: true,
            startX: e.clientX,
            startY: e.clientY,
            currentDx: 0,
            currentDy: 0,
            initialPositions,
        }

        setDragOffset({ dx: 0, dy: 0 })
    }, [selectedObjectIds, activeSlideId, objects])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragRef.current.isDragging || !activeSlideId) return

            const dx = e.clientX - dragRef.current.startX
            const dy = e.clientY - dragRef.current.startY
            
            dragRef.current.currentDx = dx
            dragRef.current.currentDy = dy
            setDragOffset({ dx, dy })
        }

        const handleMouseUp = () => {
            const { isDragging, currentDx, currentDy, initialPositions } = dragRef.current
            
            if (isDragging) {
                if (Math.abs(currentDx) >= 2 || Math.abs(currentDy) >= 2) {
                    const updates: ObjectPositionUpdate[] = []
                    
                    initialPositions.forEach((pos, objectId) => {
                        updates.push({
                            objectId,
                            position: { x: pos.x + currentDx, y: pos.y + currentDy },
                        })
                    })

                    dispatch(modifyPresentation, {
                        operation: modifySlide,
                        args: {
                            slideId: activeSlideId,
                            operation: moveObjects,
                            args: { updates },
                        },
                    })
                }

                dragRef.current.isDragging = false
                setDragOffset({ dx: 0, dy: 0 })
            }
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [activeSlideId])

    return { handleMouseDown, dragOffset }
}