import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import FocusSessionScreen from '../(tabs)/session';

// Mock Firebase to isolate the testing data from the development environment 
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
  increment: jest.fn(),
}));
jest.mock('../../config/firebaseConfig', () => ({
  auth: { currentUser: { uid: 'testUID' } },
  db: {},
}));

describe('FocusSessionScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers(); // control time
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders header and session types', () => {
    const { getByText } = render(<FocusSessionScreen />);
    expect(getByText('Focus Session')).toBeTruthy();
    expect(getByText('Single')).toBeTruthy();
    expect(getByText('Loop')).toBeTruthy();
  });

  it('switches between Single and Loop session modes', () => {
    const { getByText, queryByText } = render(<FocusSessionScreen />);
    expect(queryByText('Break Time (minutes):')).toBeNull();

    fireEvent.press(getByText('Loop'));

    expect(getByText('Break Time (minutes):')).toBeTruthy();
  });

  it('starts and stops a session timer', () => {
    const { getByText, queryByText } = render(<FocusSessionScreen />);
    fireEvent.press(getByText('Start Session!'));

    expect(queryByText('Start Session!')).toBeNull();
    expect(getByText('Stop Session')).toBeTruthy();

    fireEvent.press(getByText('Stop Session'));

    expect(getByText('Start Session!')).toBeTruthy();
  });

  it('counts down and shows break phase in loop mode', () => {
    const { getByText, queryByText, getByDisplayValue } = render(<FocusSessionScreen />);
    
    fireEvent.press(getByText('Loop'));

    // Set session to 1 second and break to 1 second for fast test
    const sessionInput = getByDisplayValue('90');
    fireEvent.changeText(sessionInput, '0.01'); // ~1 second

    const breakInput = getByDisplayValue('10');
    fireEvent.changeText(breakInput, '0.01');

    fireEvent.press(getByText('Start Session!'));

    // Tick session time
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Tick break time
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(queryByText('Break Time')).toBeTruthy();
  });
});
