import { viewdata, viewsnip, viewsnip3 } from '../data';
import { merge, remove, select } from '../merge';

describe(`basic merge tests`, () => {
  it(`can merge snippets in to a model`, async () => {
    const model = viewdata;
    const snip = viewsnip;
    let merged: any;

    /**
     * Merge a snippet into the model after a specific variable
     */
    merged = merge(model, snip, {
      pos: 'after',
      property: 'evsModel',
      value: 'nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_rActiveTime',
      contributor: '_IMM_',
    });

    /*
     * Merge multiple snippets into a model using different insertion points
     */
    /* merged = merge(
      merged,
      { evsModel: 'mySuperDuperModel000', viewId: 'input' },
      {
        property: 'insertionPoint',
        value: 'myId',
        pos: 'content',
        index: 1,
        contributor: 'KARL',
        sort: false,
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
        sort: false,
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
        sort: false,
      }
    );*/

    /*
     * check positions
     */
    const selected0 = await select(merged, {
      property: 'name',
      value: 'Air valve - blowing',
    });
    expect(selected0.length).toBe(1);
    const expected0 = jasmine.objectContaining({
      viewId: 'evs-panel',
      name: 'Air valve - blowing',
      insertAt: 'myId2',
      position: 22,
    });
    expect(selected0[0]).toEqual(expected0);
    /*
    expect(merged.content[0]).toEqual(
      jasmine.objectContaining({
        evsModel: 'myTOPModel',
        viewId: 'output',
        position: 999,
      })
    );

    const selected = await select(merged, {
      property: 'contributor',
      value: 'SEPP',
    });
    expect(selected.length).toBe(1);
    const expected = jasmine.objectContaining({
      evsModel: 'mySuperDuperModel123',
      viewId: 'input',
      position: 14,
    });
    expect(selected[0]).toEqual(expected);
    expect(merged.content[1].content[0]).toEqual(expected);

    expect(merged.content[1].content[2]).toEqual(
      jasmine.objectContaining({
        evsModel: 'mySuperDuperModel000',
        viewId: 'input',
      })
    );
*/
    console.log(merged);

    /*
     * How to remove snippets from a model: e.g. device disconnects in running visu
     */
    /*   const removed = await remove(merged, {
      property: 'contributor',
      value: 'SEPP',
    });
    expect(removed.length).toBe(1);
    expect(removed[0]).toEqual(expected);

    const selectedAfterRemove = await select(merged, {
      property: 'contributor',
      value: 'SEPP',
    });
    expect(selectedAfterRemove.length).toBe(0);*/
  });

  /**
   * How to select snippets for specific insertionPoints from a model
   */
  it('can select snippets from a model file', async () => {
    const result = await select(viewsnip3, {
      property: 'insertAt',
      value: undefined,
      operator: 'neq',
    });
    console.log(`results`, result);
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(result).toEqual(
      jasmine.arrayContaining([
        {
          viewId: 'evs-input-number',
          insertAt: 'myId31',
          position: 90,
          evsModel:
            'nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_rActiveTime',
        },
        {
          viewId: 'evs-actual-number',
          insertAt: 'myId32',
          position: 25,
          evsModel:
            'nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_rActualActiveTime',
        },
      ])
    );
  });
});
