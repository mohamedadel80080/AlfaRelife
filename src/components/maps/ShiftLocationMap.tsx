'use client'

import { MapPin } from 'lucide-react'

interface ShiftLocationMapProps {
  lat: string | number
  lng: string | number
  address?: string
}

export function ShiftLocationMap({ lat, lng, address }: ShiftLocationMapProps) {
  // Convert string coordinates to numbers
  const latitude = typeof lat === 'string' ? parseFloat(lat) : lat
  const longitude = typeof lng === 'string' ? parseFloat(lng) : lng

  // Validate coordinates
  const isValidCoordinates = () => {
    if (isNaN(latitude) || isNaN(longitude)) {
      return false
    }
    // Check if coordinates are in valid range
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return false
    }
    // Check if coordinates are not zero (likely invalid/default)
    if (latitude === 0 && longitude === 0) {
      return false
    }
    return true
  }

  if (!isValidCoordinates()) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Location not available</p>
          <p className="text-sm text-gray-500 mt-1">
            Invalid coordinates
          </p>
        </div>
      </div>
    )
  }

  // Using OpenStreetMap embed (free alternative to Google Maps)
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`

  return (
    <div className="space-y-2">
      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={mapUrl}
          style={{ border: 0 }}
          title="Shift Location Map"
        />
      </div>
      <div className="flex items-start gap-2 text-sm text-gray-600">
        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
        <div className="flex-1">
          {address && <p className="font-medium text-gray-700 mb-1">{address}</p>}
          <p className="text-xs text-gray-500">
            Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </p>
        </div>
      </div>
    </div>
  )
}
