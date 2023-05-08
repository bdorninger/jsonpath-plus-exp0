import { JSONPath } from 'jsonpath-plus';

interface FilterOptions<T extends VT = string> {
  property?: string;
  value: T;
}

type VT = number | string | boolean;
type MPos = 'before' | 'after' | 'content';
type MT = string | number | boolean | object | any[];

export interface MergeOptions<T extends VT = string> extends FilterOptions<T> {
  pos: MPos;
  index?: number;
  contributor?: string;
}

export interface RemoveOptions<T extends VT = string>
  extends FilterOptions<T> {}

/**
 *
 */
export function merge<M extends MT, O extends VT = string>(
  modelSrc: M,
  snippet: object,
  options: MergeOptions<O>
): M {
  const prop = options.property ?? 'evsModel';
  const value =
    typeof options.value === 'string' ? escape(options.value) : options.value;

  const results: any[] = JSONPath({
    json: modelSrc,
    path: `$..*[?(@.${prop}==="${value}")]^`,
    wrap: true,
    callback: (pl, pt, fpl) =>
      console.log(`jsonpath callback payloads`, pl, pt, fpl),
  });

  if (results.length > 0) {
    const destArray = results[0];
    if (Array.isArray(destArray)) {
      const destIndex = destArray.findIndex(
        (elem) => elem[prop] === options.value
      );
      insertSnip(
        destArray,
        snippet,
        destIndex,
        options.pos,
        options.contributor
      );
    }
  }

  return modelSrc;
}

/**
 *
 */
export function remove<M extends MT, O extends VT = string>(
  modelSrc: M,
  options: RemoveOptions<O>
): any[] {
  const prop = options.property ?? 'evsModel';
  const value =
    typeof options.value === 'string' ? escape(options.value) : options.value;

  const results: any[] = JSONPath({
    json: modelSrc,
    path: `$..*[?(@.${prop}==="${value}")]^`,
    wrap: true,
    /* callback: (pl, pt, fpl) =>
      console.log(`remove callback payloads`, pl, pt, fpl),*/
  });

  const removed: any[] = [];

  results.forEach((res) => {
    // console.log('arrays: ', res);
    if (Array.isArray(res)) {
      const rmInd = res.findIndex((elem) => elem[prop] === options.value);
      // console.log(`found ${prop} = ${options.value} at Index${rmInd}`);
      if (rmInd >= 0) {
        removed.push(...res.splice(rmInd, 1));
      }
    }
  });

  return removed;
}

function insertSnip(
  arr: any[],
  snip: any,
  destIndex: number,
  pos: MPos,
  contrib?: string
) {
  let index = destIndex;
  if (pos !== 'content') {
    index = pos === 'before' ? destIndex - 1 : destIndex + 1;
  }

  if (index < 0) {
    index = 0;
  }
  if (index > arr.length) {
    index = arr.length;
  }
  snip.contributor = contrib;

  // console.log(`Inserting at ${index} --> ${pos} ${destIndex}`);

  if (Array.isArray(snip)) {
    arr.splice(index, 0, ...snip);
  } else {
    arr.splice(index, 0, snip);
  }
}

/**
 * JSONPath plus cannot handle semicolons in queries????
 */
export function escape(str: string): string {
  return str.replaceAll(';', '\\u003b');
}

/**
 *
 * SAMPLE merge opts
 * - after/before a view part with a given evsModel (in any content[]):
 * - after/before a view part with any given property
 *
 * - on a numeric position in an object's content[]. Object identified by a property and its value
 *
 *
 */
// - after/before a view part with a given evsModel (in any content[]):
const mo0: MergeOptions = {
  value: 'nsu=http://foo.bar;s=mySperDuperEvsModelValue',
  property: 'evsModel',
  pos: 'after',
};

// - after/before a view part with any given property
const mo2: MergeOptions<number> = {
  value: 8,
  property: 'index',
  pos: 'after',
};

// - on a numeric position in an object's content[]. Object identified by a property and its value
const mo1: MergeOptions = {
  value: 'nsu=http://foo.bar;s=mySperDuperEvsModelValue',
  property: 'evsModel',
  pos: 'content',
  index: 4,
};

const mo3: MergeOptions = {
  value: 'myId',
  property: 'insertId',
  pos: 'content',
  index: 2,
};
