import { JSONPath } from 'jsonpath-plus';

interface FilterOptions<T extends VT = string> {
  property?: string;
  value?: T;
  operator?: FilterOperator;
  useValueFromJson?: boolean;
}

type VT = number | string | boolean;
type MPos = 'before' | 'after' | 'content' | 'header';
type MT = string | number | boolean | object | any[];

export interface MergeOptions<T extends VT = string> extends FilterOptions<T> {
  pos: MPos;
  index?: number | string;
  contributor?: string;
  sort?: boolean;
}

export type FilterOperator = 'eq' | 'neq';

export interface RemoveOptions<T extends VT = string>
  extends FilterOptions<T> {}

export interface SelectOptions<T extends VT = string>
  extends FilterOptions<T> {}

/**
 * merges two models/snippets by considering the specified options
 */
export function mergeP<M extends MT, O extends VT = string>(
  modelSrc: M,
  snippet: object,
  options: MergeOptions<O>
): Promise<M> {
  return new Promise((resolve, reject) => {
    const prop = options.property ?? 'evsModel';
    const value =
      typeof options.value === 'string' ? escape(options.value) : options.value;
    /*
  const path = `$..[?(@.${prop} === '${value}')]${
    options.pos === 'content' || options.pos === 'header' ? '' : '^'
  }`;
  */

    const path = `$..[?(@property === '${prop}' && @ === ${value})]`;

    // const path = `$..[?(@property === 'insertionPoint')]`;

    // console.log(`Merging.....path is ${path}`, options, modelSrc);
    JSONPath({
      json: modelSrc,
      path: path,
      wrap: true,
      callback: (pl, pt, fpl) => {
        console.log(`jsonpath callback payloads`, pl, pt, fpl);

        // case 1: before or after a specific object having a specific prop in an ARRAY
        // case 2: in the content or header of an OBJECT with a specific prop
        // default merging strategy: add top level content to top content array and top level headers into top header array
        // fpl.parent, fpl.value
        if (
          Array.isArray(fpl.parent) &&
          (options.pos === 'before' || options.pos === 'after')
        ) {
          const destIndex = fpl.parent.findIndex(
            (elem: any) => elem[prop] === options.value
          );
          insertSnip(
            fpl.parent,
            snippet,
            destIndex,
            options.pos,
            options.contributor
          );
        }
      },
    });
  });
}

/**
 * merges two models/snippets by considering the specified options
 */
export function merge<M extends MT, O extends VT = string>(
  modelSrc: M,
  snippet: object,
  options: MergeOptions<O>
): M {
  const prop = options.property ?? 'evsModel';
  const value =
    typeof options.value === 'string' ? escape(options.value) : options.value;
  /*
  const path = `$..[?(@.${prop} === '${value}')]${
    options.pos === 'content' || options.pos === 'header' ? '' : '^'
  }`;
  */

  const path = `$..[?(@property === '${prop}' && @ === ${value})]^`;

  // const path = `$..[?(@property === 'insertionPoint')]`;

  // console.log(`Merging.....path is ${path}`, options, modelSrc);
  const results: any[] = JSONPath({
    json: modelSrc,
    path: path,
    wrap: true,
    callback: (pl, pt, fpl) => {
      console.log(`jsonpath callback payloads!`, pl, pt, fpl);
    },
  });
  // console.log(`Results`, results);
  if (results.length > 0) {
    const destObject = results[0];
    if (
      Array.isArray(destObject) &&
      (options.pos === 'before' || options.pos === 'after')
    ) {
      const destIndex = destObject.findIndex(
        (elem) => elem[prop] === options.value
      );
      insertSnip(
        destObject,
        snippet,
        destIndex,
        options.pos,
        options.contributor
      );
    } else if (
      typeof destObject === 'object' &&
      (options.pos === 'content' || options.pos === 'header')
    ) {
      const targetArrayProperty = options.pos;
      if (destObject[targetArrayProperty] == null) {
        destObject[targetArrayProperty] = [];
      } else if (!Array.isArray(destObject[targetArrayProperty])) {
        throw new Error(
          `cannot merge into content[]. Property content is present and NOT an array!`
        );
      }

      if (typeof options.index === 'number') {
        insertSnip(
          destObject[targetArrayProperty],
          snippet,
          options.index,
          options.pos,
          options.contributor
        );
      } else if (typeof options.index === 'string') {
        const sortProp = options.index;
        insertSnip(
          destObject[targetArrayProperty],
          snippet,
          0,
          options.pos,
          options.contributor
        );
        // index contains the name of the property the content array is sorted
        // Contents are rendered in sequence, sorting must be done in advance
        if (options.sort) {
          (destObject[targetArrayProperty] as any[]).sort(
            (a, b) => (a[sortProp] ?? 0) - (b[sortProp] ?? 0)
          );
        }
      }
    }
  }

  return modelSrc;
}

