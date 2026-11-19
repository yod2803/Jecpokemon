import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Caught } from './pages/caught/caught';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'caught', component: Caught },
  { path: 'caught/:data', component: Caught },
  { path: '**', redirectTo: '' },
];