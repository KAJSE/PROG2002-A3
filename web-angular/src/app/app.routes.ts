import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Search } from './search/search';
import { Detail } from './detail/detail';
import { AddRegistration } from './add-registration/add-registration';

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
  },
  {
    path: 'register/:id',
    component: AddRegistration
  }
];
