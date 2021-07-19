import { readCSVObjects } from "https://deno.land/x/csv@v0.5.1/mod.ts";
import { Star, starToStc } from "./stc.ts";

type CsvStar = {
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
    diameter: Number(row.Diameter),
    name: row["Star Name"],
    starClass: row.Class,
    starType: row.Type,
    x: Number(row.X),
    y: Number(row.Y),
    z: Number(row.Z),
  };
}

async function main() {
  const file = await Deno.open("./starmap.csv");
  try {
    for await (const row of readCSVObjects(file)) {
      const star = csvToStar(row as CsvStar);
      const stc = starToStc(star);
      console.log(star);
    }
  } finally {
    file.close();
  }
}

main();
