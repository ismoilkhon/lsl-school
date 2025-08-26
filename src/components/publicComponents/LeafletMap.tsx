'use client';

import React, { useEffect, useRef } from 'react';
import { Card, CardBody, Typography, Button } from '@material-tailwind/react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface LeafletMapProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  schoolName?: string;
}

export default function LeafletMap({
  latitude = 40.993861, // 40°59'37.9"N converted to decimal
  longitude = 71.668722, // 71°40'07.4"E converted to decimal
  address = "LSL School, New Location, Central Asia",
  schoolName = "LSL School"
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const loadMap = async () => {
      try {
        const L = await import('leaflet');
        
        // Import Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          link.crossOrigin = '';
          document.head.appendChild(link);
        }

        // Clean up existing map instance
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        if (mapRef.current) {
          // Create map instance
          const map = L.map(mapRef.current).setView([latitude, longitude], 15);
          mapInstanceRef.current = map;

          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // Add custom marker
          const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `
              <div style="
                background: #3B82F6;
                border: 3px solid white;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              ">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
            `,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
          });

          // Add marker with popup
          const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
          
          marker.bindPopup(`
            <div style="text-align: center; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #1E40AF; font-weight: bold;">${schoolName}</h3>
              <p style="margin: 0; color: #374151; font-size: 14px;">${address}</p>
              <p style="margin: 4px 0 0 0; color: #6B7280; font-size: 12px;">
                ${latitude.toFixed(6)}°N, ${longitude.toFixed(6)}°E
              </p>
            </div>
          `);

          // Add navigation controls
          const navigationControl = L.control({ position: 'topright' });
          navigationControl.onAdd = function() {
            const div = L.DomUtil.create('div', 'leaflet-control leaflet-bar');
            div.innerHTML = `
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <button 
                  onclick="window.open('https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15', '_blank')"
                  style="
                    background: white;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    padding: 6px 8px;
                    cursor: pointer;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    transition: background-color 0.2s;
                  "
                  onmouseover="this.style.backgroundColor='#f3f4f6'"
                  onmouseout="this.style.backgroundColor='white'"
                  title="Open in OpenStreetMap"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15 3h6v6"/>
                    <path d="M10 14 21 3"/>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  </svg>
                  OSM
                </button>
                <button 
                  onclick="window.open('https://www.google.com/maps?q=${latitude},${longitude}', '_blank')"
                  style="
                    background: white;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    padding: 6px 8px;
                    cursor: pointer;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    transition: background-color 0.2s;
                  "
                  onmouseover="this.style.backgroundColor='#f3f4f6'"
                  onmouseout="this.style.backgroundColor='white'"
                  title="Open in Google Maps"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15 3h6v6"/>
                    <path d="M10 14 21 3"/>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  </svg>
                  Google
                </button>
              </div>
            `;
            return div;
          };
          navigationControl.addTo(map);

        }
      } catch (error) {
        console.error('Failed to load map:', error);
      }
    };

    loadMap();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, address, schoolName]);

  return (
    <Card>
      <CardBody className="p-0">
        <div className="relative">
          <div 
            ref={mapRef} 
            className="h-64 w-full rounded-lg"
            style={{ minHeight: '256px' }}
          />
          
          {/* Map info overlay */}
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-md">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{schoolName}</p>
                <p className="text-sm text-gray-600">{address}</p>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              size="sm"
              variant="outlined"
              className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg shadow-md flex items-center gap-2 transition-colors"
              onClick={() => window.open(`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              <span className="text-sm font-medium">OpenStreetMap</span>
            </Button>
            <Button
              size="sm"
              variant="outlined"
              className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg shadow-md flex items-center gap-2 transition-colors"
              onClick={() => window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              <span className="text-sm font-medium">Google Maps</span>
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
