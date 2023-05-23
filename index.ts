import './style.css';

import { initData } from './data';
import { basicMerges } from './basic-merges';
import { ajax } from 'rxjs/ajax';

initData();

basicMerges();


const obs$ = ajax.getJSON(`./models/mold1.view.json`)

obs$.subscribe()