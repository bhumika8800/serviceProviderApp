describe('useUserRole', () => {
  test('hook module exports useUserRole function', () => {
    const hookModule = require('../../src/hooks/useUserRole');
    expect(hookModule.useUserRole).toBeDefined();
    expect(typeof hookModule.useUserRole).toBe('function');
  });

  test('useAuthStore can set customer role', () => {
    const { useAuthStore } = require('../../src/store/useAuthStore');
    useAuthStore.setState({
      user: { id: '1', role: 'customer' },
      isAuthenticated: true,
    });

    const state = useAuthStore.getState();
    expect(state.user.role).toBe('customer');
  });

  test('useAuthStore can set admin role', () => {
    const { useAuthStore } = require('../../src/store/useAuthStore');
    useAuthStore.setState({
      user: { id: '2', role: 'admin' },
      isAuthenticated: true,
    });

    const state = useAuthStore.getState();
    expect(state.user.role).toBe('admin');
  });
});
