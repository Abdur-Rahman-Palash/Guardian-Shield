"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Navigation, 
  Shield, 
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react'
import { trackingService, ChildLocation, Geofence } from '@/lib/trackingService'

interface LiveMapProps {
  childLocations: ChildLocation[]
  className?: string
}

export default function LiveMap({ childLocations, className }: LiveMapProps) {
  const [selectedChild, setSelectedChild] = useState<string | null>(null)
  const [zoom, setZoom] = useState(14)
  const [center, setCenter] = useState({ lat: 23.8103, lng: 90.4125 })
  const [geofences, setGeofences] = useState<Geofence[]>([])

  useEffect(() => {
    setGeofences(trackingService.getGeofences())
  }, [])

  const selectedLocation = childLocations.find(loc => loc.childId === selectedChild)

  const getStatusColor = (location: ChildLocation) => {
    if (!location.isWithinGeofence) return 'bg-red-500'
    if (location.currentGeofence?.type === 'safe') return 'bg-green-500'
    return 'bg-yellow-500'
  }

  const getStatusText = (location: ChildLocation) => {
    if (!location.isWithinGeofence) return 'Outside Safe Zone'
    if (location.currentGeofence?.type === 'safe') return `In ${location.currentGeofence.name}`
    return 'In Restricted Area'
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 1, 20))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 1, 1))
  const handleResetView = () => {
    setZoom(14)
    setCenter({ lat: 23.8103, lng: 90.4125 })
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-600" />
            Live Location Tracking
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetView}>
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Simulated Map View */}
        <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-96 overflow-hidden border">
          {/* Map Grid */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(10)].map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full border-t border-gray-300" style={{ top: `${i * 10}%` }} />
            ))}
            {[...Array(10)].map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full border-l border-gray-300" style={{ left: `${i * 10}%` }} />
            ))}
          </div>

          {/* Geofences */}
          {geofences.map(geofence => {
            const x = ((geofence.longitude - 90.3900) / 0.05) * 100
            const y = ((23.8500 - geofence.latitude) / 0.1) * 100
            const size = (geofence.radius / 1000) * 15 // Scale radius to map
            
            return (
              <div
                key={geofence.id}
                className={`absolute rounded-full border-2 ${
                  geofence.type === 'safe' 
                    ? 'border-green-500 bg-green-100/30' 
                    : 'border-red-500 bg-red-100/30'
                } flex items-center justify-center`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${size}%`,
                  height: `${size}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className={`text-xs font-medium ${
                  geofence.type === 'safe' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {geofence.name}
                </div>
              </div>
            )
          })}

          {/* Child Locations */}
          {childLocations.map(location => {
            const x = ((location.location.longitude - 90.3900) / 0.05) * 100
            const y = ((23.8500 - location.location.latitude) / 0.1) * 100
            const isSelected = selectedChild === location.childId
            
            return (
              <div
                key={location.childId}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                  isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                }`}
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => setSelectedChild(isSelected ? null : location.childId)}
              >
                <div className="relative">
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(location)} animate-pulse`} />
                  <div className={`absolute inset-0 rounded-full ${getStatusColor(location)} animate-ping opacity-75`} />
                  {isSelected && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg whitespace-nowrap">
                      <div className="text-xs font-medium">
                        {location.childId === '1' ? 'Ahmed' : location.childId === '2' ? 'Sara' : 'Mohammed'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getStatusText(location)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Map Controls Overlay */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            <div className="text-xs font-medium text-gray-700 mb-1">Zoom Level</div>
            <div className="text-lg font-bold text-blue-600">{zoom}</div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-xs font-medium text-gray-700 mb-2">Legend</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs">Safe Zone</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-xs">Restricted Area</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs">Child Location</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Child Details */}
        {selectedLocation && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">
                {selectedLocation.childId === '1' ? 'Ahmed' : selectedLocation.childId === '2' ? 'Sara' : 'Mohammed'}
              </h3>
              <Badge className={getStatusColor(selectedLocation)}>
                {getStatusText(selectedLocation)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Coordinates:</span>
                <div className="font-mono">
                  {selectedLocation.location.latitude.toFixed(4)}, {selectedLocation.location.longitude.toFixed(4)}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Last Update:</span>
                <div>{new Date(selectedLocation.location.timestamp).toLocaleTimeString()}</div>
              </div>
              <div>
                <span className="text-gray-500">Speed:</span>
                <div>{selectedLocation.speed?.toFixed(1) || 'N/A'} km/h</div>
              </div>
              <div>
                <span className="text-gray-500">Accuracy:</span>
                <div>±{selectedLocation.location.accuracy?.toFixed(1) || 'N/A'}m</div>
              </div>
            </div>

            {selectedLocation.currentGeofence && (
              <div className="mt-3 p-2 bg-blue-50 rounded border-l-4 border-blue-500">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">In {selectedLocation.currentGeofence.name}</span>
                </div>
              </div>
            )}

            {!selectedLocation.isWithinGeofence && (
              <div className="mt-3 p-2 bg-red-50 rounded border-l-4 border-red-500">
                <div className="flex items-center gap-2 text-sm text-red-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Outside Safe Zones</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {childLocations.filter(loc => loc.isWithinGeofence && loc.currentGeofence?.type === 'safe').length}
            </div>
            <div className="text-xs text-gray-600">In Safe Zones</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {childLocations.filter(loc => !loc.isWithinGeofence).length}
            </div>
            <div className="text-xs text-gray-600">Outside Zones</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {childLocations.length}
            </div>
            <div className="text-xs text-gray-600">Total Tracked</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
