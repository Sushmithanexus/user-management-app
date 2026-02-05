// Authentication helper functions
export async function signup(page, userData) {
  await page.goto('/signup');
  await page.fill('input[name="username"]', userData.username);
  await page.fill('input[name="email"]', userData.email);
  await page.fill('input[name="password"]', userData.password);
  await page.fill('input[name="confirmPassword"]', userData.password);

  if (userData.phoneNumber) {
    await page.fill('input[name="phoneNumber"]', userData.phoneNumber);
  }

  if (userData.dateOfBirth) {
    await page.fill('input[name="dateOfBirth"]', userData.dateOfBirth);
  }

  await page.click('button[type="submit"]');
}

export async function login(page, username, password) {
  await page.goto('/login');
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
}

export async function logout(page) {
  await page.click('button:has-text("Logout")');
}

export async function isLoggedIn(page) {
  const logoutButton = await page.locator('button:has-text("Logout")').count();
  return logoutButton > 0;
}

export async function getStoredToken(page) {
  return await page.evaluate(() => localStorage.getItem('token'));
}

export async function getStoredUser(page) {
  return await page.evaluate(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });
}

export async function clearAuth(page) {
  // Navigate to home page first to ensure localStorage is accessible
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  });
}
