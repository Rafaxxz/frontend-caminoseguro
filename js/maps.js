/**
 * CaminoSeguro - Leaflet/OpenStreetMap Integration
 * Configuración y utilidades para mapas (100% gratis, sin API keys)
 */

// Configuración del mapa centrado en Lima, Perú
const MAP_CONFIG = {
  center: [-12.0464, -77.0428], // Lima Centro [lat, lng]
  zoom: 13
};

// Variable global para almacenar instancias de mapas
let maps = {};
let markers = [];
let heatLayer = null;
let routingControl = null;

/**
 * Inicializa un mapa de Leaflet en un contenedor
 */
function initMap(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container ${containerId} not found`);
    return null;
  }

  const mapOptions = {
    center: options.center || MAP_CONFIG.center,
    zoom: options.zoom || MAP_CONFIG.zoom,
    zoomControl: true,
    ...options
  };

  const map = L.map(containerId, mapOptions);
  
  // Añadir capa de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  maps[containerId] = map;
  
  return map;
}

/**
 * Inicializa el mapa de calor
 */
function initHeatMap(containerId) {
  const map = initMap(containerId, { zoom: 12 });
  if (!map) return null;

  // Obtener datos del heatmap
  loadHeatmapData(map);
  
  return map;
}

/**
 * Carga datos del heatmap
 */
async function loadHeatmapData(map, filter = 'all', timeRange = '7d') {
  try {
    // Intentar cargar desde la API
    let heatmapData = [];
    
    try {
      const response = await api.get(`/heatmap?timeRange=${timeRange}${filter !== 'all' ? `&type=${filter}` : ''}`);
      if (response && response.success && response.data) {
        heatmapData = response.data.map(zone => [
          zone.latitude,
          zone.longitude,
          zone.intensity || zone.count || 1
        ]);
      }
    } catch (e) {
      // Usar datos demo si la API falla
      heatmapData = getDemoHeatmapData();
    }

    if (heatmapData.length === 0) {
      heatmapData = getDemoHeatmapData();
    }

    // Remover heatmap anterior si existe
    if (heatLayer) {
      map.removeLayer(heatLayer);
    }

    // Crear nueva capa de heatmap con puntos más grandes y visibles
    heatLayer = L.heatLayer(heatmapData, {
      radius: 50,
      blur: 30,
      maxZoom: 18,
      max: 10,
      minOpacity: 0.5,
      gradient: {
        0.0: 'blue',
        0.25: 'lime',
        0.5: 'yellow',
        0.75: 'orange',
        1.0: 'red'
      }
    }).addTo(map);

  } catch (error) {
    console.error('Error loading heatmap data:', error);
    const demoData = getDemoHeatmapData();
    heatLayer = L.heatLayer(demoData, {
      radius: 50,
      blur: 30,
      maxZoom: 18,
      minOpacity: 0.5,
      gradient: {
        0.0: 'blue',
        0.25: 'lime',
        0.5: 'yellow',
        0.75: 'orange',
        1.0: 'red'
      }
    }).addTo(map);
  }
}

/**
 * Datos de demostración para el heatmap [lat, lng, intensity]
 */
function getDemoHeatmapData() {
  return [
    [-12.0464, -77.0428, 10], // Centro de Lima
    [-12.1191, -77.0311, 8],  // Miraflores
    [-12.0975, -77.0528, 7],  // San Isidro
    [-12.0563, -77.0842, 9],  // Pueblo Libre
    [-12.0789, -76.9714, 6],  // La Victoria
    [-12.0432, -77.0282, 8],  // Cercado
    [-12.1108, -77.0178, 5],  // Barranco
    [-12.0865, -77.0015, 7],  // Surquillo
    [-12.1347, -77.0147, 4],  // Chorrillos
    [-12.0697, -77.0336, 6],  // Lince
    [-12.0550, -77.0450, 7],  // Breña
    [-12.0720, -77.0600, 5],  // Jesús María
    [-12.1050, -77.0250, 6],  // Surco
    [-12.0380, -77.0550, 8],  // San Miguel
  ];
}

/**
 * Inicializa el mapa de rutas
 */
function initRoutesMap(containerId) {
  const map = initMap(containerId, { zoom: 14 });
  if (!map) return null;
  return map;
}

/**
 * Calcula y muestra una ruta entre dos puntos usando OSRM (gratis)
 */
async function calculateRoute(origin, destination, mapId = 'routeMap') {
  const map = maps[mapId];
  if (!map) {
    console.error('Map not initialized');
    return null;
  }

  // Remover ruta anterior si existe
  if (routingControl) {
    map.removeLayer(routingControl);
  }

  // Obtener coordenadas si son strings
  let originCoords = origin;
  let destCoords = destination;

  if (typeof origin === 'string') {
    originCoords = await geocodeAddress(origin);
  }
  if (typeof destination === 'string') {
    destCoords = await geocodeAddress(destination);
  }

  const startLat = originCoords.lat || originCoords[0];
  const startLng = originCoords.lng || originCoords[1];
  const endLat = destCoords.lat || destCoords[0];
  const endLng = destCoords.lng || destCoords[1];

  // Usar OSRM API para obtener la ruta (gratis y sin API key)
  const url = `https://router.project-osrm.org/route/v1/foot/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 'Ok' && data.routes.length > 0) {
      const route = data.routes[0];
      
      // Limpiar marcadores anteriores de ruta
      clearRouteMarkers();

      // Dibujar la ruta
      const routeCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
      const routeLine = L.polyline(routeCoords, {
        color: '#22c55e',
        weight: 5,
        opacity: 0.8
      }).addTo(map);

      // Marcador de inicio
      const startMarker = L.marker([startLat, startLng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background: #22c55e; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
      }).addTo(map).bindPopup('Inicio');

      // Marcador de fin
      const endMarker = L.marker([endLat, endLng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
      }).addTo(map).bindPopup('Destino');

      // Guardar para limpiar después
      markers.push(startMarker, endMarker);
      routingControl = routeLine;

      // Ajustar vista al bounds de la ruta
      map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

      // Convertir pasos a formato compatible
      const steps = route.legs[0].steps.map(step => ({
        instructions: step.maneuver.type + ' ' + (step.name || ''),
        distance: { text: (step.distance / 1000).toFixed(2) + ' km' }
      }));

      return {
        routes: [{
          legs: [{
            duration: { text: Math.round(route.duration / 60) + ' min' },
            distance: { text: (route.distance / 1000).toFixed(2) + ' km' },
            steps: steps
          }]
        }]
      };
    }
  } catch (error) {
    console.error('Error calculating route:', error);
    throw error;
  }
}

