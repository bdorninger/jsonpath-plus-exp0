import './style.css';

import { of, map } from 'rxjs';
import { JSONPath } from 'jsonpath-plus';
import { sample, viewdata } from './data';

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
uri = 'nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_bActivatedInSequence';

result.push(
  ...JSONPath({
    path: `$..*[?(@.evsModel==="${escape(uri)}")]`,
    json: viewdata,
  })
);

// result.push(
//  ...JSONPath({
//    path: `$..*[?(@.evsModel && @.evsModel.match(/.*Activated.*/))]`,
//    json: viewdata,
//  })
// );

const vid = 'evs-input-number';

/* result.push(
  ...JSONPath({
    path: `$..*[?(@.viewId==="${vid}")]`,
    json: viewdata,
  })
);*/

console.log('Found', result, exist);

function escape(uri: string): string {
  const r = uri.replace(';', '\\u003b');
  console.log('esc', r);
  return r;
}
