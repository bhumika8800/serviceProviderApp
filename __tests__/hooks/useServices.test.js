describe('useServices hooks', () => {
  test('hooks module exports expected functions', () => {
    const hooksModule = require('../../src/hooks/useServices');
    expect(hooksModule.useCategories).toBeDefined();
    expect(hooksModule.useServices).toBeDefined();
    expect(hooksModule.useService).toBeDefined();
  });
});
