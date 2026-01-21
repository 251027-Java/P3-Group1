import { Component } from '@angular/core';

/**
 * Empty route component for Single-SPA compatibility.
 * This component is used when the Angular app is not active
 * to prevent routing errors.
 */
@Component({
    selector: 'app-empty-route',
    template: '',
    standalone: true,
})
export class EmptyRouteComponent { }
