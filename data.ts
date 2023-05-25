export interface CommentedObject {
  __COMMENT__?: string;
}

export interface ViewConfigMeta extends CommentedObject {
  modelId: string;
  modelType: string;
}
/* export interface ViewDataMeta {
  insertAt?: string;
  constributor?: string;
}*/

export interface ViewBaseData {
  name?: string;
  viewId?: string;
  evsModel?: string;
  insertionPoint?: string;
  insertAt?: string;
  position?: number; // sort pos
}

export interface ViewData extends ViewBaseData, CommentedObject {
  header?: ViewHeaderData[];
  content?: ViewContentData[];
}

export type RuntimeViewData = ViewData & { contributor?: string };

export interface ViewHeaderData extends ViewData {}

export interface ViewContentData extends ViewData {}

export interface ViewConfig extends CommentedObject, ViewData {
  meta?: ViewConfigMeta;
}

export let sample = {};
export let foodata = {};
export let fdata = {};
export let viewdata: ViewConfig = {};
export let viewsnip: ViewConfig = {};
export let viewsnip3: ViewConfig = {};

export function initData() {
  sample = {
    store: {
      book: [
        {
          category: 'reference',
          author: 'Nigel Rees',
          title: 'Sayings of the Century',
          price: 8.95,
        },
        {
          category: 'fiction',
          author: 'Evelyn Waugh',
          title: 'Sword of Honour',
          price: 12.99,
        },
        {
          category: 'fiction',
          author: 'Herman Melville',
          title: 'Moby Dick',
          isbn: '0-553-21311-3',
          price: 8.99,
          abc: 666,
        },
        {
          category: 'fiction',
          author: 'J. R. R. Tolkien',
          title: 'The Lord of the Rings',
          isbn: '0-395-19395-8',
          price: 22.99,
        },
      ],
      bicycle: {
        color: 'red',
        price: 19.95,
      },
      nokia: {
        name: 'karl',
        abc: 666,
      },
      moto: {
        sub: {
          name: 'hugo',
          ssk: true,
          abc: 666,
        },
      },
    },
  };

  foodata = `{
    "obj": [
      { "foo": "abc"},
      { "foo": "xyz;"},
      { "foo": "efg"}
    ]
  }`;

  fdata = {
    obj: [
      { foo: 'abc', bar: 5 },
      { foo: 'xyz;', bar: 6 },
      { foo: 'efg', bar: 9 },
    ],
  };

  viewdata = {
    meta: {
      modelId: 'AirValve',
      modelType: 'main', // 'snip'
    },
    content: [
      {
        viewId: 'evs-panel',
        insertionPoint: 'myId',
        header: [
          {
            viewId: 'evs-switch',
            name: 'Air valve 1',
            evsModel:
              'nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_bActivatedInSequence',
          },
        ],
        content: [
          {
            viewId: 'evs-input-number',
            position: 10,
            evsModel:
              'nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_rActiveTime',
            content: [
              {
                viewId: 'evs-marker',
                evsModel:
                  'nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_bAirValveActiveTime',
              },
            ],
          },
          {
            viewId: 'evs-marker',
            position: 20,
            evsModel: 'nsu=http://engelglobal.com/IMM/AirValve1/;s=do_AirValve',
          },
        ],
      },
      {
        viewId: 'evs-panel',
        header: [
          {
            viewId: 'evs-switch',
            name: 'Air valve 2',
            evsModel:
              'nsu=http://engelglobal.com/IMM/AirValve2/;s=sv_bActivatedInSequence',
          },
        ],
        content: [
          {
            viewId: 'evs-input-number',
            evsModel:
              'nsu=http://engelglobal.com/IMM/AirValve2/;s=sv_rActiveTime',
            content: [
              {
                viewId: 'evs-marker',
                evsModel:
                  'nsu=http://engelglobal.com/IMM/AirValve2/;s=sv_bAirValveActiveTime',
              },
            ],
          },
          {
            viewId: 'evs-marker',
            evsModel: 'nsu=http://engelglobal.com/IMM/AirValve2/;s=do_AirValve',
          },
        ],
      },
      {
        viewId: 'evs-panel',
        insertionPoint: 'myId2',
        header: [
          {
            viewId: 'evs-switch',
            position: 15,
            name: 'Air valve 3',
            evsModel:
              'nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_bActivatedInSequence',
          },
        ],
        content: [
          {
            viewId: 'evs-input-number',
            position: 10,
            insertionPoint: 'myInnerId',
            evsModel:
              'nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_rActiveTime',
            content: [
              {
                viewId: 'evs-marker',
                evsModel:
                  'nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_bAirValveActiveTime',
              },
            ],
          },
          {
            viewId: 'evs-marker',
            position: 20,
            evsModel: 'nsu=http://engelglobal.com/IMM/AirValve3/;s=do_AirValve',
          },
        ],
      },
    ],
  };

  viewsnip = {
    viewId: 'evs-panel',
    name: 'Air valve - blowing',
    insertAt: 'myId2',
    position: 22,
    content: [
      {
        viewId: 'evs-input-number',
        position: 15,
        evsModel: 'nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_rActiveTime',
      },
      {
        viewId: 'evs-actual-number',
        position: 35,
        evsModel:
          'nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_rActualActiveTime',
      },
    ],
  };

  viewsnip3 = {
    viewId: 'evs-panel',
    name: 'something snippet',
    position: 22,
    content: [
      {
        viewId: 'evs-input-number',
        insertAt: 'myId31',
        position: 90,
        evsModel: 'nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_rActiveTime',
      },
      {
        viewId: 'evs-actual-number',
        insertAt: 'myId32',
        position: 25,
        evsModel:
          'nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_rActualActiveTime',
      },
      {
        viewId: 'evs-actual-text',
        position: 88,
        evsModel: 'nsu=http://never',
      },
    ],
  };
}
