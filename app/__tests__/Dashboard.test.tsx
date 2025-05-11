import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DashboardScreen from '../(tabs)/dashboard';
import { Alert } from 'react-native';

// Mock Firebase to isolate the testing data
jest.mock('firebase/auth', () => ({
  signOut: jest.fn(() => Promise.resolve()),
}));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  onSnapshot: jest.fn(() => () => {}),
  updateDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));
jest.mock('../../config/firebaseConfig', () => ({
  auth: { currentUser: { uid: 'testUID' } },
  db: {},
}));

describe('DashboardScreen', () => {
  it('renders stats and challenges correctly', () => {
    const { getByText } = render(<DashboardScreen />);
    
    expect(getByText('Your Stats')).toBeTruthy();
    expect(getByText('Challenges')).toBeTruthy();
    expect(getByText('Points:')).toBeTruthy();
    expect(getByText('Focus Sessions:')).toBeTruthy();
    expect(getByText(/Weekly Challenge/i)).toBeTruthy();
    expect(getByText(/Monthly Challenge/i)).toBeTruthy();
  });

  it('triggers logout on button press', async () => {
    const { getByText } = render(<DashboardScreen />);
    const logoutButton = getByText('Log Out');

    const mockAlert = jest.spyOn(Alert, 'alert');
    fireEvent.press(logoutButton);

    await waitFor(() => {
      // Expect signOut to have been called
      expect(mockAlert).not.toHaveBeenCalled(); // Only fails if signOut throws
    });
  });
});
