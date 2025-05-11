import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MindfulnessScreen from '../(tabs)/mindful';

jest.mock('react-native-signature-canvas', () => 'SignatureCanvas');

describe('MindfulnessScreen', () => {
  it('renders all section headers', () => {
    const { getByText } = render(<MindfulnessScreen />);
    expect(getByText('Mindful Breathing')).toBeTruthy();
    expect(getByText('Grounding Techniques')).toBeTruthy();
    expect(getByText('Journaling')).toBeTruthy();
    expect(getByText('Creative Expression')).toBeTruthy();
  });

  it('expands and collapses the Mindful Breathing section', () => {
    const { getByText, queryByText } = render(<MindfulnessScreen />);
    const header = getByText('Mindful Breathing');

    // Initially collapsed
    expect(queryByText(/Follow the dot around the box/i)).toBeNull();

    fireEvent.press(header);
    expect(getByText(/Follow the dot around the box/i)).toBeTruthy();

    fireEvent.press(header);
    expect(queryByText(/Follow the dot around the box/i)).toBeNull();
  });

  it('allows journaling input and saves an entry', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<MindfulnessScreen />);

    fireEvent.press(getByText('Journaling'));

    const input = getByPlaceholderText('What are you grateful for?');
    fireEvent.changeText(input, 'Grateful for sunlight');

    fireEvent.press(getByText('Save Entry'));

    await waitFor(() => {
      expect(queryByText('• Grateful for sunlight')).toBeTruthy();
    });
  });

  it('expands Grounding and Creative sections without error', () => {
    const { getByText } = render(<MindfulnessScreen />);
    fireEvent.press(getByText('Grounding Techniques'));
    fireEvent.press(getByText('Creative Expression'));
    expect(getByText(/Use your senses to ground yourself/i)).toBeTruthy();
    expect(getByText(/drawing, doodling, or free-writing/i)).toBeTruthy();
  });
});