function selectOrRemove<M extends MT, O extends VT = string, R = any>(
  modelSrc: M,
  options: RemoveOptions<O>,
  operation: 'remove' | 'select'
): Promise<R[]> {
  return new Promise<R[]>((resolver, rejector) => {
    const prop = options.property ?? 'evsModel';
    const value =
      typeof options.value === 'string' ? escape(options.value) : options.value;

    const pathExp = `$..*[?(@property==='${prop}' && @ ${getOperatorString(
      options.operator ?? 'eq'
    )}${value})]^`;

    try {
      const selected: Set<R> = new Set();
      const results: any[] = JSONPath({
        json: modelSrc,
        path: pathExp,
        wrap: true,
        callback: (selectedValueOrProperty, resultType, fullPathPayload) => {
          /* console.log(
            `remove callback payloads`,
            selectedValueOrProperty,
            resultType,
            fullPathPayload
          );*/
          selected.add(selectedValueOrProperty);
          if (operation === 'remove' && resultType === 'value') {
            const removed = deleteValue(
              fullPathPayload.parent,
              fullPathPayload.parentProperty
            );
            // console.log(`removed@:${fullPathPayload.parentProperty}`, removed);
          }
        },
      });
      resolver(Array.from(selected));
    } catch (err) {
      rejector(err);
    }
  });
}

/**
 * removes entries from arrays which fulfill a provided filter expression
 */
export function select<M extends MT, O extends VT = string, R = any>(
  modelSrc: M,
  options: SelectOptions<O>
): Promise<R[]> {
  return selectOrRemove(modelSrc, options, 'select');
}

/**
 * removes entries from arrays which fulfill a provided filter expression
 */
export function remove<M extends MT, O extends VT = string, R = any>(
  modelSrc: M,
  options: RemoveOptions<O>
): Promise<R[]> {
  return selectOrRemove(modelSrc, options, 'remove');
}

//
// non api helper function for deleting
//
function deleteValue(
  parentObjectOrArray: any[] | object,
  propertyOrIndex: number | string
) {
  let removed: any = undefined;

  if (
    Array.isArray(parentObjectOrArray) &&
    typeof propertyOrIndex === 'number'
  ) {
    removed = parentObjectOrArray.splice(propertyOrIndex, 1)[0];
  } else if (
    typeof parentObjectOrArray === 'object' &&
    typeof propertyOrIndex === 'string'
  ) {
    const p = parentObjectOrArray as any;
    removed = p[propertyOrIndex];
    delete p[propertyOrIndex];
  }
  return removed;
}

// helper function
function adjustIndexToArrayBounds(arr: any[], rInd: number): number {
  let ind = rInd;
  if (ind < 0) {
    ind = 0;
  }
  if (ind > arr.length) {
    ind = arr.length;
  }
  return ind;
}

// helper function
function insertSnip(
  arr: any[],
  snip: any,
  destIndex: number,
  pos: MPos,
  contrib?: string
) {
  console.log(
    `Inserting@ ${destIndex} using ${pos} from ${contrib}`,
    snip,
    arr
  );

  let index = destIndex;
  if (pos === 'before') {
    index = destIndex - 1;
  }

  if (pos === 'after') {
    index = destIndex + 1;
  }

  index = adjustIndexToArrayBounds(arr, index);

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
  return `'${str.replaceAll(';', '\\u003b')}'`;
}

export function getOperatorString(op: FilterOperator) {
  switch (op) {
    case 'eq':
      return '===';
    case 'neq':
      return '!==';
    default:
      throw new Error(`Unknown Operator "${op}"`);
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

// - after/before a view part with any given property
const mo2: MergeOptions<number> = {
  value: 8,
  property: 'index',
  pos: 'after',
};

const mo3: MergeOptions = {
  value: 'myId',
  property: 'insertId',
  pos: 'content',
  index: 2,
};

// merge a snippet into a content array of an object identified by some property
// a) the position within the content array being determined by a fixed index
// b) the position within the content array being determined by a sortable attribute position
// - on a numeric position in an object's content[]. Object identified by a property and its value
/* a)  on a numeric position in an object's content[]. Object identified by a property and its value*/
const moInd: MergeOptions = {
  value: 'nsu=http://foo.bar;s=mySperDuperEvsModelValue',
  property: 'evsModel',
  pos: 'content',
  index: 4,
};

// b)
const moPos: MergeOptions = {
  useValueFromJson: true,
  property: 'insertPoint',
  pos: 'content',
  index: 'position',
};

/* function selectOrRemove2<M extends MT, O extends VT = string, R = any>(
  modelSrc: M,
  options: RemoveOptions<O>,
  operation: 'remove' | 'select'
): R[] {
  
  const prop = options.property ?? 'evsModel';
  const value =
    typeof options.value === 'string' ? escape(options.value) : options.value;

  const pathExp = `$..*[?(@property==='${prop}' && @ ${getOperatorString(
    options.operator ?? 'eq'
  )}'${value}')]^`;

  console.log(pathExp);
  const results: any[] = JSONPath({
    json: modelSrc,
    path: pathExp,
    wrap: true,
    callback: (pl, pt, fpl) =>
      console.log(`remove callback payloads`, pl, pt, fpl),
  });

  const allRemovedOrSelected: any[] = [];
  console.log('All sel/Rem results', results);
  results.forEach((res) => {
    if (Array.isArray(res)) {
      console.log('arrays: ', res);
      const rmInd = res.findIndex((elem, i) => {
        const expr = `elem[prop]${getOperatorString(
          options?.operator ?? 'eq'
        )}options.value`;
        console.log(`before eval`, i, expr, elem[prop]);
        const evret = eval(expr);
        console.log('eval', i, evret);
        return evret;
      });
      // console.log(`found ${prop} = ${options.value} at Index${rmInd}`);
      if (rmInd >= 0) {
        const removedOrSelected =
          operation === 'remove' ? res.splice(rmInd, 1)[0] : res[rmInd];
        allRemovedOrSelected.push(removedOrSelected);
      }
    }
  });

  return allRemovedOrSelected;
}*/
