import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import './mapView.css';
import SearchBar from '../components/Input/SearchBar';
import RouteMap from '../components/Map/RouteMap';
import UserMenu from '../components/Menu/UserMenu';
import BookmarkList from '../components/BookmarkList/BookmarkList';
import SpeedDisplay from '../components/SpeedDisplay/SpeedDisplay';
import { useLiveLocation } from '../hooks/useLiveLocation';
import random from 'random'; // Used only for debugging feature for speed warnings below

// Bookmark Format 
interface NamedCoordinates {
  lat: number;
  lon: number;
  name: string;
}

type Destination = string | NamedCoordinates;

const MapView: React.FC = () => {
  const { location: currentLocation, speed, speedLimit, setSpeed } = useLiveLocation();
  const [destination, setDestination] = useState(''); // Search Input
  const [submittedDestination, setSubmittedDestination] = useState<Destination>('');

  // Set Destination by Search Input
  const handleSearch = () => {
    if (!currentLocation) {
      alert('Location access is required for routing.');
      return;
    }
    setSubmittedDestination(destination);
  };

  // Set Destination by Bookmark Selection 
  const handleBookmarkSelect = (destinationObj: NamedCoordinates) => {
    setSubmittedDestination(destinationObj);
  };

  return (
    <div className="map-view">
      <SearchBar
        onSearch={handleSearch}
        setDestination={setDestination}
        destination={destination}
      />

      <BookmarkList onSelect={handleBookmarkSelect} />

      <UserMenu />

      <RouteMap
        currentLocation={currentLocation}
        destination={submittedDestination}
      />

      {speed !== null && (
        <SpeedDisplay
          speed={speed}
          speedLimit={speedLimit ?? undefined}
          onClick={() => setSpeed(random.normal(14, 5)())} // This is a prototype-only feature to test speed alerts
        />
      )}
    </div>
  );
};

export default MapView;
