import {Place, Report} from '../types';

export const getPlaces = async (): Promise<Place[]> => {
  const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/places`);
  return response.json();
};

export const addPlace = async (place: Place): Promise<Place> => {
  const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/places`, {
    method: 'POST',
    body: JSON.stringify(place),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response.json() as Promise<Place>;
};

export const verifyReport = async (reportId: number): Promise<void> => {
  await fetch(`${process.env.REACT_APP_SERVER_URL}/reportValidations`, {
    method: 'POST',
    body: JSON.stringify({
      reportId,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return;
};

export const addReport = async (report: Report): Promise<void> => {
  await fetch(`${process.env.REACT_APP_SERVER_URL}/reports`, {
    method: 'POST',
    body: JSON.stringify(report),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return;
};

// https://developers.google.com/maps/documentation/places/web-service/search-nearby#PlaceSearchRequests
// on server-side, map to Place with ID & report(s) if we have it, without ID if we don't.
export const searchPlaces = async ({
  latitude,
  longitude,
  keyword,
}: {
  latitude: number;
  longitude: number;
  keyword: string;
}): Promise<Place[]> => {
  const body = new URLSearchParams({
    location: `${latitude},${longitude}`,
    keyword,
  }).toString();
  const response = await fetch(
    `${process.env.REACT_APP_SERVER_URL}/searchGooglePlaces?${body}`
  );
  return response.json();
};
