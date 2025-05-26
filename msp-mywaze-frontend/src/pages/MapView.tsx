import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import './mapView.css';
import SearchBar from '../components/Input/SearchBar';
import RouteMap from '../components/Map/RouteMap';
import UserMenu from '../components/Menu/UserMenu';
import { useAuth } from '../context/AuthContext'; import BookmarkList from '../components/BookmarkList/BookmarkList';
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
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [speed, setSpeed] = useState<number | null>(null); // GPS-based speed
  const [simulatedSpeed, setSimulatedSpeed] = useState<number | null>(null); // Simulated speed on click
  const [destination, setDestination] = useState('');
  const [submittedDestination, setSubmittedDestination] = useState('');

  const { credentials } = useAuth();
  const unitType = credentials?.preferences?.unit_type || 'km/h';

  // Set Destination by Search Input
  const handleSearch = () => {
    if (!currentLocation) {
      alert('Location access is required for routing.');
      return;
    }
    setSubmittedDestination(destination);
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setCurrentLocation(coords);

        if (pos.coords.speed !== null) {
          setSpeed(pos.coords.speed);
        } else {
          setSpeed(13); // default speed for testing (m/s)
        }
      },
      (err) => {
        if (err.code !== 2) { // Ignore POSITION_UNAVAILABLE
          console.error('Error watching location:', err);
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const activeSpeed = simulatedSpeed ?? speed ?? 0;

  const speedInUnits =
    unitType === 'mph'
      ? (activeSpeed * 2.23694).toFixed(1)
      : (activeSpeed * 3.6).toFixed(1);

  const speedUnitLabel = unitType;

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

      {/* Speed display */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          fontSize: '14px',
          color: parseFloat(speedInUnits) > 50 ? 'red' : '#333',
          zIndex: 1000,
          cursor: 'pointer',
        }}
        onClick={() => setSimulatedSpeed(random.normal(14, 5)())}
      >
        Speed: {speedInUnits} {speedUnitLabel}
      </div>
    </div>
  );
};

export default MapView;
