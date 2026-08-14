import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

const IDS = [
  "photo-1511707171634-5f897ff02aa9",
  "photo-1512496015851-a90fb38ba796",
  "photo-1601784551446-20c9e07cdbdb",
  "photo-1546054454-aa26e2b734c7",
  "photo-1579586337278-3befd40fd17a",
  "photo-1505236858219-8359eb29e329",
  "photo-1580910051074-3eb694886505",
  "photo-1592899677977-9c10ca588bbd",
  "photo-1523206489230-c012c64b2b48",
  "photo-1598327105666-5b89351aff97",
  "photo-1556656793-08538906a9f8",
  "photo-1565849904461-04a58ad377e0",
  "photo-1610945265064-0e34e5519bbf",
  "photo-1586898633445-fc34716255b2",
  "photo-1512428559087-560fa5ceab42",
  "photo-1634403665481-74948d815f03",
  "photo-1567581935884-3349723552ca",
  "photo-1585060544812-6b45742d762f",
  "photo-1512941937669-90a1b58e7e9c",
  "photo-1603909223429-69bb7101f420",
  "photo-1592890288564-76628a30a657",
  "photo-1616348436168-de43ad0db179",
  "photo-1611532736597-de2d4265fba3",
  "photo-1621330396173-e41b1cafd17f",
  "photo-1632661674596-df8be070a5c5",
  "photo-1572016047668-5b5e909e1605",
  "photo-1570101945621-945409a6370f",
  "photo-1696446701796-da61225697cc",
  "photo-1583394838336-acd977736f90",
  "photo-1610792516307-ea5acd9c3b00",
  "photo-1610945415295-d9bbf067e59c",
  "photo-1649972904349-6e44c42644a7",
];

const PEXELS = [
  788946, 1092644, 699122, 607812, 887751, 1036936, 1447254, 1647976,
  404280, 5082579, 5082580, 3999536, 3999538, 583842, 947885, 1275229,
  821738, 996828, 18525574, 8381358, 36538952, 36665171, 2706379, 3206177,
  3345882, 341523, 1823681,
];

async function main() {
  const dir = path.join(process.cwd(), "scripts", "tmp-imgs", "bases");
  fs.mkdirSync(dir, { recursive: true });

  for (const id of IDS) {
    const url = `https://images.unsplash.com/${id}?w=400&h=400&fit=crop&crop=center&auto=format&q=60`;
    const res = await fetch(url);
    if (!res.ok) {
      console.log("SKIP", id, res.status);
      continue;
    }
    fs.writeFileSync(path.join(dir, `${id}.jpg`), Buffer.from(await res.arrayBuffer()));
    console.log("unsplash", id);
  }
  for (const id of PEXELS) {
    const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop`;
    const res = await fetch(url);
    if (!res.ok) {
      console.log("SKIP pexels", id, res.status);
      continue;
    }
    fs.writeFileSync(path.join(dir, `pexels-${id}.jpg`), Buffer.from(await res.arrayBuffer()));
    console.log("pexels", id);
  }
}

main();
