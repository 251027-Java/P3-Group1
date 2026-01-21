import {
  BrowserPlatformLocation,
  PlatformLocation
} from "./chunk-5JRBXVLQ.js";
import {
  DOCUMENT,
  Inject,
  Injectable,
  __spreadValues,
  enableProdMode,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵgetInheritedFactory
} from "./chunk-YXYHJZHY.js";

// node_modules/single-spa-angular/fesm2022/single-spa-angular-internals.mjs
function getContainerElementAndSetTemplate(options, props) {
  const domElementGetter = chooseDomElementGetter(options, props);
  if ((typeof ngDevMode === "undefined" || ngDevMode) && !domElementGetter) {
    throw Error(`Cannot mount angular application '${props.name || props.appName}' without a domElementGetter provided either as an opt or a prop`);
  }
  const containerElement = getContainerElement(domElementGetter, props);
  containerElement.innerHTML = options.template;
  return containerElement;
}
function getContainerElement(domElementGetter, props) {
  const element = domElementGetter(props);
  if ((typeof ngDevMode === "undefined" || ngDevMode) && !element) {
    throw Error("domElementGetter did not return a valid dom element");
  }
  return element;
}
function chooseDomElementGetter(opts, props) {
  props = props?.customProps ?? props;
  if (props.domElement) {
    return () => props.domElement;
  } else if (props.domElementGetter) {
    return props.domElementGetter;
  } else if (opts.domElementGetter) {
    return opts.domElementGetter;
  } else {
    return defaultDomElementGetter(props.name);
  }
}
function defaultDomElementGetter(name) {
  return function getDefaultDomElement() {
    const id = `single-spa-application:${name}`;
    let domElement = document.getElementById(id);
    if (!domElement) {
      domElement = document.createElement("div");
      domElement.id = id;
      document.body.appendChild(domElement);
    }
    return domElement;
  };
}

