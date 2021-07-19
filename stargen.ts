import { readCSVObjects } from "https://deno.land/x/csv@v0.5.1/mod.ts";
import { Star, starToStc, stcToString } from "./stc.ts";

type CsvStar = {
  "Absolute Mag": string;
  "Binary/Multiple": string;
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
      const csvStar = row as CsvStar;
      if (csvStar["Binary/Multiple"] != "No") {
        // Handle only single stars for now.
        continue;
      }
      const star = csvToStar(csvStar);
      const stc = starToStc(star, id += 1);
      const result = stcToString(stc);
      // console.log(star);
      console.log(result);
    }
  } finally {
    file.close();
  }
}

main();
