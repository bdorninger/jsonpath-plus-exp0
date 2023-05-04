export const sample = {
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
  },
};

export const foodata = `{
    "obj": [
      { "foo": "abc"},
      { "foo": "xyz;"},
      { "foo": "efg"}
    ]
  }`;

export const fdata = {
  obj: [
    { foo: 'abc', bar: 5 },
    { foo: 'xyz;', bar: 6 },
    { foo: 'efg', bar: 9 },
  ],
};

export const viewdata = {
  viewModelId: 'AirValve',
  content: [
    {
      viewId: 'evs-panel',
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
          // evsModel: 'nsu=http://engelglobal.com/IMM/AirValve1/;s=do_AirValve',
          evsModel: 'ab;',
          displayName: true,
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
          displayName: true,
        },
      ],
    },
    {
      viewId: 'evs-panel',
      header: [
        {
          viewId: 'evs-switch',
          name: 'Air valve 3',
          evsModel:
            'nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_bActivatedInSequence',
        },
      ],
      content: [
        {
          viewId: 'evs-input-number',
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
          evsModel: 'nsu=http://engelglobal.com/IMM/AirValve3/;s=do_AirValve',
          displayName: true,
        },
      ],
    },
  ],
};

export const viewsnip = {
  viewId: 'evs-panel',
  name: 'Air valve - blowing',
  content: [
    {
      viewId: 'evs-input-number',
      evsModel: 'nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_rActiveTime',
    },
    {
      viewId: 'evs-actual-number',
      evsModel:
        'nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_rActualActiveTime',
    },
  ],
};
