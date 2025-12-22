import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';
// Mock window.navigator.storage.persist if not available
if (!navigator.storage) {
    Object.defineProperty(navigator, 'storage', {
        value: {},
        writable: true,
    });
}
if (!navigator.storage.persist) {
    navigator.storage.persist = async () => true;
}
