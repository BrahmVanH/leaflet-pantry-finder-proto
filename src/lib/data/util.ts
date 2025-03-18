import type { Position } from 'geojson';
import { LatLng, LatLngExpression } from 'leaflet';

export const getGeoJsonGroupCenter = (coordinates: number[][]) => {
	// const positions = geoJsonRouteData.features[0].geometry.coordinates;
	const latitudes = coordinates.map((position: Position) => position[1]);
	const longitudes = coordinates.map((position: Position) => position[0]);

	const minLat = Math.min(...latitudes);
	const maxLat = Math.max(...latitudes);
	const minLon = Math.min(...longitudes);
	const maxLon = Math.max(...longitudes);

	const center = { lat: (maxLat + minLat) / 2, lng: (maxLon + minLon) / 2 };
	return center;
};

// calculate distance between two coordinates using Haversine formula returns distance in miles
export const getDistance = (coord1: LatLng, coord2: LatLng) => {
	// Earth's radius in meters
	const R = 6371e3;

	const lat1 = (coord1.lat * Math.PI) / 180;
	const lat2 = (coord2.lat * Math.PI) / 180;
	const deltaLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
	const deltaLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;

	const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const distance = R * c;
	const distanceInMiles = distance * 0.000621371;

	return distanceInMiles;
};
