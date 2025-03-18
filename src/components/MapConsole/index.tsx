import React, { useCallback, useEffect, useState } from 'react';
import { LatLng } from 'leaflet';

import LeafletMap from './MapView';
import Panel from './Panel';

import '../../styles/Map.css';
function MapConsole() {
	const [userDefinedLocation, setUserDefinedLocation] = useState<LatLng | null>(null);

	const handleSetUserDefinedLocation = useCallback((coordinates: number[]) => {
    const latLng = new LatLng(coordinates[1], coordinates[0]);
		setUserDefinedLocation(latLng);
	}, []);

	useEffect(() => {
		const getLocation = async () => {
			try {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
						(position) => {
							const userLatLng = new LatLng(position.coords.latitude, position.coords.longitude);
							setUserDefinedLocation(userLatLng);
						},
						(error) => {
							console.log('Geolocation permission denied or error:', error);
						}
					);
				}
			} catch (error) {
				console.log('Geolocation failed:', error);
			}
		};

		getLocation();
	}, []);

	return (
		<div className='grid grid-cols-8 gap-4' style={{ height: '100vh' }}>
			<div className='col-span-5' style={{ height: '100%' }}>
				<LeafletMap userDefinedLocation={userDefinedLocation} />
			</div>
			<div className='col-span-3' style={{ height: '100%' }}>
				<Panel handleFocusPantryLocation={handleSetUserDefinedLocation}/>
			</div>
		</div>
	);
}

export default MapConsole;
