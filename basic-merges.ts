import { buffer, mergeWith, Subject } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  readData,
  sample,
  ViewConfig,
  viewdata,
  viewsnip,
  viewsnip3,
} from './data';
import { merge, remove, select } from './merge';

function mergeViews(views: ViewConfig[]): ViewConfig {
  console.log(`Merge Views: `, views);

  merge(views[0], views[1], {
    property: 'insertionPoint',
    value: 'top',
    pos: 'content',
    index: 'position',

    contributor: 'DEVICE',
  });

  return views[0];
}

/**
 *
 */
export function basicMerges() {
  const model = viewdata;
  const snip = viewsnip;

  const process$ = new Subject<void>();

  const viewDataName = 'mold1.view.main.json';
  const viewSnippetName = 'mold1.view.snip.json';
  console.log(`Requesting ${viewDataName} and snippet ${viewSnippetName}`);
  let obs$ = readData<ViewConfig>(viewDataName);
  let obs2$ = readData<ViewConfig>(viewSnippetName);
  /*
  obs$.pipe(mergeWith(obs2$), buffer(process$)).subscribe({
    next: (val) =>
      console.log(
        `Merged ${val[0]?.viewModelId} with ${val[1]?.viewModelId}`,
        mergeViews(val)
      ),
    error: (err) => console.error(err),
    complete: () => process$.next(),
  });
*/
  let merged: any;
  merged = merge(model, snip, {
    pos: 'after',
    property: 'evsModel',
    value: 'nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_rActiveTime',
    contributor: '_IMM_',
  });

  merged = merge(
    merged,
    { evsModel: 'mySuperDuperModel000', viewId: 'input' },
    {
      property: 'insertionPoint',
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
      property: 'insertionPoint',
      value: 'myId',
      pos: 'content',
      index: 'position',
      contributor: 'SEPP',
    }
  );

  merged = merge(
    merged,
    { evsModel: 'myTOPModel', viewId: 'output', position: 999 },
    {
      property: 'insertionPoint',
      value: 'top',
      pos: 'content',
      index: 'position',
      contributor: 'HUGO',
    }
  );
  /*
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
*/
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
  /* const allRemoved = remove<object, string>(merged, {
    property: 'contributor',
    value: '_IMM_',
  });

  console.log('after remove', merged, allRemoved);
*/

  /* select(sample, {
    property: 'abc',
    value: 666,
    operator: 'eq', 
  })
    .then((results) => console.log(`extracted snips`, results))
    .catch((err) => console.error(err));
*/

  /*

  const sampleClone = structuredClone(sample);
  remove(sampleClone, {
    property: 'abc',
    value: 666,
    operator: 'eq',
  })
    .then((results) => {
      console.log(
        `\n----------------------- REMOVE from booksample -------------------------------`
      );
      console.log(
        `deleted snips,final model, original model`,
        results,
        sampleClone,
        sample
      );
    })
    .catch((err) => console.error(err));

  select(viewsnip3, {
    property: 'insertAt',
    value: undefined,
    operator: 'neq',
  })
    .then((results) => {
      console.log(
        `\n----------------------- SELECT from VIEWSNIP 3 -------------------------------`
      );
      console.log(`extracted snips`, results);
    })
    .catch((err) => console.error(err));
    */
}
