"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Maximize2,
  Eye,
  Camera
} from 'lucide-react'

interface ScreenshotModalProps {
  isOpen: boolean
  onClose: () => void
  screenshot: string
  alert: {
    id: string
    childName: string
    url: string
    timestamp: string
    status: string
  }
}

export function ScreenshotModal({ isOpen, onClose, screenshot, alert }: ScreenshotModalProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = screenshot
    link.download = `screenshot-${alert.childName}-${alert.id}.png`
    link.click()
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const resetView = () => {
    setZoom(1)
    setRotation(0)
    setIsFullscreen(false)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      new: 'destructive',
      read: 'secondary',
      archived: 'outline'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`bg-background rounded-lg shadow-xl w-full max-w-6xl ${isFullscreen ? 'h-screen w-screen max-w-none rounded-none' : 'max-h-[90vh] overflow-y-auto'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Alert Screenshot</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">{alert.childName}</span>
              {getStatusBadge(alert.status)}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isFullscreen && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleFullscreen}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Screenshot Display */}
        <div className={`${isFullscreen ? 'h-[calc(100vh-8rem)]' : 'min-h-[500px]'} bg-gray-900 flex items-center justify-center relative overflow-hidden`}>
          <div 
            className="relative"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease'
            }}
          >
            <img 
              src={screenshot} 
              alt="Alert screenshot" 
              className={`max-w-full max-h-full object-contain ${isFullscreen ? 'max-h-[calc(100vh-8rem)]' : ''}`}
              onClick={handleFullscreen}
            />
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-black/50 rounded-lg p-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRotate}
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={resetView}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>

          {/* Zoom Level Indicator */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {Math.round(zoom * 100)}%
          </div>
        </div>

        {/* Alert Details */}
        <div className="p-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Child Name</h3>
              <p className="font-medium">{alert.childName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
              <div>{getStatusBadge(alert.status)}</div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">URL</h3>
              <a 
                href={alert.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {alert.url}
              </a>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Time</h3>
              <p className="text-sm">
                {new Date(alert.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4 pt-4 border-t">
            <Button
              onClick={handleDownload}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Screenshot
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Copy screenshot to clipboard
                navigator.clipboard.writeText(screenshot)
              }}
            >
              <Camera className="w-4 h-4 mr-2" />
              Copy URL
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
