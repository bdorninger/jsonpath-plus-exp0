import './style.css';

import { of, map } from 'rxjs';
import { JSONPath } from 'jsonpath-plus';
import { fdata, foodata, initData, sample, viewdata, viewsnip } from './data';
import { merge, remove } from './merge';

initData();

// import * as jp from 'jsonpath';

/* of('World')
  .pipe(map((name) => `Hello, ${name}!`))
  .subscribe(console.log);
*/
// Open the console in the bottom right to see results.
// let result = [];
// let exist = [];

// result.push(...JSONPath({ path: '$.store.book[*]', json: sample }));
// result.push(...JSONPath({ path: '$..*[?(@.author==="Herman Melville")].^', json: sample }));

// exist = result.map((r) => sample.store.book.some((b) => b === r));

/* result.push(
  ...JSONPath({
    path: '$..*[?(@.evsModel)]',// ==="nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_bActivatedInSequence")]',
    json: viewdata,
  })
);*/
// let uri = 'ab;';
// uri = 'nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_bActivatedInSequence';
// uri = 'nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_rActiveTime';

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

/*
result = JSONPath({
  path: `$.obj[?(@.foo==="abc")]^`,
  json: fdata,
});

console.log('Found', result); //, exist);
*/

const model = viewdata;
const snip = viewsnip;

const merged = merge(model, snip, {
  pos: 'after',
  property: 'evsModel',
  value: 'nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_rActiveTime',
  contributor: '_IMM_',
});

console.log('Mergerd model', merged);

// remove all marker views.....
/*
const allRemoved = remove<object, string>(merged, {
  property: 'viewId',
  value: 'evs-marker',
});
*/

// remove all view contributed by _IMM_
const allRemoved = remove<object, string>(merged, {
  property: 'contributor',
  value: '_IMM_',
});

console.log('after remove', merged, allRemoved);
