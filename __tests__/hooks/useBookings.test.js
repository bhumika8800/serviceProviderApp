describe('useBookings hooks', () => {
  test('hooks module exports expected functions', () => {
    const hooksModule = require('../../src/hooks/useBookings');
    expect(hooksModule.useBookings).toBeDefined();
    expect(hooksModule.useBooking).toBeDefined();
    expect(hooksModule.useCreateBooking).toBeDefined();
    expect(hooksModule.useCancelBooking).toBeDefined();
  });
});
