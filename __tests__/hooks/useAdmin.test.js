describe('useAdmin hooks', () => {
  test('hooks module exports expected functions', () => {
    const hooksModule = require('../../src/hooks/useAdmin');
    expect(hooksModule.useAdminStats).toBeDefined();
    expect(hooksModule.useAdminUsers).toBeDefined();
    expect(hooksModule.useToggleUserActive).toBeDefined();
    expect(hooksModule.useAdminBookings).toBeDefined();
  });
});
