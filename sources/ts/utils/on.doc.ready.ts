export const onDocReady = (): Promise<Event> => new Promise((resolve): void => document.addEventListener("DOMContentLoaded", resolve));