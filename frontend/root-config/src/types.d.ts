// SystemJS type declarations
declare var System: {
    import<T = unknown>(moduleId: string): Promise<T>;
};