/**
 * Limpia marcadores de ruta
 */
function clearRouteMarkers() {
  if (routingControl) {
    const map = Object.values(maps)[0];
    if (map) {
      map.removeLayer(routingControl);
    }
    routingControl = null;
  }
}

/**
 * Inicializa el mapa de puntos de ayuda
 */
function initHelpPointsMap(containerId) {
  const map = initMap(containerId, { zoom: 13 });
  if (!map) return null;

  // Cargar puntos de ayuda
  loadHelpPoints(map);
  
  return map;
}

/**
 * Carga puntos de ayuda desde la API
 */
async function loadHelpPoints(map, filter = 'all') {
  try {
    // Limpiar marcadores anteriores
    clearMarkers();

    let points = [];
    
    try {
      const response = await api.get('/help-points');
      if (response && response.success && response.data) {
        points = response.data.helpPoints || response.data;
      }
    } catch (e) {
      points = getDemoHelpPoints();
    }

    if (points.length === 0) {
      points = getDemoHelpPoints();
    }

    // Filtrar si es necesario
    if (filter !== 'all') {
      points = points.filter(p => p.type === filter || p.pointType === filter);
    }

    // Crear marcadores
    points.forEach(point => {
      addHelpPointMarker(map, point);
    });

  } catch (error) {
    console.error('Error loading help points:', error);
    const demoPoints = getDemoHelpPoints();
    demoPoints.forEach(point => addHelpPointMarker(map, point));
  }
}

