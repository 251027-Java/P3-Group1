// Single-SPA entry point for Angular MFE
import { enableProdMode, NgZone } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { Router, NavigationStart } from '@angular/router';
import { singleSpaAngular, getSingleSpaExtraProviders } from 'single-spa-angular';
import { App } from './app/app';
import { appConfig } from './app/app.config';

// Enable production mode
enableProdMode();

// Single-SPA lifecycle configuration
const lifecycles = singleSpaAngular({
    bootstrapFunction: (singleSpaProps: any) => {
        // Merge single-spa extra providers with app config
        const mergedConfig = {
            ...appConfig,
            providers: [
                ...(appConfig.providers || []),
                getSingleSpaExtraProviders(),
            ],
        };
        return bootstrapApplication(App, mergedConfig);
    },
    template: '<app-root />',
    Router,
    NavigationStart,
    NgZone,
});

// Export lifecycle methods for single-spa
// single-spa-angular returns an object with bootstrap, mount, unmount
export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
