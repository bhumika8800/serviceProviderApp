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
const notificationService = require('../../src/services/notificationService');

describe('notificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('listNotifications gets /notifications with pagination', async () => {
    const mockData = { success: true, data: { notifications: [], unreadCount: 0 } };
    apiClient.get.mockResolvedValue(mockData);

    await notificationService.listNotifications(2, 10);

    expect(apiClient.get).toHaveBeenCalledWith('/notifications', {
      params: { page: 2, limit: 10 },
    });
  });

  test('markRead patches /notifications/:id/read', async () => {
    const mockData = { success: true, data: {} };
    apiClient.patch.mockResolvedValue(mockData);

    await notificationService.markRead('notif123');

    expect(apiClient.patch).toHaveBeenCalledWith('/notifications/notif123/read');
  });

  test('markAllRead patches /notifications/read-all', async () => {
    const mockData = { success: true, data: { updated: true } };
    apiClient.patch.mockResolvedValue(mockData);

    await notificationService.markAllRead();

    expect(apiClient.patch).toHaveBeenCalledWith('/notifications/read-all');
  });
});
