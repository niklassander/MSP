import React, { useState, useRef, useEffect } from 'react';
import './UserMenu.css';
import { useNavigate } from 'react-router-dom';
import LogoutItem from './LogoutItem';
import VehicleTypeSelector from './VehicleTypeSelector';
import UnitSelector from './UnitSelector';

const UserMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setOpen(prev => !prev);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuItemClick = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button className="user-menu-button" onClick={toggleMenu}>
        <img src="/user-settings.svg" alt="Settings" className="user-menu-icon" />
      </button>

      {open && (
        <div className="user-menu-dropdown">
          <div className="user-menu-item nohover"><LogoutItem /></div>
          <hr></hr>
          <div className="user-menu-item nohover">
            <VehicleTypeSelector />
          </div>
          <div className="user-menu-item nohover">
            <UnitSelector />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;