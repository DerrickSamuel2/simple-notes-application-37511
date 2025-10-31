import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app chrome elements', () => {
  render(<App />);
  expect(screen.getByText(/Simple Notes/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
  // Sidebar brand and new note button
  expect(screen.getByText('Notes')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /\+ New Note/i })).toBeInTheDocument();
  // Search input
  expect(screen.getByRole('textbox', { name: /search notes/i })).toBeInTheDocument();
});
