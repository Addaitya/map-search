import { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import usePlacesAutocomplete, {getGeocode, getLatLng} from 'use-places-autocomplete';
import Select from 'react-select';
const libraries = ['places'];
const key = import.meta.env.VITE_KEY;

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

// const center = {
//   lat: 7.2905715, // default latitude
//   lng: 80.6337262, // default longitude
// };

const PlaceAutoComplete = ({ map }) => {
  const { ready, value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutocomplete();

  const [selectOptions, setSelectOptions] = useState([]);

  useEffect(() => {
    if (status === 'OK') {
      setSelectOptions(
        data.map(({ description }) => ({ value: description, label: description }))
      );
    } else {
      setSelectOptions([]);
    }
  }, [status, data]);


  

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const pos = getLatLng(results[0]);
    
    if(map) {
      map.panTo(pos);
      map.setZoom(14);
    }

  };  

  return (
    <Select
      value={value}
      onInputChange={(text) => setValue(text)}
      onChange={(address) => handleSelect(address.value)}
      options={selectOptions}
      isDisabled={!ready}
      placeholder="Search an address"
    />
  );
}






const MyMap = () => {

  // const [center, setCenter] = useState({lat: 22.719568, lng: 75.857727});
  const [map, setMap] = useState(null);
  const center = {lat: 22.719568, lng: 75.857727};
 
  const {isLoaded, loadError}= useLoadScript({
    googleMapsApiKey: key,
    libraries,
  });


  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;
  

  return (
    <div>
      <PlaceAutoComplete map={map} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
        onLoad={setMap}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};




export default MyMap;