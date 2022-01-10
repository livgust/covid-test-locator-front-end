import React from 'react';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import LocationSearch from './LocationSearch';
import {addPlace, searchPlaces} from '../api';

jest.mock('../api');

const fakeResults = [
  {
    location: {lat: -33.8587323, long: 151.2100055},
    name: 'Cruise Bar',
    googlePlaceId: 'ChIJi6C1MxquEmsR9-c-3O48ykI',
    vicinity: '123 Easy Street, New York',
  },
];

beforeEach(() => {
  (searchPlaces as jest.Mock).mockImplementation(() =>
    Promise.resolve({results: []})
  );
});

it('starts with a search', () => {
  expect.assertions(2);
  render(<LocationSearch latitude={123.456} longitude={-100.123} />);
  expect(screen.getByLabelText('Search for location')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Search for location'), {
    target: {value: 'cvs pharmacy'},
  });
  act(() => screen.getByText('Search').click());
  expect(searchPlaces).toHaveBeenCalledWith({
    latitude: 123.456,
    longitude: -100.123,
    keyword: 'cvs pharmacy',
  });
});

it('shows results', async () => {
  expect.assertions(5);
  (searchPlaces as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      results: fakeResults,
    })
  );
  render(<LocationSearch latitude={123.456} longitude={-100.123} />);
  expect(screen.getByLabelText('Search for location')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Search for location'), {
    target: {value: 'cvs pharmacy'},
  });
  act(() => {
    screen.getByText('Search').click();
  });
  await waitFor(() => expect(searchPlaces).toHaveBeenCalled());
  expect(screen.queryByText('Cruise Bar')).toBeInTheDocument();
  expect(screen.queryByText('123 Easy Street, New York')).toBeInTheDocument();
  expect(screen.queryByText('Select')).toBeInTheDocument();
});

describe('adds location only if ID is absent', () => {
  it('adds location', async () => {
    expect.assertions(2);
    (searchPlaces as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        results: fakeResults,
      })
    );
    render(<LocationSearch latitude={123.456} longitude={-100.123} />);
    fireEvent.change(screen.getByLabelText('Search for location'), {
      target: {value: 'cvs pharmacy'},
    });
    act(() => {
      screen.getByText('Search').click();
    });
    await waitFor(() => expect(searchPlaces).toHaveBeenCalled());
    screen.getByText('Select').click();
    expect(addPlace).toHaveBeenCalled();
  });

  it('does not add location', async () => {
    expect.assertions(2);
    (searchPlaces as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        results: [{...fakeResults[0], id: 123}],
      })
    );
    render(<LocationSearch latitude={123.456} longitude={-100.123} />);
    fireEvent.change(screen.getByLabelText('Search for location'), {
      target: {value: 'cvs pharmacy'},
    });
    act(() => {
      screen.getByText('Search').click();
    });
    await waitFor(() => expect(searchPlaces).toHaveBeenCalled());
    screen.getByText('Select').click();
    expect(addPlace).not.toHaveBeenCalled();
  });
});

it('passes place info back up the chain', async () => {
  expect.assertions(2);
  (searchPlaces as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      results: fakeResults,
    })
  );
  const returnFn = jest.fn();
  render(
    <LocationSearch
      latitude={123.456}
      longitude={-100.123}
      onPlaceSelect={returnFn}
    />
  );
  fireEvent.change(screen.getByLabelText('Search for location'), {
    target: {value: 'cvs pharmacy'},
  });
  act(() => {
    screen.getByText('Search').click();
  });
  await waitFor(() => expect(searchPlaces).toHaveBeenCalled());
  screen.getByText('Select').click();
  expect(returnFn).toHaveBeenCalledWith({
    name: 'Cruise Bar',
    googlePlaceId: 'ChIJi6C1MxquEmsR9-c-3O48ykI',
    vicinity: '123 Easy Street, New York',
    location: {lat: -33.8587323, long: 151.2100055},
  });
});
