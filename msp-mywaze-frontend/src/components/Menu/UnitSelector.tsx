import React, { useEffect, useState } from 'react';
import './UnitSelector.css';
import { useAuth } from '../../context/AuthContext';

type UnitType = 'km/h' | 'mph';

const UnitSelector: React.FC = () => {
  const { credentials, updatePreference } = useAuth();
  const [selected, setSelected] = useState<UnitType>('km/h');

  useEffect(() => {
    const initial = (credentials?.preferences?.unit_type || 'km/h') as UnitType;
    setSelected(initial);
  }, [credentials]);

  const handleSelect = async (type: UnitType) => {
    if (!credentials?.email) {
      console.error('No user email available');
      return;
    }

    setSelected(type);

    try {
      await fetch('http://localhost:3000/api/preferences/set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          setting: 'unit_type',
          value: type,
        }),
      });
      updatePreference('unit_type', type); //locally update the preference
      console.log('Unit type preference updated to', type);
    } catch (error) {
      console.error('Failed to update unit type preference:', error);
    }
  };

  return (
    <>
      <div><b>Change Units</b></div>
      <div className="unit-selector">
        <div
          className={`unit-option ${selected === 'km/h' ? 'selected' : ''}`}
          onClick={() => handleSelect('km/h')}
        >
          <span className="vehicle-label">km/h</span>
        </div>
        <div
          className={`unit-option ${selected === 'mph' ? 'selected' : ''}`}
          onClick={() => handleSelect('mph')}
        >
          <span className="vehicle-label">mph</span>
        </div>
      </div>
    </>
  );
};

export default UnitSelector;