import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { Login } from './components/login/login';
import { CreateAccount } from './components/create-account/create-account';
import { EmptyRouteComponent } from './empty-route/empty-route.component';

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
    },
    // Catch-all route for Single-SPA - handles routes not meant for this MFE
    {
        path: '**',
        component: EmptyRouteComponent
    }
];
