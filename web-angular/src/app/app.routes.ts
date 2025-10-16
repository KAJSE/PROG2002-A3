import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Search } from './search/search';
import { Detail } from './detail/detail';
import { AddRegistration } from './add-registration/add-registration';
import { Admin } from './admin/admin';
import { Categories } from './admin/categories/categories';
import { Organisations } from './admin/organisations/organisations';
import { Events } from './admin/events/events';

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
  },
  {
    path: 'admin',
    component: Admin,
    children: [
      { path: '', redirectTo: 'categories', pathMatch: 'full' },
      { path: 'categories', component: Categories },
      { path: 'organisations', component: Organisations },
      { path: 'events', component: Events },
    ]
  },
];
