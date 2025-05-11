import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TaskManagerScreen from '../(tabs)/task';

// mocks the database's fucntions to fully isolate and control the testing environment
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  increment: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
  setDoc: jest.fn(),
  writeBatch: jest.fn(() => ({
    update: jest.fn(),
    commit: jest.fn(),
  })),
  onSnapshot: jest.fn((_query, cb) => {
    cb({ docs: [] });
    return () => {}; // unsubscribe
  }),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
}));

jest.mock('../../config/firebaseConfig', () => ({
  auth: { currentUser: { uid: 'testUID' } },
  db: {},
}));

describe('TaskManagerScreen', () => {
  it('renders the header and category buttons', () => {
    const { getByText } = render(<TaskManagerScreen />);
    expect(getByText('Task Manager')).toBeTruthy();
    expect(getByText('Daily')).toBeTruthy();
    expect(getByText('Weekly')).toBeTruthy();
    expect(getByText('Monthly')).toBeTruthy();
  });

  it('shows modal when pressing "+ Add Task"', () => {
    const { getByText, getByPlaceholderText } = render(<TaskManagerScreen />);
    fireEvent.press(getByText('+ Add Task'));
    expect(getByPlaceholderText('Task Title')).toBeTruthy();
  });

  it('displays validation error if task title is missing', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<TaskManagerScreen />);
    fireEvent.press(getByText('+ Add Task'));

    const descInput = getByPlaceholderText('Task Description');
    fireEvent.changeText(descInput, 'Test description');

    fireEvent.press(getByText('Save Task'));

    await waitFor(() => {
      expect(queryByText(/Task title is required!/i)).toBeTruthy();
    });
  });

  it('switches categories when pressed', () => {
    const { getByText } = render(<TaskManagerScreen />);
    fireEvent.press(getByText('Weekly'));
    expect(getByText('Weekly')).toBeTruthy();

    fireEvent.press(getByText('Monthly'));
    expect(getByText('Monthly')).toBeTruthy();
  });

  it('renders empty list message', () => {
    const { getByText } = render(<TaskManagerScreen />);
    expect(getByText('No tasks available')).toBeTruthy();
  });
});
