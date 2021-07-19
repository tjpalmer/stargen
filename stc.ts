export type Star = {
  diameter: number;
  name: string;
  starClass: string;
  starType: string;
  x: number;
  y: number;
  z: number;
};

export type Stc = {
  absMag: number;
  declination: number;
  distance: number;
  id: number;
  name: string;
  radius: number;
  rightAscension: number;
  spectralType: string;
};

export function starToStc(star: Star) {
  const center = { declination: 90, distance: 25e3, rightAscension: 0 };
  //
}
