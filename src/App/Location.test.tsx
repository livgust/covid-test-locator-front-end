import React from 'react';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {geocode, reverseGeocode} from '../api';
import {getBrowserLocation, canGetBrowserLocation} from '../locationUtils';
import Location from './Location';

jest.mock('../api');
jest.mock('../locationUtils');

beforeEach(() => {
  (geocode as jest.Mock).mockImplementation(() =>
    Promise.resolve({
      longitude: 1,
      latitude: 1,
      location: 'The promised land',
    })
  );
  (reverseGeocode as jest.Mock).mockImplementation(() =>
    Promise.resolve('Atlantis')
  );
  (getBrowserLocation as jest.Mock).mockImplementation(() =>
    Promise.resolve({
      latitude: 1,
      longitude: 1,
    })
  );
  (canGetBrowserLocation as jest.Mock).mockImplementation(() =>
    Promise.resolve(false)
  );
});

it('does reverse geocode if you click MyLocation', async () => {
  (canGetBrowserLocation as jest.Mock).mockImplementation(() =>
    Promise.resolve(true)
  );
  render(<Location onUserLocationSet={() => {}} />);
  const elem = screen.getByTestId('MyLocationIcon').closest('div');
  elem?.click();
  act(() => {
    screen.getByTestId('MyLocationIcon').closest('div')?.click();
  });
  await waitFor(() => expect(reverseGeocode as jest.Mock).toHaveBeenCalled());
});

it('geocodes if you put in a location', () => {
  render(<Location onUserLocationSet={() => {}} />);
  const input = screen.getByLabelText('My location') as HTMLInputElement;
  fireEvent.change(input, {target: {value: 'something'}});
  act(() => screen.getByText('Set').click());
  expect(geocode).toHaveBeenCalled();
});
