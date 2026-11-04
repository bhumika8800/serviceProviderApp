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
const servicesCatalog = require('../../src/services/servicesCatalog');

describe('servicesCatalog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('listCategories gets /categories', async () => {
    const mockData = { success: true, data: [] };
    apiClient.get.mockResolvedValue(mockData);

    await servicesCatalog.listCategories();

    expect(apiClient.get).toHaveBeenCalledWith('/categories', { params: undefined });
  });

  test('listCategories with parentId passes param', async () => {
    const mockData = { success: true, data: [] };
    apiClient.get.mockResolvedValue(mockData);

    await servicesCatalog.listCategories('cat123');

    expect(apiClient.get).toHaveBeenCalledWith('/categories', {
      params: { parentId: 'cat123' },
    });
  });

  test('listServices gets /services with params', async () => {
    const mockData = { success: true, data: [] };
    apiClient.get.mockResolvedValue(mockData);

    await servicesCatalog.listServices({ q: 'clean', categoryId: 'cat1', page: 1, limit: 10 });

    expect(apiClient.get).toHaveBeenCalledWith('/services', {
      params: { q: 'clean', categoryId: 'cat1', page: 1, limit: 10 },
    });
  });

  test('getService gets /services/:id', async () => {
    const mockData = { success: true, data: {} };
    apiClient.get.mockResolvedValue(mockData);

    await servicesCatalog.getService('svc123');

    expect(apiClient.get).toHaveBeenCalledWith('/services/svc123');
  });

  test('updateService patches /services/:id', async () => {
    const mockData = { success: true, data: {} };
    apiClient.patch.mockResolvedValue(mockData);

    await servicesCatalog.updateService('svc123', { isActive: false });

    expect(apiClient.patch).toHaveBeenCalledWith('/services/svc123', { isActive: false });
  });
});
