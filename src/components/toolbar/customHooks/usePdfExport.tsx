import React, { useCallback, useEffect, useState } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { createRoot } from 'react-dom/client'
import { SlideView } from '../../slideView/SlideView.js'
import type { Presentation } from '../../../model/types/presentation.js'

function usePdfExport() {
    const [isExporting, setIsExporting] = useState(false)

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isExporting) {
                e.preventDefault()
                e.returnValue = ''
            }
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [isExporting])

    const exportToPdf = useCallback(async (presentation: Presentation) => {
        if (!presentation.slides || presentation.slides.length === 0) return
        
        setIsExporting(true)
        try {
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [1000, 562]
            })

            const container = document.createElement('div')
            container.style.position = 'absolute'
            container.style.top = '-9999px'
            container.style.left = '-9999px'
            container.style.width = '1000px'
            container.style.height = '562px'
            document.body.appendChild(container)

            const root = createRoot(container)

            for (let i = 0; i < presentation.slides.length; i++) {
                if (i > 0) pdf.addPage()
                const slide = presentation.slides[i]

                await new Promise<void>((resolve) => {
                    root.render(<SlideView slide={slide} readonly={true} />)
                    setTimeout(resolve, 500)
                })

                const canvas = await html2canvas(container, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff'
                })

                const imgData = canvas.toDataURL('image/png')
                pdf.addImage(imgData, 'PNG', 0, 0, 1000, 562)
            }

            root.unmount()
            document.body.removeChild(container)

            const fileName = presentation.name.trim() || 'presentation'
            pdf.save(`${fileName}.pdf`)

        } catch (error) {
            console.error("Ошибка при экспорте в PDF:", error)
        } finally {
            setIsExporting(false)
        }
    }, [])

    return { exportToPdf, isExporting }
}

export { usePdfExport }