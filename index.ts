import './jasmine.css';

import jasmineRequire from 'jasmine-core/lib/jasmine-core/jasmine.js';
window.jasmineRequire = jasmineRequire;
import 'jasmine-core/lib/jasmine-core/jasmine-html.js';
import 'jasmine-core/lib/jasmine-core/boot0.js';
import 'jasmine-core/lib/jasmine-core/boot1.js';

import { initData } from './data';
import { basicMerges } from './basic-merges';
import { ajax } from 'rxjs/ajax';

initData();

// basicMerges();

// const obs$ = ajax.getJSON(`./models/mold1.view.json`);

// obs$.subscribe();

import './src/all-tests.ts';

(function bootstrap() {
  if (window.jasmineRef) {
    location.reload();

    return;
  }

  window.onload!(new Event('anything'));
  window.jasmineRef = jasmine.getEnv();
})();
