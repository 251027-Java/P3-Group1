import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { Login } from './components/login/login';
import { CreateAccount } from './components/create-account/create-account';
import { BubbleTroubleComponent } from './bubble-trouble/bubble-trouble.component';
import { FlappyBirdComponent } from './flappy-bird/flappy-bird.component';


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
    {
        path: 'bubble-trouble',
        component: BubbleTroubleComponent
    },
    {
        path: 'flappy-bird',
        component: FlappyBirdComponent
    }
];
