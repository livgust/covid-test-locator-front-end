import {Place, Report} from '../types';

export const getPlaces = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): Promise<Place[]> => {
  const response = await fetch(
    `${process.env.REACT_APP_SERVER_URL}/places?latitude=${latitude}&longitude=${longitude}`
  );
  return response.json();
};

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

export const verifyReport = async (report: Report): Promise<void> => {
  await fetch(
    `${process.env.REACT_APP_SERVER_URL}/places/${report.placeId}/reports/${report.id}/reportValidations`,
    {
      method: 'POST',
      body: JSON.stringify({
        reportId: report.id,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  return;
};

export const addReport = async (report: Report): Promise<void> => {
  await fetch(
    `${process.env.REACT_APP_SERVER_URL}/places/${report.placeId}/reports`,
    {
      method: 'POST',
      body: JSON.stringify(report),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  return;
};
