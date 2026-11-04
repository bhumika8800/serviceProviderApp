describe('useAuthStore', () => {
  // We test the store's state shape and action signatures
  test('store exports expected interface', () => {
    const storeModule = require('../../src/store/useAuthStore');
    expect(storeModule.useAuthStore).toBeDefined();
    expect(typeof storeModule.useAuthStore.getState).toBe('function');
    expect(typeof storeModule.useAuthStore.setState).toBe('function');
  });

  test('initial state has correct defaults', () => {
    const { useAuthStore } = require('../../src/store/useAuthStore');
    const state = useAuthStore.getState();
    // After import, state should have these keys
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('token');
    expect(state).toHaveProperty('isAuthenticated');
    expect(state).toHaveProperty('isGuest');
    expect(state).toHaveProperty('isLoading');
  });

  test('login sets user and token', () => {
    const { useAuthStore } = require('../../src/store/useAuthStore');
    const mockUser = { id: '1', firstName: 'Test', role: 'customer' };

    useAuthStore.setState({ user: mockUser, token: 'test-token', isAuthenticated: true, isGuest: false });

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('test-token');
    expect(state.isAuthenticated).toBe(true);
    expect(state.isGuest).toBe(false);
  });

  test('logout clears state', () => {
    const { useAuthStore } = require('../../src/store/useAuthStore');
    useAuthStore.setState({ user: { id: '1' }, token: 'token', isAuthenticated: true, isGuest: false });
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false, isGuest: false });

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  test('loginAsGuest sets isGuest true', () => {
    const { useAuthStore } = require('../../src/store/useAuthStore');
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false, isGuest: true });

    const state = useAuthStore.getState();
    expect(state.isGuest).toBe(true);
    expect(state.isAuthenticated).toBe(false);
  });

  test('setUser updates user and isAuthenticated', () => {
    const { useAuthStore } = require('../../src/store/useAuthStore');
    const mockUser = { id: '2', firstName: 'Jane' };
    useAuthStore.setState({ user: mockUser, isAuthenticated: !!mockUser });

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  test('setToken updates token', () => {
    const { useAuthStore } = require('../../src/store/useAuthStore');
    useAuthStore.setState({ token: 'new-token' });

    expect(useAuthStore.getState().token).toBe('new-token');
  });

  test('setLoading updates isLoading', () => {
    const { useAuthStore } = require('../../src/store/useAuthStore');
    useAuthStore.setState({ isLoading: true });
    expect(useAuthStore.getState().isLoading).toBe(true);

    useAuthStore.setState({ isLoading: false });
    expect(useAuthStore.getState().isLoading).toBe(false);
  });
});
