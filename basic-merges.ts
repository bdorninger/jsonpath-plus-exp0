import { viewdata, viewsnip, viewsnip3 } from './data';
import { extractSnippets, merge, remove } from './merge';

/**
 *
 */
export function basicMerges() {
  const model = viewdata;
  const snip = viewsnip;

  let merged = merge(model, snip, {
    pos: 'after',
    property: 'evsModel',
    value: 'nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_rActiveTime',
    contributor: '_IMM_',
  });

  /*merged = merge(
  merged,
  { evsModel: 'mySuperDuperModel000', viewId: 'input' },
  {
    property: 'insertId',
    value: 'myId',
    pos: 'content',
    index: 1,
    contributor: 'KARL',
  }
);

merged = merge(
  merged,
  { evsModel: 'mySuperDuperModel123', viewId: 'input', position: 14 },
  {
    property: 'insertId',
    value: 'myId',
    pos: 'content',
    index: 'position',
    contributor: 'SEPP',
  }
);*/

  merged = merge(
    merged,
    { evsModel: 'mySuperDuperModel999', viewId: 'input', position: 35 },
    {
      property: 'insertId',
      value: 'myId2',
      pos: 'content',
      index: 'position',
      contributor: 'HUGO',
    }
  );

  merged = merge(
    merged,
    { evsModel: 'myOtherSuperDuperModel999', viewId: 'marker', position: 6 },
    {
      property: 'insertId',
      value: 'myId2',
      pos: 'header',
      index: 'position',
      contributor: 'TONI',
    }
  );

  const mergedClone = structuredClone(merged);
  console.log('Mergerd model', mergedClone);

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

  const results = extractSnippets(viewsnip3);
  console.log(`extracted snips`, results);
}