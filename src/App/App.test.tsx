import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import App from '../App';
import {getPlaces} from '../api';
import PlacesList from '../PlacesList';

jest.mock('../api');
jest.mock('../PlacesList');

beforeEach(() => {
  (PlacesList as jest.Mock).mockImplementation(
    jest.requireActual('../PlacesList').default
  );
});

describe('Initialization logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // default mocks
    (getPlaces as jest.Mock).mockImplementation(async () => []);
  });
  it('fetches reports before rendering', async () => {
    render(<App />);
    await waitFor(() => expect(getPlaces).toHaveBeenCalled());
  });

  it('shows loading spinner before reports are gathered and removes it after', async () => {
    expect.assertions(3);
    (getPlaces as jest.Mock).mockImplementationOnce(async () => {
      expect(screen.queryByRole('progressbar')).toBeInTheDocument();
      return [];
    });
    render(<App />);
    await waitFor(() => expect(getPlaces).toHaveBeenCalled());
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('passes reports to list component', async () => {
    let placesListPlacesProp: any;
    (PlacesList as jest.Mock).mockImplementation((props: any) => {
      placesListPlacesProp = props.places;
      return <></>;
    });
    (getPlaces as jest.Mock).mockImplementationOnce(async () => {
      return ['report 1', 'report 2'];
    });
    render(<App />);
    await waitFor(() => expect(getPlaces).toHaveBeenCalled());
    await waitFor(() =>
      expect(placesListPlacesProp).toEqual(['report 1', 'report 2'])
    );
  });
});
