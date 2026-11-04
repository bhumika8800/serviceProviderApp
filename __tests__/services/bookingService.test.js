jest.mock('../../src/services/apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const apiClient = require('../../src/services/apiClient').default;
const bookingService = require('../../src/services/bookingService');

describe('bookingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createBooking posts to /bookings', async () => {
    const mockData = { success: true, data: {} };
    apiClient.post.mockResolvedValue(mockData);

    const input = { serviceId: 's1', addressId: 'a1', bookingDate: '2024-01-15' };
    const result = await bookingService.createBooking(input);

    expect(apiClient.post).toHaveBeenCalledWith('/bookings', input);
    expect(result).toEqual(mockData);
  });

  test('listBookings gets /bookings with query params', async () => {
    const mockData = { success: true, data: [] };
    apiClient.get.mockResolvedValue(mockData);

    await bookingService.listBookings('pending', 2, 10);

    expect(apiClient.get).toHaveBeenCalledWith('/bookings', {
      params: { status: 'pending', page: 2, limit: 10 },
    });
  });

  test('getBooking gets /bookings/:id', async () => {
    const mockData = { success: true, data: {} };
    apiClient.get.mockResolvedValue(mockData);

    await bookingService.getBooking('booking123');

    expect(apiClient.get).toHaveBeenCalledWith('/bookings/booking123');
  });

  test('cancelBooking patches /bookings/:id/cancel', async () => {
    const mockData = { success: true, data: {} };
    apiClient.patch.mockResolvedValue(mockData);

    await bookingService.cancelBooking('booking123');

    expect(apiClient.patch).toHaveBeenCalledWith('/bookings/booking123/cancel');
  });

  test('updateBookingStatus patches /bookings/:id/status', async () => {
    const mockData = { success: true, data: {} };
    apiClient.patch.mockResolvedValue(mockData);

    await bookingService.updateBookingStatus('booking123', 'confirmed');

    expect(apiClient.patch).toHaveBeenCalledWith('/bookings/booking123/status', { status: 'confirmed' });
  });
});
