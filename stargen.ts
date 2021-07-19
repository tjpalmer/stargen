import { readCSVObjects } from "https://deno.land/x/csv@v0.5.1/mod.ts";
import { Star, starToStc } from "./stc.ts";

type CsvStar = {
  "Absolute Mag": string;
  Class: string;
  Diameter: string;
  "Star Name": string;
  Type: string;
  X: string;
  Y: string;
  Z: string;
};

function csvToStar(row: CsvStar): Star {
  return {
    absMag: Number(row["Absolute Mag"]),
    diameterSun: Number(row.Diameter),
    name: row["Star Name"],
    posParsec: {
      x: Number(row.X),
      y: Number(row.Y),
      z: Number(row.Z),
    },
    starClass: row.Class,
    starType: row.Type,
  };
}

async function main() {
  const file = await Deno.open("./starmap.csv");
  try {
    let id = 0;
    for await (const row of readCSVObjects(file)) {
      const star = csvToStar(row as CsvStar);
      const stc = starToStc(star, id += 1);
      console.log(star);
      console.log(stc);
    }
  } finally {
    file.close();
  }
}

main();
