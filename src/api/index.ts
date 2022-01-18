import {Place, Report} from '../types';

/** Returns locations with reports nearby the given location. */
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

/** Returns a list of nearby places matching the search string. */
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

/**
 * @param place
 * @returns Place with ID
 */
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

/**
 * Adds a reportValidation for the given report.
 *
 * @param report
 */
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

/**
 * @param report
 * @returns Report with ID
 */
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

/**
 * Given a location, asks Google to convert it to a lat/long and a pretty string.
 *
 * @param locationString
 * @returns
 */
export const geocode = async (
  locationString: string
): Promise<{latitude: number; longitude: number; formattedAddress: string}> => {
  const response = await fetch(
    `${process.env.REACT_APP_SERVER_URL}/geocode?address=${locationString}`
  );
  return await response.json();
};

/** Given a lat/long, converts to a pretty string. */
export const reverseGeocode = async (location: {
  latitude: number;
  longitude: number;
}): Promise<string> => {
  const response = await fetch(
    `${process.env.REACT_APP_SERVER_URL}/reverseGeocode?latitude=${location.latitude}&longitude=${location.longitude}`
  );
  return (await response.text()) as string;
};
