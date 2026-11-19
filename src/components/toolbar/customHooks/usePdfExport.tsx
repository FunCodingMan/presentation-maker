import { useCallback, useRef, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { SlideView } from '../../slideView/SlideView.js'
import type { Presentation } from '../../../model/types/presentation.js'
import type { Slide } from '../../../model/types/slide.js'

const EXPORT_SIZE = {
    width: 1000,
    height: 562,
} as const

function createRenderStage(): HTMLDivElement {
    const stage = document.createElement('div')
    stage.style.position = 'fixed'
    stage.style.left = '-10000px'
    stage.style.top = '0'
    stage.style.width = `${EXPORT_SIZE.width}px`
    stage.style.height = `${EXPORT_SIZE.height}px`
    stage.style.pointerEvents = 'none'
    document.body.appendChild(stage)
    return stage
}

async function waitForImages(container: HTMLElement): Promise<void> {
    const images = Array.from(container.querySelectorAll('img'))
    await Promise.all(
        images.map((img) => {
            if (img.complete) return Promise.resolve()
            return new Promise<void>((resolve) => {
                img.onload = () => resolve()
                img.onerror = () => resolve()
            })
        })
    )
}

async function captureSlide(root: Root, stage: HTMLDivElement, slide: Slide): Promise<HTMLCanvasElement> {
    flushSync(() => {
        root.render(<SlideView slide={slide} readonly />)
    })

    await waitForImages(stage)

    return html2canvas(stage, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
    })
}

function usePdfExport() {
    const [isExporting, setIsExporting] = useState(false)
    const activeRef = useRef(false)

    const exportToPdf = useCallback(async (presentation: Presentation) => {
        if (activeRef.current || presentation.slides.length === 0) return

        activeRef.current = true
        setIsExporting(true)

        const stage = createRenderStage()
        const root = createRoot(stage)

        try {
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [EXPORT_SIZE.width, EXPORT_SIZE.height],
                hotfixes: ['px_scaling'],
            })

            for (let index = 0; index < presentation.slides.length; index++) {
                if (index > 0) {
                    doc.addPage([EXPORT_SIZE.width, EXPORT_SIZE.height], 'landscape')
                }

                const canvas = await captureSlide(root, stage, presentation.slides[index])
                doc.addImage(canvas, 'PNG', 0, 0, EXPORT_SIZE.width, EXPORT_SIZE.height)
            }

            const fileName = presentation.name.trim() || 'presentation'
            doc.save(`${fileName}.pdf`)
        } catch (err) {
            console.error('Не удалось экспортировать PDF:', err)
        } finally {
            root.unmount()
            stage.remove()
            activeRef.current = false
            setIsExporting(false)
        }
    }, [])

    return { exportToPdf, isExporting }
}

export { usePdfExport }