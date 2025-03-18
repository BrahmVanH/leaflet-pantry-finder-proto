import { LatLng } from 'leaflet';
import foodPantries from '../../lib/data/food-pantries.json';

function Panel({ handleFocusPantryLocation }: Readonly<{ handleFocusPantryLocation: (coordinates: number[]) => void }>) {
	return (
		<div className='grid grid-cols-1 gap-2 p-2 max-h-100% overflow-y-auto'>
			{foodPantries.features.map((feature, index) => {
				const { properties } = feature;
				return (
					<button onClick={() => handleFocusPantryLocation(feature.geometry.coordinates)} key={index} className='bg-white text-black p-2 rounded-md shadow-md'>
						<h3 className='text-lg font-semibold'>{properties.name}</h3>
						<p>{properties.address}</p>
						<p>
							{properties.city}, {properties.state} {properties.zip}
						</p>
						<p>{properties.phone}</p>
					</button>
				);
			})}
		</div>
	);
}

export default Panel;