// node_modules/single-spa-angular/fesm2022/single-spa-angular.mjs
function enableProdMode2() {
  try {
    enableProdMode();
  } catch {
  }
}
var SingleSpaPlatformLocation = class _SingleSpaPlatformLocation extends BrowserPlatformLocation {
  constructor() {
    super(...arguments);
    this.skipNextPopState = false;
    this.source = "Window.addEventListener:popstate";
  }
  pushState(state, title, url) {
    this.skipNextPopState = true;
    super.pushState(state, title, url);
  }
  replaceState(state, title, url) {
    this.skipNextPopState = true;
    super.replaceState(state, title, url);
  }
  onPopState(fn) {
    const zone = Zone.current;
    fn = zone.wrap(fn, this.source);
    const onPopStateListener = (event) => {
      const popStateEventWasDispatchedBySingleSpa = !!event.singleSpa;
      if (this.skipNextPopState && popStateEventWasDispatchedBySingleSpa) {
        this.skipNextPopState = false;
      } else {
        fn(event);
      }
    };
    return super.onPopState(onPopStateListener);
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵSingleSpaPlatformLocation_BaseFactory;
      return function SingleSpaPlatformLocation_Factory(__ngFactoryType__) {
        return (ɵSingleSpaPlatformLocation_BaseFactory || (ɵSingleSpaPlatformLocation_BaseFactory = ɵɵgetInheritedFactory(_SingleSpaPlatformLocation)))(__ngFactoryType__ || _SingleSpaPlatformLocation);
      };
    })();
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _SingleSpaPlatformLocation,
      factory: _SingleSpaPlatformLocation.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SingleSpaPlatformLocation, [{
    type: Injectable
  }], null, null);
})();
function getSingleSpaExtraProviders() {
  return [{
    provide: SingleSpaPlatformLocation,
    deps: [[new Inject(DOCUMENT)]]
  }, {
    provide: PlatformLocation,
    useExisting: SingleSpaPlatformLocation
  }];
}
var defaultOptions = {
  // Required options that will be set by the library consumer.
  NgZone: null,
  bootstrapFunction: null,
  template: null,
  // Optional options
  Router: void 0,
  domElementGetter: void 0,
  // only optional if you provide a domElementGetter as a custom prop
  updateFunction: () => Promise.resolve(),
  bootstrappedNgModuleRefOrAppRef: null
};
var NG_DEV_MODE = typeof ngDevMode === "undefined" || ngDevMode;
function singleSpaAngular(userOptions) {
  if (NG_DEV_MODE && typeof userOptions !== "object") {
    throw Error("single-spa-angular requires a configuration object");
  }
  const options = __spreadValues(__spreadValues({}, defaultOptions), userOptions);
  if (NG_DEV_MODE && typeof options.bootstrapFunction !== "function") {
    throw Error("single-spa-angular must be passed an options.bootstrapFunction");
  }
  if (NG_DEV_MODE && typeof options.template !== "string") {
    throw Error("single-spa-angular must be passed options.template string");
  }
  if (NG_DEV_MODE && !options.NgZone) {
    throw Error(`single-spa-angular must be passed the NgZone option`);
  }
  if (NG_DEV_MODE && options.Router && !options.NavigationStart) {
    console.warn(`single-spa-angular must be passed the NavigationStart option`);
  }
  return {
    bootstrap: bootstrap.bind(null, options),
    mount: mount.bind(null, options),
    unmount: unmount.bind(null, options),
    update: options.updateFunction
  };
}
async function bootstrap(options) {
  if (options.NgZone === "noop") {
    return;
  }
  options.NgZone.assertInAngularZone = () => {
  };
  options.NgZone.assertNotInAngularZone = () => {
  };
  options.routingEventListener = () => {
    options.bootstrappedNgZone.run(() => {
    });
  };
}
async function mount(options, props) {
  getContainerElementAndSetTemplate(options, props);
  const bootstrapPromise = options.bootstrapFunction(props);
  if (NG_DEV_MODE && !(bootstrapPromise instanceof Promise)) {
    throw Error(`single-spa-angular: the options.bootstrapFunction must return a promise, but instead returned a '${typeof bootstrapPromise}' that is not a Promise`);
  }
  const ngModuleRefOrAppRef = await bootstrapPromise;
  if (NG_DEV_MODE) {
    if (!ngModuleRefOrAppRef || typeof ngModuleRefOrAppRef.destroy !== "function") {
      throw Error(`single-spa-angular: the options.bootstrapFunction returned a promise that did not resolve with a valid Angular module or ApplicationRef. Did you call platformBrowserDynamic().bootstrapModule() correctly?`);
    }
  }
  const singleSpaPlatformLocation = ngModuleRefOrAppRef.injector.get(SingleSpaPlatformLocation, null);
  const ngZoneEnabled = options.NgZone !== "noop";
  if (NG_DEV_MODE && ngZoneEnabled && options.Router && singleSpaPlatformLocation === null) {
    throw new Error(`
      single-spa-angular: could not retrieve extra providers from the platform injector. Did you call platformBrowserDynamic(getSingleSpaExtraProviders()).bootstrapModule()?
    `);
  }
  const bootstrappedOptions = options;
  if (ngZoneEnabled) {
    const ngZone = ngModuleRefOrAppRef.injector.get(options.NgZone);
    if (singleSpaPlatformLocation !== null) {
      skipLocationChangeOnNonImperativeRoutingTriggers(ngModuleRefOrAppRef, options);
    }
    bootstrappedOptions.bootstrappedNgZone = ngZone;
    window.addEventListener("single-spa:routing-event", bootstrappedOptions.routingEventListener);
  }
  bootstrappedOptions.bootstrappedNgModuleRefOrAppRef = ngModuleRefOrAppRef;
  return ngModuleRefOrAppRef;
}
function unmount(options) {
  return Promise.resolve().then(() => {
    if (options.routingEventListener) {
      window.removeEventListener("single-spa:routing-event", options.routingEventListener);
    }
    options.bootstrappedNgModuleRefOrAppRef.destroy();
    options.bootstrappedNgModuleRefOrAppRef = null;
  });
}
function skipLocationChangeOnNonImperativeRoutingTriggers(ngModuleRefOrAppRef, options) {
  if (!options.NavigationStart) {
    return;
  }
  const router = ngModuleRefOrAppRef.injector.get(options.Router);
  const subscription = router.events.subscribe((event) => {
    if (event instanceof options.NavigationStart) {
      const currentNavigation = router.getCurrentNavigation();
      if (currentNavigation.trigger !== "imperative") {
        currentNavigation.extras.skipLocationChange = true;
        currentNavigation.extras.replaceUrl = false;
      }
    }
  });
  ngModuleRefOrAppRef.onDestroy(() => subscription.unsubscribe());
}
export {
  enableProdMode2 as enableProdMode,
  getSingleSpaExtraProviders,
  singleSpaAngular
};
//# sourceMappingURL=single-spa-angular.js.map
