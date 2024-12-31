import React, { useState } from 'react';

interface UserPreferencesFormProps {
  onSubmit: (preferences: {
    location: string;
    budget: number;
    amenities: string[];
    travelDates: [Date, Date];
  }) => void;
}

const UserPreferencesForm: React.FC<UserPreferencesFormProps> = ({ onSubmit }) => {
  const [location, setLocation] = useState('Montego Bay');
  const [budget, setBudget] = useState(200);
  const [amenities, setAmenities] = useState<string[]>(['pool', 'wifi']);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      location,
      budget,
      amenities,
      travelDates: [startDate, endDate]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="preferences-form">
      <div className="form-group">
        <label>Location:</label>
        <select 
          value={location} 
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="Montego Bay">Montego Bay</option>
          <option value="Kingston">Kingston</option>
          <option value="Negril">Negril</option>
          <option value="Ocho Rios">Ocho Rios</option>
        </select>
      </div>

      <div className="form-group">
        <label>Budget per night (USD):</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          min="50"
          max="1000"
        />
      </div>

      <div className="form-group">
        <label>Amenities:</label>
        <div className="amenities-checkboxes">
          <label>
            <input
              type="checkbox"
              checked={amenities.includes('pool')}
              onChange={(e) => 
                setAmenities(e.target.checked 
                  ? [...amenities, 'pool'] 
                  : amenities.filter(a => a !== 'pool')
                )
              }
            />
            Pool
          </label>
          <label>
            <input
              type="checkbox"
              checked={amenities.includes('wifi')}
              onChange={(e) => 
                setAmenities(e.target.checked 
                  ? [...amenities, 'wifi'] 
                  : amenities.filter(a => a !== 'wifi')
                )
              }
            />
            WiFi
          </label>
          <label>
            <input
              type="checkbox"
              checked={amenities.includes('ac')}
              onChange={(e) => 
                setAmenities(e.target.checked 
                  ? [...amenities, 'ac'] 
                  : amenities.filter(a => a !== 'ac')
                )
              }
            />
            Air Conditioning
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Travel Dates:</label>
        <div className="date-inputs">
          <input
            type="date"
            value={startDate.toISOString().split('T')[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
          <span>to</span>
          <input
            type="date"
            value={endDate.toISOString().split('T')[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </div>
      </div>

      <button type="submit">Update Preferences</button>
    </form>
  );
};

export default UserPreferencesForm;
