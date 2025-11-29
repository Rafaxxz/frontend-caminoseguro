/**
 * CaminoSeguro - Google Maps Integration
 * Configuración y utilidades para mapas
 */

// Configuración del mapa centrado en Lima, Perú
const MAP_CONFIG = {
  center: { lat: -12.0464, lng: -77.0428 }, // Lima Centro
  zoom: 13,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ]
};

// Variable global para almacenar instancias de mapas
let maps = {};
let markers = [];
let heatmapLayer = null;
let directionsService = null;
let directionsRenderer = null;

/**
 * Inicializa un mapa de Google en un contenedor
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
    styles: MAP_CONFIG.styles,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    zoomControl: true,
    ...options
  };

  const map = new google.maps.Map(container, mapOptions);
  maps[containerId] = map;
  
  return map;
}

/**
 * Inicializa el mapa de calor
 */
function initHeatMap(containerId) {
  const map = initMap(containerId, { zoom: 12 });
  if (!map) return null;

  // Obtener datos del heatmap desde la API
  loadHeatmapData(map);
  
  return map;
}

/**
 * Carga datos del heatmap desde la API
 */
async function loadHeatmapData(map, filter = 'all', timeRange = '7d') {
  try {
    // Intentar cargar desde la API
    const response = await api.get(`/heatmap?timeRange=${timeRange}${filter !== 'all' ? `&type=${filter}` : ''}`).catch(() => null);
    
    let heatmapData = [];
    
    if (response && response.success && response.data) {
      // Usar datos reales de la API
      heatmapData = response.data.map(zone => ({
        location: new google.maps.LatLng(zone.latitude, zone.longitude),
        weight: zone.intensity || zone.count || 1
      }));
    } else {
      // Datos de demostración para Lima
      heatmapData = getDemoHeatmapData();
    }

    // Remover heatmap anterior si existe
    if (heatmapLayer) {
      heatmapLayer.setMap(null);
    }

    // Crear nueva capa de heatmap
    heatmapLayer = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: map,
      radius: 50,
      opacity: 0.7,
      gradient: [
        'rgba(0, 255, 0, 0)',
        'rgba(0, 255, 0, 1)',
        'rgba(255, 255, 0, 1)',
        'rgba(255, 165, 0, 1)',
        'rgba(255, 0, 0, 1)'
      ]
    });

  } catch (error) {
    console.error('Error loading heatmap data:', error);
    // Cargar datos demo en caso de error
    const demoData = getDemoHeatmapData();
    heatmapLayer = new google.maps.visualization.HeatmapLayer({
      data: demoData,
      map: map,
      radius: 50,
      opacity: 0.7
    });
  }
}

/**
 * Datos de demostración para el heatmap
 */
function getDemoHeatmapData() {
  const baseLocations = [
    { lat: -12.0464, lng: -77.0428, weight: 10 }, // Centro de Lima
    { lat: -12.1191, lng: -77.0311, weight: 8 },  // Miraflores
    { lat: -12.0975, lng: -77.0528, weight: 7 },  // San Isidro
    { lat: -12.0563, lng: -77.0842, weight: 9 },  // Pueblo Libre
    { lat: -12.0789, lng: -76.9714, weight: 6 },  // La Victoria
    { lat: -12.0432, lng: -77.0282, weight: 8 },  // Cercado
    { lat: -12.1108, lng: -77.0178, weight: 5 },  // Barranco
    { lat: -12.0865, lng: -77.0015, weight: 7 },  // Surquillo
    { lat: -12.1347, lng: -77.0147, weight: 4 },  // Chorrillos
    { lat: -12.0697, lng: -77.0336, weight: 6 },  // Lince
  ];

  return baseLocations.map(loc => ({
    location: new google.maps.LatLng(loc.lat, loc.lng),
    weight: loc.weight
  }));
}

/**
 * Inicializa el mapa de rutas
 */
function initRoutesMap(containerId) {
  const map = initMap(containerId, { zoom: 14 });
  if (!map) return null;

  // Inicializar servicios de direcciones
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: false,
    polylineOptions: {
      strokeColor: '#22c55e',
      strokeWeight: 5
    }
  });

  return map;
}

/**
 * Calcula y muestra una ruta entre dos puntos
 */
async function calculateRoute(origin, destination, mapId = 'routeMap') {
  const map = maps[mapId];
  if (!map || !directionsService || !directionsRenderer) {
    console.error('Map or directions service not initialized');
    return null;
  }

  return new Promise((resolve, reject) => {
    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.WALKING,
      provideRouteAlternatives: true
    }, (response, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
        resolve(response);
      } else {
        console.error('Directions request failed:', status);
        reject(status);
      }
    });
  });
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

    // Intentar cargar desde la API
    const response = await api.get('/help-points').catch(() => null);
    
    let points = [];
    
    if (response && response.success && response.data) {
      points = response.data.helpPoints || response.data;
    } else {
      // Datos de demostración
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
    // Cargar datos demo
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

  const marker = new google.maps.Marker({
    position: { lat: point.lat || point.latitude, lng: point.lng || point.longitude },
    map: map,
    title: point.name,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: config.color,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: 12
    }
  });

  // Info window
  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div style="padding: 8px; max-width: 200px;">
        <h3 style="font-weight: bold; margin-bottom: 4px;">${point.name}</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 4px;">${point.address}</p>
        ${point.phone ? `<p style="color: #3b82f6; font-size: 12px;">📞 ${point.phone}</p>` : ''}
      </div>
    `
  });

  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });

  markers.push(marker);
  return marker;
}

/**
 * Limpia todos los marcadores del mapa
 */
function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
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

  const marker = new google.maps.Marker({
    position: { 
      lat: report.latitude || report.location?.latitude, 
      lng: report.longitude || report.location?.longitude 
    },
    map: map,
    title: report.incidentType || report.type,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 0.8,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: 10
    }
  });

  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div style="padding: 8px; max-width: 250px;">
        <h3 style="font-weight: bold; margin-bottom: 4px;">${report.incidentType || report.type}</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 4px;">${report.description || ''}</p>
        <p style="color: #999; font-size: 11px;">${report.address || report.location?.address || ''}</p>
      </div>
    `
  });

  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });

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
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setCenter(userLocation);
        map.setZoom(15);

        // Agregar marcador del usuario
        new google.maps.Marker({
          position: userLocation,
          map: map,
          title: 'Tu ubicación',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#359dff',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
            scale: 10
          }
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        ui.showError('No se pudo obtener tu ubicación');
      }
    );
  } else {
    ui.showError('Tu navegador no soporta geolocalización');
  }
}

/**
 * Geocodifica una dirección a coordenadas
 */
function geocodeAddress(address) {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address + ', Lima, Perú' }, (results, status) => {
      if (status === 'OK' && results[0]) {
        resolve({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
          formatted: results[0].formatted_address
        });
      } else {
        reject(new Error('No se encontró la dirección'));
      }
    });
  });
}

/**
 * Configura el autocomplete para un input
 */
function setupAutocomplete(inputId, onPlaceChanged) {
  const input = document.getElementById(inputId);
  if (!input) return null;

  const autocomplete = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: 'pe' },
    fields: ['place_id', 'geometry', 'formatted_address', 'name']
  });

  if (onPlaceChanged) {
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      onPlaceChanged(place);
    });
  }

  return autocomplete;
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
