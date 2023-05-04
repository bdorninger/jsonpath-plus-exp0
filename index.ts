import './style.css';

import { of, map } from 'rxjs';
import { JSONPath } from 'jsonpath-plus';
import { fdata, foodata, sample, viewdata } from './data';

/**
 * JSONPath plus cannot handle semicolons in queries????
 */
function escape(uri: string): string {
  const r = uri.replace(';', '\\u003b');
  // console.log('esc', r);
  return r;
}

/**
 *
 * TODO:
 *
 * add a snippet into a model by specifying
 *
 * - after/before a view part with a given evsModel (in any content[]):
 * - after/before a view part with any given property
 *
 * - on a numeric position in an object's content[]. Object identified by a property and its value
 *
 */
type VT = number | string | boolean;
type MPos = 'before' | 'after' | 'content';

interface MergeOptions<T extends VT = string> {
  property?: string;
  value: T;
  pos: MPos;
  index?: number;
}

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

// import * as jp from 'jsonpath';

/* of('World')
  .pipe(map((name) => `Hello, ${name}!`))
  .subscribe(console.log);
*/
// Open the console in the bottom right to see results.
let result = [];
let exist = [];

// result.push(...JSONPath({ path: '$.store.book[*]', json: sample }));
// result.push(...JSONPath({ path: '$..*[?(@.author==="Herman Melville")].^', json: sample }));

// exist = result.map((r) => sample.store.book.some((b) => b === r));

/* result.push(
  ...JSONPath({
    path: '$..*[?(@.evsModel)]',// ==="nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_bActivatedInSequence")]',
    json: viewdata,
  })
);*/
let uri = 'ab;';
// uri = 'nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_bActivatedInSequence';
uri = 'nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_rActiveTime';

/* result.push(
  ...JSONPath({
    path: `$..*[?(@.evsModel==="${escape(uri)}")]`,
    json: viewdata,
  })
);*/

// result.push(
//  ...JSONPath({
//    path: `$..*[?(@.evsModel && @.evsModel.match(/.*Activated.*/))]`,
//    json: viewdata,
//  })
// );

/* 

const vid = 'evs-input-number';
result.push(
  ...JSONPath({
    path: `$..*[?(@.viewId==="${vid}")]`,
    json: viewdata,
  })
);*/

/* result = JSONPath({
  path: `$..*[?(@.foo==="xyz\\u003b")]`,
  json: JSON.parse(foodata),
});

console.assert(
  result.length > 0,
  'Nothing found with escaped version of semicolon'
);
*/

result = JSONPath({
  path: `$.obj[?(@.foo==="abc" | @property===2)]^`,
  json: fdata,
});

console.log('Found', result); //, exist);
