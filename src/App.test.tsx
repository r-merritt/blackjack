import React from 'react';
import { waitFor } from '@testing-library/dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// lot more tests that could/should be done here

test('renders Blackjack', () => {
  render(<App />);
  const linkElement = screen.getByText(/Blackjack/i);
  expect(linkElement).toBeInTheDocument();
});

test('start button is initially visible', () => {
  render(<App />);
  const startButton = screen.getByText('Start');
  expect(startButton).toBeInTheDocument();
});

test('restart button is not initially visible', () => {
  render(<App />);
  const restartButton = screen.queryByText('Restart');
  expect(restartButton).toBeNull();
});

test('restart button is visible after game start', async () => {
  render(<App />);

  userEvent.click(screen.getByText('Start'));

  await waitFor(() => {
    const restartButton = screen.getByText('Restart');
    expect(restartButton).toBeInTheDocument();
  });
});