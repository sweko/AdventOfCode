import { readInputLines } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

type Range = { min: number; max: number };

type Point = { x: number; y: number; z: number };

type Point4 = { x: number; y: number; z: number; w: number };

type State = {
  x: Range;
  y: Range;
  z: Range;
  actives: Point[];
};

type State4 = {
  x: Range;
  y: Range;
  z: Range;
  w: Range;
  actives: Map<string, Point4>;
};

const processInput = async (day: number) => {
  const input = await readInputLines(day);
  return input.map((line) => line.split("").map((char) => char === "#"));
};

const getNeighbours = ({ x, y, z }: Point) => {
  const offsets = [-1, 0, 1];
  const result = [];
  for (const xo of offsets) {
    for (const yo of offsets) {
      for (const zo of offsets) {
        if (!!xo || !!yo || !!zo) {
          result.push({ x: x + xo, y: y + yo, z: z + zo });
        }
      }
    }
  }
  return result;
};

const getNextState = (state: State): State => {
  const result: State = {
    x: {
      min: state.x.min - 1,
      max: state.x.max + 1,
    },
    y: {
      min: state.y.min - 1,
      max: state.y.max + 1,
    },
    z: {
      min: state.z.min - 1,
      max: state.z.max + 1,
    },
    actives: [],
  };

  for (let x = result.x.min; x <= result.x.max; x += 1) {
    for (let y = result.y.min; y <= result.y.max; y += 1) {
      for (let z = result.z.min; z <= result.z.max; z += 1) {
        const neighbours = getNeighbours({ x, y, z });
        const active = neighbours.filter((n) =>
          state.actives.find((p) => n.x === p.x && n.y === p.y && n.z === p.z)
        ).length;
        const current = state.actives.find(
          (p) => x === p.x && y === p.y && z === p.z
        );
        if (current) {
          // active
          if (active === 2 || active === 3) {
            result.actives.push({ x, y, z });
          }
        } else {
          // inactive
          if (active === 3) {
            result.actives.push({ x, y, z });
          }
        }
      }
    }
  }

  return result;
};

const partOne = (input: boolean[][], debug: boolean) => {
  let actives = input
    .map((line, x) =>
      line
        .map((cube, y) => ({ cube, point: { x, y, z: 0 } }))
        .filter((cube) => cube.cube)
        .map((cube) => cube.point)
    )
    .flat();

  let state: State = {
    x: {
      min: 0,
      max: input.length - 1,
    },
    y: {
      min: 0,
      max: input[0].length - 1,
    },
    z: {
      min: 0,
      max: 0,
    },
    actives,
  };

  for (let index = 0; index < 6; index += 1) {
    state = getNextState(state);
    // console.log(state.actives.length);
  }

  return state.actives.length;
};

const getNeighbours4 = ({ x, y, z, w }: Point4) => {
  const offsets = [-1, 0, 1];
  const result: Point4[] = [];
  for (const xo of offsets) {
    for (const yo of offsets) {
      for (const zo of offsets) {
        for (const wo of offsets) {
          if (!!xo || !!yo || !!zo || !!wo) {
            result.push({ x: x + xo, y: y + yo, z: z + zo, w: w + wo });
          }
        }
      }
    }
  }
  return result;
};

const getKey4 = ({x,y,z,w}: Point4):string => `${x}:${y}:${z}:${w}`;

const getNextState4 = (state: State4): State4 => {
  const result: State4 = {
    x: {
      min: state.x.min - 1,
      max: state.x.max + 1,
    },
    y: {
      min: state.y.min - 1,
      max: state.y.max + 1,
    },
    z: {
      min: state.z.min - 1,
      max: state.z.max + 1,
    },
    w: {
      min: state.w.min - 1,
      max: state.w.max + 1,
    },
    actives: new Map<string, Point4>(),
  };

  for (let x = result.x.min; x <= result.x.max; x += 1) {
    for (let y = result.y.min; y <= result.y.max; y += 1) {
      for (let z = result.z.min; z <= result.z.max; z += 1) {
        for (let w = result.w.min; w <= result.w.max; w += 1) {
          const neighbours = getNeighbours4({ x, y, z, w });
          const active = neighbours.filter(n => state.actives.has(getKey4(n))).length;
          const current = state.actives.get(getKey4({x, y, z, w}));

          if (current) {
            // active
            if (active === 2 || active === 3) {
              result.actives.set(getKey4({ x, y, z, w }), { x, y, z, w });
            }
          } else {
            // inactive
            if (active === 3) {
              result.actives.set(getKey4({ x, y, z, w }), { x, y, z, w });
            }
          }
        }
      }
    }
  }
  return result;
};

const partTwo = (input: boolean[][], debug: boolean) => {
  let actives = input
    .map((line, x) => line
        .map((cube, y) => ({ cube, point: { x, y, z: 0, w: 0 } }))
        .filter(cube => cube.cube)
        .map(cube => cube.point)
    )
    .flat();

  let activeMap = new Map<string, Point4>(actives.map(item => [getKey4(item), item]));

  let state: State4 = {
    x: {
      min: 0,
      max: input.length - 1,
    },
    y: {
      min: 0,
      max: input[0].length - 1,
    },
    z: {
      min: 0,
      max: 0,
    },
    w: {
      min: 0,
      max: 0,
    },
    actives: activeMap,
  };

  for (let index = 0; index < 6; index += 1) {
    state = getNextState4(state);
    // console.log(state.actives.length);
  }

  return state.actives.size;
};

const result = (_: any, result: number) => {
  return `Total number of occupied chairs is ${result}`;
};

const showInput = (input: boolean[][]) => {
  console.log(input);
};

const test = (_: boolean[][]) => {
  // const line = { '0': false, '1': true, '-1': false, min: -1, max: 1 };
  const point = { x: 5, y: 5, z: 5 };
  console.log(getNeighbours(point));
};

export const solutionSeventeen: Puzzle<boolean[][], number> = {
  day: 17,
  input: processInput,
  partOne,
  partTwo,
  resultOne: result,
  resultTwo: result,
  showInput,
  test,
};
