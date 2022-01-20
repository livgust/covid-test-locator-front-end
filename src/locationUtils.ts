export const canGetBrowserLocation = async (): Promise<boolean> => {
  return navigator.permissions
    ?.query({name: 'geolocation'})
    .then((status: PermissionStatus) => status.state === 'granted');
};

export const getBrowserLocation = async (): Promise<userLocationType> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(geo => {
      const {latitude, longitude} = geo.coords;
      resolve({latitude, longitude});
    }, reject);
  });
};

export type userLocationType = {latitude: number; longitude: number};
