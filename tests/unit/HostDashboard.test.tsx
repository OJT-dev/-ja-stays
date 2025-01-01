import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HostDashboard } from '../../src/pages/HostDashboard';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockProperty = {
  id: '1',
  title: 'Beach Villa',
  location: 'Montego Bay',
  price: 250,
  bookings: 5,
  rating: 4.5,
  status: 'active' as const,
};

const mockStats = {
  totalBookings: 10,
  totalRevenue: 2500,
  averageRating: 4.5,
  occupancyRate: 75,
};

// Mock React's useState
const mockUseState = jest.fn();

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: (initial: any) => mockUseState(initial),
}));

describe('HostDashboard', () => {
  beforeEach(() => {
    mockUseState.mockReset();
    mockNavigate.mockReset();
  });

  it('renders dashboard header', () => {
    mockUseState
      .mockReturnValueOnce([{ totalBookings: 0, totalRevenue: 0, averageRating: 0, occupancyRate: 0 }, jest.fn()])
      .mockReturnValueOnce([[], jest.fn()]);

    render(<HostDashboard />);
    expect(screen.getByText('Host Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Add New Property')).toBeInTheDocument();
  });

  it('displays empty state when no properties exist', () => {
    mockUseState
      .mockReturnValueOnce([mockStats, jest.fn()])
      .mockReturnValueOnce([[], jest.fn()]);

    render(<HostDashboard />);
    expect(screen.getByText("You haven't added any properties yet.")).toBeInTheDocument();
    expect(screen.getByText('Add Your First Property')).toBeInTheDocument();
  });

  it('shows all dashboard statistics', () => {
    mockUseState
      .mockReturnValueOnce([mockStats, jest.fn()])
      .mockReturnValueOnce([[], jest.fn()]);

    render(<HostDashboard />);
    
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('$2,500')).toBeInTheDocument();
    expect(screen.getByText('4.5 / 5.0')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders property list when properties exist', () => {
    mockUseState
      .mockReturnValueOnce([mockStats, jest.fn()])
      .mockReturnValueOnce([[mockProperty], jest.fn()]);

    render(<HostDashboard />);
    
    expect(screen.getByText('Beach Villa')).toBeInTheDocument();
    expect(screen.getByText('Location: Montego Bay')).toBeInTheDocument();
    expect(screen.getByText('Price: $250/night')).toBeInTheDocument();
    expect(screen.getByText('Bookings: 5')).toBeInTheDocument();
    expect(screen.getByText('Rating: 4.5/5.0')).toBeInTheDocument();
  });

  it('displays different property statuses correctly', () => {
    const properties = [
      { ...mockProperty, id: '1', status: 'active' as const },
      { ...mockProperty, id: '2', status: 'pending' as const },
      { ...mockProperty, id: '3', status: 'inactive' as const },
    ];

    mockUseState
      .mockReturnValueOnce([mockStats, jest.fn()])
      .mockReturnValueOnce([properties, jest.fn()]);

    render(<HostDashboard />);
    
    const activeStatus = screen.getByText('active');
    const pendingStatus = screen.getByText('pending');
    const inactiveStatus = screen.getByText('inactive');

    expect(activeStatus).toHaveClass('active');
    expect(pendingStatus).toHaveClass('pending');
    expect(inactiveStatus).toHaveClass('inactive');
  });

  it('navigates to add property page when clicking add button', async () => {
    mockUseState
      .mockReturnValueOnce([mockStats, jest.fn()])
      .mockReturnValueOnce([[], jest.fn()]);

    render(<HostDashboard />);
    
    const addButton = screen.getByText('Add New Property');
    await userEvent.click(addButton);

    expect(mockNavigate).toHaveBeenCalledWith('/host/properties/new');
  });

  it('handles property action button clicks with navigation', async () => {
    mockUseState
      .mockReturnValueOnce([mockStats, jest.fn()])
      .mockReturnValueOnce([[mockProperty], jest.fn()]);

    render(<HostDashboard />);
    
    const editButton = screen.getByText('Edit');
    const manageButton = screen.getByText('Manage Bookings');
    const analyticsButton = screen.getByText('View Analytics');

    await userEvent.click(editButton);
    expect(mockNavigate).toHaveBeenCalledWith('/host/properties/1/edit');

    await userEvent.click(manageButton);
    expect(mockNavigate).toHaveBeenCalledWith('/host/properties/1/bookings');

    await userEvent.click(analyticsButton);
    expect(mockNavigate).toHaveBeenCalledWith('/host/properties/1/analytics');
  });
});
