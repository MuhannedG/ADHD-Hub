import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InfoScreen from '../(tabs)/info';

describe('InfoScreen', () => {
  it('renders all FAQ titles', () => {
    const { getByText } = render(<InfoScreen />);

    const questions = [
      'What is ADHD?',
      'How is ADHD Diagnosed?',
      'What Are The Common Symptoms of ADHD?',
      'What Causes ADHD?',
      'Can Lifestyle Changes Help Manage ADHD Symptoms?',
      'Can adults be diagnosed with ADHD?',
      'How is ADHD Treated?'
    ];

    questions.forEach((title) => {
      expect(getByText(title)).toBeTruthy();
    });
  });

  it('toggles a question when pressed', () => {
    const { getByText, queryByText } = render(<InfoScreen />);

    const questionTitle = getByText('What is ADHD?');

    // Initially, the content should not be visible
    expect(
      queryByText(/ADHD is a neurodevelopmental disorder/i)
    ).toBeNull();

    fireEvent.press(questionTitle);

    // After pressing, the content should now be visible
    expect(
      getByText(/ADHD is a neurodevelopmental disorder/i)
    ).toBeTruthy();

    // Press again to collapse
    fireEvent.press(questionTitle);

    expect(
      queryByText(/ADHD is a neurodevelopmental disorder/i)
    ).toBeNull();
  });
});
