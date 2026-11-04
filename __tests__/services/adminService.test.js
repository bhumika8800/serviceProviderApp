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
const adminService = require('../../src/services/adminService');

describe('adminService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAdminStats calls GET /admin/stats', async () => {
    const mockData = { success: true, data: { totalUsers: 10 } };
    apiClient.get.mockResolvedValue(mockData);

    const result = await adminService.getAdminStats();

    expect(apiClient.get).toHaveBeenCalledWith('/admin/stats');
    expect(result).toEqual(mockData);
  });

  test('listUsers calls GET /admin/users with params', async () => {
    const mockData = { success: true, data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
    apiClient.get.mockResolvedValue(mockData);

    await adminService.listUsers({ role: 'customer', q: 'test' });

    expect(apiClient.get).toHaveBeenCalledWith('/admin/users', {
      params: { role: 'customer', q: 'test' },
    });
  });

  test('toggleUserActive calls PATCH /admin/users/:id/active', async () => {
    const mockData = { success: true, data: { user: {} } };
    apiClient.patch.mockResolvedValue(mockData);

    await adminService.toggleUserActive('user123', false);

    expect(apiClient.patch).toHaveBeenCalledWith('/admin/users/user123/active', { isActive: false });
  });

  test('listAdminBookings calls GET /admin/bookings', async () => {
    const mockData = { success: true, data: [] };
    apiClient.get.mockResolvedValue(mockData);

    await adminService.listAdminBookings('pending');

    expect(apiClient.get).toHaveBeenCalledWith('/admin/bookings', {
      params: { status: 'pending' },
    });
  });
});
