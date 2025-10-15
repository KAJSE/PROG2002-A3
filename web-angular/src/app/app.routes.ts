import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Search } from './search/search';
import { Detail } from './detail/detail';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'search',
    component: Search
  },
  {
    path: 'detail/:id',
    component: Detail
  }
];
