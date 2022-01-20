/* eslint-disable no-restricted-properties */
import React, {useEffect} from 'react';
import {act, render, screen, waitFor} from '@testing-library/react';
import {getPlaces} from '../api';
import App from '../App';
import PlacesList from '../PlacesList';
import Location from './Location';

const useEffectMock = (
  effect: React.EffectCallback,
  deps?: React.DependencyList | undefined
) => useEffect(effect, deps);

jest.mock('./Location');
jest.mock('../api');
jest.mock('../PlacesList');

beforeEach(() => {
  (PlacesList as jest.Mock).mockImplementation(
    jest.requireActual('../PlacesList').default
  );
  (Location as jest.Mock).mockImplementation((props: any) => {
    useEffectMock(() => {
      props.onUserLocationSet({latitude: 1, longitude: 1});
    }, []);
    return <></>;
  });
  (getPlaces as jest.Mock).mockImplementation(() => Promise.resolve([]));
});

describe('Initialization logic', () => {
  it('fetches reports before rendering', async () => {
    expect.assertions(1);
    render(<App />);
    await waitFor(() => expect(getPlaces).toHaveBeenCalled());
  });

  it.skip('shows loading spinner before reports are gathered and removes it after', async () => {
    expect.assertions(3);
    (getPlaces as jest.Mock).mockImplementation(async () => {
      await waitFor(() =>
        expect(screen.queryByRole('progressbar')).toBeInTheDocument()
      );
      return [];
    });
    render(<App />);
    await waitFor(() => expect(getPlaces).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    );
  });

  it('passes reports to list component', async () => {
    let placesListPlacesProp: any;
    (PlacesList as jest.Mock).mockImplementation((props: any) => {
      placesListPlacesProp = props.places;
      return <></>;
    });
    (getPlaces as jest.Mock).mockImplementation(async () => {
      return ['report 1', 'report 2'];
    });
    act(() => {
      render(<App />);
    });
    await waitFor(() => expect(getPlaces).toHaveBeenCalled());
    await waitFor(() =>
      expect(placesListPlacesProp).toEqual(['report 1', 'report 2'])
    );
  });
});
