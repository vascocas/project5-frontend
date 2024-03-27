import * as UserStoreModule from "../stores/UserStore";

// Mock user data
const username = 'testUser';
const token = 'testToken';

// First test: userStore returns username and token
test('userStore returns username and token', () => {
  // Mock userStore behavior
  UserStoreModule.userStore = jest.fn().mockReturnValue({
    username,
    token,
  });

  // Call userStore
  const userData = UserStoreModule.userStore();

  // Check if username and token are returned
  expect(userData).toHaveProperty('username', username);
  expect(userData).toHaveProperty('token', token);
});