/**
 * Datos de demostración para puntos de ayuda
 */
function getDemoHelpPoints() {
  return [
    { id: 1, name: 'Comisaría San Isidro', type: 'policia', lat: -12.0975, lng: -77.0528, address: 'Av. Arequipa 2245, San Isidro', phone: '(01) 264-0000' },
    { id: 2, name: 'Serenazgo Miraflores', type: 'serenazgo', lat: -12.1191, lng: -77.0311, address: 'Av. José Larco 1150, Miraflores', phone: '(01) 617-7000' },
    { id: 3, name: 'Compañía de Bomberos N° 28', type: 'bomberos', lat: -12.1150, lng: -77.0350, address: 'Av. Benavides 400, Miraflores', phone: '116' },
    { id: 4, name: 'Clínica Ricardo Palma', type: 'hospital', lat: -12.0900, lng: -77.0450, address: 'Av. Javier Prado Este 1066, San Isidro', phone: '(01) 224-2224' },
    { id: 5, name: 'Comisaría Miraflores', type: 'policia', lat: -12.1220, lng: -77.0290, address: 'Calle Schell 250, Miraflores', phone: '(01) 243-8989' },
    { id: 6, name: 'Hospital Casimiro Ulloa', type: 'hospital', lat: -12.1280, lng: -77.0200, address: 'Av. República de Panamá 6355, Miraflores', phone: '(01) 204-0900' },
    { id: 7, name: 'Serenazgo San Isidro', type: 'serenazgo', lat: -12.1000, lng: -77.0400, address: 'Calle Las Begonias 600, San Isidro', phone: '(01) 513-9000' },
    { id: 8, name: 'Compañía de Bomberos N° 4', type: 'bomberos', lat: -12.0500, lng: -77.0300, address: 'Jr. Carabaya 715, Cercado de Lima', phone: '116' },
  ];
}

/**
 * Agrega un marcador de punto de ayuda
 */
function addHelpPointMarker(map, point) {
  const icons = {
    policia: { color: '#3b82f6', icon: '🚔' },
    serenazgo: { color: '#22c55e', icon: '🛡️' },
    bomberos: { color: '#ef4444', icon: '🚒' },
    hospital: { color: '#a855f7', icon: '🏥' }
  };

  const config = icons[point.type] || icons[point.pointType] || { color: '#6b7280', icon: '📍' };

  const marker = L.marker([point.lat || point.latitude, point.lng || point.longitude], {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<div style="background: ${config.color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 12px;">${config.icon}</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })
  }).addTo(map);

  // Popup
  marker.bindPopup(`
    <div style="padding: 8px; max-width: 200px;">
      <h3 style="font-weight: bold; margin-bottom: 4px;">${point.name}</h3>
      <p style="color: #666; font-size: 12px; margin-bottom: 4px;">${point.address}</p>
      ${point.phone ? `<p style="color: #3b82f6; font-size: 12px;">📞 ${point.phone}</p>` : ''}
    </div>
  `);

  markers.push(marker);
  return marker;
}

/**
 * Limpia todos los marcadores del mapa
 */
function clearMarkers() {
  markers.forEach(marker => {
    const map = Object.values(maps)[0];
    if (map && marker) {
      map.removeLayer(marker);
    }
  });
  markers = [];
}

/**
 * Agrega un marcador de reporte
 */
function addReportMarker(map, report) {
  const severityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#22c55e'
  };

  const color = severityColors[report.severity] || '#6b7280';

  const marker = L.marker([
    report.latitude || report.location?.latitude,
    report.longitude || report.location?.longitude
  ], {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<div style="background: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })
  }).addTo(map);

  marker.bindPopup(`
    <div style="padding: 8px; max-width: 250px;">
      <h3 style="font-weight: bold; margin-bottom: 4px;">${report.incidentType || report.type}</h3>
      <p style="color: #666; font-size: 12px; margin-bottom: 4px;">${report.description || ''}</p>
      <p style="color: #999; font-size: 11px;">${report.address || report.location?.address || ''}</p>
    </div>
  `);

  markers.push(marker);
  return marker;
}

