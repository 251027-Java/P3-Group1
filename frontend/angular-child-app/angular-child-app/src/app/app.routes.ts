import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { Login } from './components/login/login';
import { CreateAccount } from './components/create-account/create-account';

export const routes: Routes = [
    {
        path: '',
        component: LandingPage
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'create-account',
        component: CreateAccount
    }
];
