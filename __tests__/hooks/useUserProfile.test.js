describe('useUserProfile hooks', () => {
  test('hooks module exports expected functions', () => {
    const hooksModule = require('../../src/hooks/useUserProfile');
    expect(hooksModule.useUserProfile).toBeDefined();
    expect(hooksModule.useUpdateProfile).toBeDefined();
    expect(hooksModule.useAddAddress).toBeDefined();
    expect(hooksModule.useUpdateAddress).toBeDefined();
    expect(hooksModule.useDeleteAddress).toBeDefined();
    expect(hooksModule.useUploadImage).toBeDefined();
  });
});
