import {Place} from '../types';

export const getPlaces = async (): Promise<Place[]> => {
  const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/places`);
  return response.json();
};

export const verifyReport = async (reportId: number): Promise<void> => {
  await fetch(`${process.env.REACT_APP_SERVER_URL}/reportValidation`, {
    method: 'POST',
    body: JSON.stringify({
      reportId,
      // TODO: add username and auth
    }),
  });
  return;
};
