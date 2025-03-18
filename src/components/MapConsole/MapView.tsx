import { useState, useEffect, useRef, useCallback } from 'react';
import { LatLng, LatLngBoundsExpression, Map as LeafletMap } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { getDistance, getGeoJsonGroupCenter } from '../../lib/data/util';

import foodPantries from '../../lib/data/food-pantries.json';
import 'leaflet/dist/leaflet.css';

// Fix missing marker icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// });

const upBounds: LatLngBoundsExpression = [
	[38.4956, -94.739], // Southwest corner with 500 mile padding
	[54.7221, -77.1121], // Northeast corner with 500 mile padding
];

// Component to change map view when user location becomes available
function ChangeView({ center, zoom }: { center: LatLng; zoom: number }) {
	const map = useMap();
	map.closePopup();
	map.setView(center, zoom);
	return null;
}

function MapView({ userDefinedLocation }: Readonly<{ userDefinedLocation: LatLng | null }>) {
	const mapRef = useRef<LeafletMap | null>(null);

	// Calculate default center immediately
	const defaultCenter = getGeoJsonGroupCenter(foodPantries.features.map((feature) => feature.geometry.coordinates));
	const defaultLatLng = new LatLng(defaultCenter.lat, defaultCenter.lng);

	// Add a useEffect to handle map resize after mounting
	useEffect(() => {
		if (mapRef.current) {
			setTimeout(() => {
				(mapRef.current as LeafletMap)?.invalidateSize();
			}, 100);
		}
	}, [mapRef]);

	return (
		<div className='map-container' style={{ height: '100%', width: '100%' }}>
			<MapContainer
				ref={mapRef}
				className='full-height-map'
				center={defaultLatLng}
				zoom={10}
				minZoom={7}
				maxZoom={19}
				maxBounds={upBounds}
				maxBoundsViscosity={1.0}
				boundsOptions={{ padding: [50, 50] }}
				scrollWheelZoom={true}
				style={{ height: '100%' }}>
				{/* Update view when user location is available */}
				{userDefinedLocation && <ChangeView center={userDefinedLocation} zoom={13} />}

				<TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
				{foodPantries.features.map((pantry) => (
					<Marker key={pantry.id} position={[pantry.geometry.coordinates[1], pantry.geometry.coordinates[0]]}>
						<Popup>
							{pantry.properties.name}
							<br />
							{pantry.properties.address}
							<br />
							{pantry.properties.city}, {pantry.properties.state} {pantry.properties.zip}
							<br />
							{pantry.properties.phone}
							<br />
							{userDefinedLocation && getDistance({ lat: pantry.geometry.coordinates[1], lng: pantry.geometry.coordinates[0] } as LatLng, userDefinedLocation).toFixed(2) + ' miles away'}
						</Popup>
					</Marker>
				))}
			</MapContainer>
		</div>
	);
}

export default MapView;