/**
 * Centra el mapa en la ubicación actual del usuario
 */
function centerOnUserLocation(mapId) {
  const map = maps[mapId];
  if (!map) return;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = [position.coords.latitude, position.coords.longitude];
        map.setView(userLocation, 15);

        // Agregar marcador del usuario
        const userMarker = L.marker(userLocation, {
          icon: L.divIcon({
            className: 'custom-marker',
            html: '<div style="background: #359dff; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })
        }).addTo(map).bindPopup('Tu ubicación');

        markers.push(userMarker);
      },
      (error) => {
        console.error('Error getting location:', error);
        if (typeof ui !== 'undefined') {
          ui.showError('No se pudo obtener tu ubicación');
        }
      }
    );
  } else {
    if (typeof ui !== 'undefined') {
      ui.showError('Tu navegador no soporta geolocalización');
    }
  }
}

/**
 * Geocodifica una dirección a coordenadas usando Nominatim (gratis)
 */
async function geocodeAddress(address) {
  const query = encodeURIComponent(address + ', Lima, Perú');
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CaminoSeguro/1.0'
      }
    });
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        formatted: data[0].display_name
      };
    }
    throw new Error('No se encontró la dirección');
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

/**
 * Configura el autocomplete para un input (usando Nominatim)
 */
function setupAutocomplete(inputId, onPlaceChanged) {
  const input = document.getElementById(inputId);
  if (!input) return null;

  let debounceTimer;
  let dropdown = null;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = input.value;

    if (query.length < 3) {
      if (dropdown) dropdown.remove();
      return;
    }

    debounceTimer = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Lima, Perú')}&limit=5`;
        const response = await fetch(url, {
          headers: { 'User-Agent': 'CaminoSeguro/1.0' }
        });
        const results = await response.json();

        // Crear dropdown
        if (dropdown) dropdown.remove();
        
        if (results.length > 0) {
          dropdown = document.createElement('div');
          dropdown.className = 'autocomplete-dropdown';
          dropdown.style.cssText = 'position: absolute; background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-height: 200px; overflow-y: auto; z-index: 1000; width: 100%;';
          
          results.forEach(result => {
            const item = document.createElement('div');
            item.style.cssText = 'padding: 10px 12px; cursor: pointer; font-size: 14px; border-bottom: 1px solid #f3f4f6;';
            item.textContent = result.display_name.substring(0, 60) + (result.display_name.length > 60 ? '...' : '');
            
            item.addEventListener('mouseenter', () => item.style.background = '#f3f4f6');
            item.addEventListener('mouseleave', () => item.style.background = 'white');
            
            item.addEventListener('click', () => {
              input.value = result.display_name.split(',')[0];
              dropdown.remove();
              dropdown = null;
              
              if (onPlaceChanged) {
                onPlaceChanged({
                  geometry: {
                    location: {
                      lat: () => parseFloat(result.lat),
                      lng: () => parseFloat(result.lon)
                    }
                  },
                  formatted_address: result.display_name
                });
              }
            });
            
            dropdown.appendChild(item);
          });

          input.parentNode.style.position = 'relative';
          input.parentNode.appendChild(dropdown);
        }
      } catch (error) {
        console.error('Autocomplete error:', error);
      }
    }, 300);
  });

  // Cerrar dropdown al hacer click fuera
  document.addEventListener('click', (e) => {
    if (dropdown && !input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.remove();
      dropdown = null;
    }
  });

  return { input };
}

// Exportar funciones globales
window.initMap = initMap;
window.initHeatMap = initHeatMap;
window.initRoutesMap = initRoutesMap;
window.initHelpPointsMap = initHelpPointsMap;
window.loadHeatmapData = loadHeatmapData;
window.loadHelpPoints = loadHelpPoints;
window.calculateRoute = calculateRoute;
window.centerOnUserLocation = centerOnUserLocation;
window.geocodeAddress = geocodeAddress;
window.setupAutocomplete = setupAutocomplete;
window.clearMarkers = clearMarkers;
window.addReportMarker = addReportMarker;
