export type Point = {
  x: number;
  y: number;
  z: number;
};

export type Star = {
  absMag: number;
  diameterSun: number;
  name: string;
  posParsec: Point;
  starClass: string;
  starType: string;
};

export type Stc = {
  absMag: number;
  declinationDeg: number;
  distanceLy: number;
  id: number;
  name: string;
  radiusKm: number;
  rightAscensionDeg: number;
  spectralType: string;
};

function norm2d(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

function norm3d(x: number, y: number, z: number): number {
  return Math.sqrt(x * x + y * y + z * z);
}

function radToDeg(x: number): number {
  return 180 * x / Math.PI;
}

function pointAdd(a: Point, b: Point): Point {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  };
}

function pointNorm(point: Point): number {
  return norm3d(point.x, point.y, point.z);
}

function pointScale(point: Point, scale: number): Point {
  return {
    x: point.x * scale,
    y: point.y * scale,
    z: point.z * scale,
  };
}

export function starToStc(star: Star, id: number): Stc {
  if (id < 0 || id > 300e3) {
    throw new Error(`bad id: ${id}`);
  }
  if (star.name.includes('"')) {
    throw new Error(`bad name: ${star.name}`);
  }
  const spectralType = star.starClass + star.starType;
  if (spectralType.includes('"')) {
    throw new Error(`bad spectralType: ${spectralType}`);
  }
  const offsetLy = { x: 0, y: 0, z: 25e3 } as Point;
  const pos = pointAdd(pointScale(star.posParsec, parsec.ly), offsetLy);
  const planarDistance = norm2d(pos.x, pos.y);
  const declinationRad = Math.atan(pos.z / planarDistance);
  const rightAscensionRad = Math.atan2(pos.y, pos.x);
  return {
    absMag: star.absMag,
    declinationDeg: radToDeg(declinationRad),
    distanceLy: pointNorm(pos),
    id: id + 300e3,
    name: star.name,
    radiusKm: star.diameterSun * sun.diameterKm / 2,
    rightAscensionDeg: (radToDeg(rightAscensionRad) + 360) % 360,
    spectralType: star.starClass + star.starType,
  };
}

export function stcToString(stc: Stc): string {
  return [
    `${stc.id} "${stc.name}" {`,
    `  RA ${stc.rightAscensionDeg}`,
    `  Dec ${stc.declinationDeg}`,
    `  Distance ${stc.distanceLy}`,
    `  SpectralType "${stc.spectralType}"`,
    `  AbsMag ${stc.absMag}`,
    `  Radius ${stc.radiusKm}`,
    "}",
  ].join("\n");
}

const parsec = {
  ly: 3.26156,
};

const sun = {
  diameterKm: 1.3927e6,
};
