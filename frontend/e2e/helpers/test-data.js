// Test data for E2E tests
export const testUsers = {
  admin: {
    username: 'admin_test_' + Date.now(),
    email: 'admin_' + Date.now() + '@test.com',
    password: 'Admin@123456',
    phoneNumber: '1234567890',
    dateOfBirth: '1990-01-01'
  },
  regular: {
    username: 'user_test_' + Date.now(),
    email: 'user_' + Date.now() + '@test.com',
    password: 'User@123456',
    phoneNumber: '9876543210',
    dateOfBirth: '1995-05-15'
  },
  update: {
    username: 'updated_user_' + Date.now(),
    email: 'updated_' + Date.now() + '@test.com',
    phoneNumber: '5555555555',
    dateOfBirth: '1992-12-25'
  }
};

export const invalidCredentials = {
  username: 'nonexistent_user',
  password: 'wrongpassword'
};

export const apiEndpoints = {
  signup: '/api/auth/signup',
  login: '/api/auth/login',
  users: '/api/users',
  profile: '/api/users/me'
};
