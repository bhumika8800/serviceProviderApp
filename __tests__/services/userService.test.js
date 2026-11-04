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
const userService = require('../../src/services/userService');

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getMe gets /users/me', async () => {
    const mockData = { success: true, data: { user: {} } };
    apiClient.get.mockResolvedValue(mockData);

    await userService.getMe();

    expect(apiClient.get).toHaveBeenCalledWith('/users/me');
  });

  test('updateProfile patches /users/me', async () => {
    const mockData = { success: true, data: { user: {} } };
    apiClient.patch.mockResolvedValue(mockData);

    await userService.updateProfile({ firstName: 'John' });

    expect(apiClient.patch).toHaveBeenCalledWith('/users/me', { firstName: 'John' });
  });

  test('addAddress posts to /users/me/addresses', async () => {
    const mockData = { success: true, data: { user: {} } };
    apiClient.post.mockResolvedValue(mockData);

    const address = { line1: '123 Main', city: 'Mumbai', state: 'MH', pincode: '400001' };
    await userService.addAddress(address);

    expect(apiClient.post).toHaveBeenCalledWith('/users/me/addresses', address);
  });

  test('deleteAddress deletes /users/me/addresses/:id', async () => {
    const mockData = { success: true, data: { user: {} } };
    apiClient.delete.mockResolvedValue(mockData);

    await userService.deleteAddress('addr123');

    expect(apiClient.delete).toHaveBeenCalledWith('/users/me/addresses/addr123');
  });

  test('uploadImage posts FormData to /users/me/upload-image', async () => {
    const mockData = { success: true, data: { user: {} } };
    apiClient.post.mockResolvedValue(mockData);

    await userService.uploadImage('file:///path/to/image.jpg');

    expect(apiClient.post).toHaveBeenCalledWith(
      '/users/me/upload-image',
      expect.any(FormData),
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    );
  });

  test('completeProfile posts to /auth/complete-profile', async () => {
    const mockData = { success: true, data: { user: {} } };
    apiClient.post.mockResolvedValue(mockData);

    const data = { firstName: 'John', lastName: 'Doe', email: 'john@test.com' };
    await userService.completeProfile(data);

    expect(apiClient.post).toHaveBeenCalledWith('/auth/complete-profile', data);
  });
});
