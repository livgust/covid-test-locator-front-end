import React from 'react';
import {render, screen} from '@testing-library/react';
import AddReport from '../AddReport';
import {searchPlaces} from '../api';
import {Place} from '../types';

jest.mock('../api');
jest.mock('date-fns');

const onClose = () => {};

beforeAll(() => {
  (searchPlaces as jest.Mock).mockImplementation(() =>
    Promise.resolve({
      results: [
        {
          geometry: {
            location: {lat: -33.8587323, lng: 151.2100055},
            viewport: {
              northeast: {lat: -33.85739817010727, lng: 151.2112278798927},
              southwest: {lat: -33.86009782989272, lng: 151.2085282201073},
            },
          },
          icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png',
          icon_background_color: '#FF9E67',
          icon_mask_base_uri:
            'https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet',
          name: 'Cruise Bar',
          place_id: 'ChIJi6C1MxquEmsR9-c-3O48ykI',
          vicinity: '123 Easy Street, New York',
        },
      ],
    })
  );
});

it('shows location search if no place is passed in', () => {
  render(<AddReport open onClose={onClose} />);
  expect(screen.queryByText('Search')).toBeInTheDocument();
});

it('has expected modal copy & fields after search is completed', () => {
  render(<AddReport open onClose={onClose} place={{} as Place} />);
  expect(screen.queryByText('Add New Report')).toBeInTheDocument();
  expect(screen.queryByLabelText('Tests available')).toBeInTheDocument();
  expect(screen.queryByLabelText('No tests available')).toBeInTheDocument();
  expect(screen.queryByLabelText('Limit per customer')).toBeInTheDocument();
  expect(screen.queryByText('Submit')).toBeInTheDocument();
});
