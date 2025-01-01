import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { PropertySubmission } from '../../src/pages/PropertySubmission';
import { createProperty, updateProperty, getProperty } from '../../src/api/propertyService';

// Mock react-router-dom
const mockNavigate = jest.fn();
const mockParams: { id?: string } = {};
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

// Mock property data
const mockPropertyData = {
  name: 'Test Villa',
  description: 'Test Description',
  location: {
    city: 'Montego Bay',
    parish: 'St. James',
    coordinates: { lat: 0, lng: 0 },
  },
  type: 'villa',
  pricePerNight: 100,
  currency: 'USD',
  amenities: ['WiFi'],
};

// Mock propertyService
jest.mock('../../src/api/propertyService', () => ({
  createProperty: jest.fn(() => Promise.resolve()),
  updateProperty: jest.fn(() => Promise.resolve()),
  getProperty: jest.fn(() => Promise.resolve({
    name: 'Test Villa',
    description: 'Test Description',
    location: {
      city: 'Montego Bay',
      parish: 'St. James',
      coordinates: { lat: 0, lng: 0 },
    },
    type: 'villa',
    pricePerNight: 100,
    currency: 'USD',
    amenities: ['WiFi'],
  })),
}));

describe('PropertySubmission', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockParams.id = undefined;
    (createProperty as jest.Mock).mockClear();
    (updateProperty as jest.Mock).mockClear();
    (getProperty as jest.Mock).mockClear();
  });

  it('renders initial step with name and description fields', async () => {
    render(<PropertySubmission />);
    
    expect(screen.getByRole('heading', { name: /situation/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/property name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
  });

  it('shows progress bar with all SPIN steps', () => {
    render(<PropertySubmission />);
    
    const steps = screen.getAllByRole('generic', { name: '' }).filter(el => 
      el.className.includes('progressStep')
    );
    expect(steps).toHaveLength(4);
    expect(steps[0]).toHaveTextContent(/situation/i);
    expect(steps[1]).toHaveTextContent(/problem/i);
    expect(steps[2]).toHaveTextContent(/implication/i);
    expect(steps[3]).toHaveTextContent(/need-payoff/i);
  });

  it('navigates through steps when clicking next/previous', async () => {
    render(<PropertySubmission />);
    
    // Fill required fields in first step
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/property name/i), 'Test Villa');
      await userEvent.type(screen.getByLabelText(/description/i), 'Test Description');
      await userEvent.type(screen.getByLabelText(/city/i), 'Montego Bay');
    });
    
    // Move to Problem step
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
    });
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /problem/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/price per night/i)).toBeInTheDocument();
    });
    
    // Move back to Situation step
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /previous/i }));
    });
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /situation/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/property name/i)).toBeInTheDocument();
    });
  });

  it('handles form input changes', async () => {
    render(<PropertySubmission />);
    
    const nameInput = screen.getByLabelText(/property name/i) as HTMLInputElement;
    await act(async () => {
      await userEvent.type(nameInput, 'Test Villa');
    });
    expect(nameInput.value).toBe('Test Villa');
    
    const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
    await act(async () => {
      await userEvent.type(descriptionInput, 'Test Description');
    });
    expect(descriptionInput.value).toBe('Test Description');
  });

  it('shows validation errors when trying to proceed without required fields', async () => {
    render(<PropertySubmission />);
    
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
    });
    
    expect(screen.getByText(/property name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    expect(screen.getByText(/city is required/i)).toBeInTheDocument();
  });

  it('handles amenity toggles', async () => {
    render(<PropertySubmission />);
    
    // Fill required fields in first step
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/property name/i), 'Test Villa');
      await userEvent.type(screen.getByLabelText(/description/i), 'Test Description');
      await userEvent.type(screen.getByLabelText(/city/i), 'Montego Bay');
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
    });
    
    // Navigate to amenities step
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/price per night/i), '100');
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
    });
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /implication/i })).toBeInTheDocument();
    });
    
    const wifiCheckbox = screen.getByRole('checkbox', { name: /wifi/i }) as HTMLInputElement;
    await act(async () => {
      await userEvent.click(wifiCheckbox);
    });
    expect(wifiCheckbox).toBeChecked();
    
    await act(async () => {
      await userEvent.click(wifiCheckbox);
    });
    expect(wifiCheckbox).not.toBeChecked();
  });

  it('shows edit mode when id is provided', async () => {
    mockParams.id = '123';
    render(<PropertySubmission />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /edit property/i })).toBeInTheDocument();
    });
    
    expect(getProperty).toHaveBeenCalledWith('123');
  });

  it('handles form submission', async () => {
    render(<PropertySubmission />);
    
    // Fill out form
    await act(async () => {
      // Step 1: Situation
      await userEvent.type(screen.getByLabelText(/property name/i), 'Test Villa');
      await userEvent.type(screen.getByLabelText(/description/i), 'Test Description');
      await userEvent.type(screen.getByLabelText(/city/i), 'Montego Bay');
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
    });
    
    // Step 2: Problem
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /problem/i })).toBeInTheDocument();
    });
    
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/price per night/i), '100');
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
    });
    
    // Step 3: Implication
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /implication/i })).toBeInTheDocument();
    });
    
    await act(async () => {
      const wifiCheckbox = screen.getByRole('checkbox', { name: /wifi/i });
      await userEvent.click(wifiCheckbox);
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
    });
    
    // Step 4: Need-Payoff
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /need-payoff/i })).toBeInTheDocument();
    });
    
    // Upload image
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    await act(async () => {
      const input = screen.getByLabelText(/property images/i);
      await userEvent.upload(input, file);
      await userEvent.click(screen.getByRole('button', { name: /submit property/i }));
    });
    
    await waitFor(() => {
      expect(createProperty).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/host');
    });
  });

  it('handles form submission in edit mode', async () => {
    mockParams.id = '123';
    render(<PropertySubmission />);
    
    // Wait for property data to load
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /edit property/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/property name/i)).toHaveValue('Test Villa');
    });
    
    // Fill required fields
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/description/i), 'Test Description');
    });
    
    // Navigate through steps
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
    });
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /problem/i })).toBeInTheDocument();
    });
    
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
    });
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /implication/i })).toBeInTheDocument();
    });
    
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
    });
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /need-payoff/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });
    
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
    });
    
    await waitFor(() => {
      expect(updateProperty).toHaveBeenCalledWith('123', expect.any(Object));
      expect(mockNavigate).toHaveBeenCalledWith('/host');
    });
  });
});
