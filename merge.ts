import { JSONPath } from 'jsonpath-plus';

/**
 *
 * TODO:
 *
 * add a snippet into a model by specifying
 *
 *
 */
type VT = number | string | boolean;
type MPos = 'before' | 'after' | 'content';
type MT = string | number | boolean | object | any[];
interface MergeOptions<T extends VT = string> {
  property?: string;
  value: T;
  pos: MPos;
  index?: number;
  contributor?: string;
}

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
      const destIndex = destArray.findIndex((val) => val[prop] === value);
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

function insertSnip(
  arr: any[],
  snip: any,
  destIndex: number,
  pos: MPos,
  contrib?: string
) {
  let index = pos === 'before' ? destIndex - 1 : destIndex + 1;
  if (index < 0) {
    index = 0;
  }
  if (index > arr.length) {
    index = arr.length;
  }
  snip.contributor = contrib;

  // const values = Array.isArray(snip) ? ...snip : snip;
  if (Array.isArray(snip)) {
    arr.splice(index, 0, ...snip);
  } else {
    arr.splice(index, 0, snip);
  }
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

// - on a numeric position in an object's content[]. Object identified by a property and its value
const mo1: MergeOptions = {
  value: 'nsu=http://foo.bar;s=mySperDuperEvsModelValue',
  property: 'evsModel',
  pos: 'content',
  index: 4,
};

// - after/before a view part with any given property
const mo2: MergeOptions<number> = {
  value: 8,
  property: 'index',
  pos: 'after',
};

/**
 * JSONPath plus cannot handle semicolons in queries????
 */
export function escape(uri: string): string {
  const r = uri.replaceAll(';', '\\u003b');
  // console.log('esc', r);
  return r;
}
