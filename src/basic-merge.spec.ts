import { merge, remove, select } from '../merge';
import { bmerge } from './bmerge';

describe(`basic merge tests`, () => {
  console.log('describe2');

  it('can run a test', () => {
    console.log('other spec');
    expect(bmerge()).toBe(66);
  });
});
