import { registerApplication, start, LifeCycles } from "single-spa";

// Register React Users MFE
// Routes: /users/*, /profile, /GamesDashboard, /CommunityHub, etc.
registerApplication({
    name: "@gamehub/react-users",
    app: (): Promise<LifeCycles> => System.import("@gamehub/react-users"),
    activeWhen: (location) => {
        // React app handles: user-related routes and main game content
        const reactRoutes = [
            "/users",
            "/profile",
            "/GamesDashboard",
            "/CommunityHub",
            "/CommunityThreads",
            "/games",
            "/Wishlist",
            "/Rewards",
            "/BuyTokens",
            "/UploadGame",
            "/Cart",
        ];
        // Match if path starts with any of the react routes
        return reactRoutes.some(
            (route) =>
                location.pathname === route ||
                location.pathname.startsWith(route + "/")
        );
    },
    customProps: {
        domElementGetter: () => {
            let el = document.getElementById("react-users-container");
            if (!el) {
                el = document.createElement("div");
                el.id = "react-users-container";
                document.body.appendChild(el);
            }
            return el;
        },
    },
});

// Register Angular Auth MFE
// Routes: /auth/*, /login, /create-account, and root landing page "/"
registerApplication({
    name: "@gamehub/angular-auth",
    app: (): Promise<LifeCycles> => System.import("@gamehub/angular-auth"),
    activeWhen: (location) => {
        // Angular app handles: auth routes and landing page
        const angularRoutes = ["/auth", "/login", "/create-account"];
        // Root path "/" goes to Angular (landing page)
        if (location.pathname === "/" || location.pathname === "") {
            return true;
        }
        return angularRoutes.some(
            (route) =>
                location.pathname === route ||
                location.pathname.startsWith(route + "/")
        );
    },
    customProps: {
        domElementGetter: () => {
            let el = document.getElementById("angular-auth-container");
            if (!el) {
                el = document.createElement("div");
                el.id = "angular-auth-container";
                document.body.appendChild(el);
            }
            return el;
        },
    },
});

// Start single-spa - this triggers the initial route matching and app loading
start({
    urlRerouteOnly: true,
});

console.log("[Root Config] Single-SPA started successfully");
console.log("[Root Config] Registered applications: @gamehub/react-users, @gamehub/angular-auth");
