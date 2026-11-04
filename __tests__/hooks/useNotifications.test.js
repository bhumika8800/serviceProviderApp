describe('useNotifications hooks', () => {
  test('hooks module exports expected functions', () => {
    const hooksModule = require('../../src/hooks/useNotifications');
    expect(hooksModule.useNotifications).toBeDefined();
    expect(hooksModule.useMarkNotificationRead).toBeDefined();
    expect(hooksModule.useMarkAllNotificationsRead).toBeDefined();
  });
});
