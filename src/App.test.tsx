import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders login page', () => {
  const { getByText } = render(<App />);
  // eslint-disable-next-line testing-library/prefer-screen-queries
  const loginElement = getByText(/login/i);
  expect(loginElement).toBeInTheDocument();
});

