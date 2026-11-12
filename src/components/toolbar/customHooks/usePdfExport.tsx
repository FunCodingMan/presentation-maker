import React, { useCallback, useEffect, useState } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { createRoot } from 'react-dom/client'
import { SlideView } from '../../slideView/SlideView.js'
import type { Presentation } from '../../../model/types/presentation.js'

const WIDTH = 1000
const HEIGHT = 562

function usePdfExport() {
    const [isExporting, setIsExporting] = useState(false)

    useEffect(() => {
        if (!isExporting) return
        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault()
            e.returnValue = ''
        }
        window.addEventListener('beforeunload', handler)
        return () => window.removeEventListener('beforeunload', handler)
    }, [isExporting])

    const exportToPdf = useCallback(async (presentation: Presentation) => {
        if (!presentation.slides?.length) return

        setIsExporting(true)

        const container = document.createElement('div')
        Object.assign(container.style, {
            position: 'absolute',
            top: '-9999px',
            left: '-9999px',
            width: `${WIDTH}px`,
            height: `${HEIGHT}px`,
        })
        document.body.appendChild(container)
        const root = createRoot(container)

        try {
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [WIDTH, HEIGHT] })

            for (const [i, slide] of presentation.slides.entries()) {
                if (i > 0) pdf.addPage()

                await new Promise<void>((resolve) => {
                    root.render(<SlideView slide={slide} readonly={true} />)
                    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
                })

                const canvas = await html2canvas(container, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                })

                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, WIDTH, HEIGHT)
            }

            pdf.save(`${presentation.name.trim() || 'presentation'}.pdf`)
        } catch (error) {
            console.error('Ошибка при экспорте в PDF:', error)
        } finally {
            root.unmount()
            container.remove()
            setIsExporting(false)
        }
    }, [])

    return { exportToPdf, isExporting }
}

export { usePdfExport }