const API_BASE_URL = "https://giftr.mad9124.rocks";
const API_KEY = "mckennr"; // this should be YOUR college username

// Manuel did changes
export async function getNewAuthToken(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/tokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    console.warn(response);
    return null;
  }

  const { data } = await response.json();
  return data.token;
}

export async function getCurrentUser(authToken) {
  if (!authToken) return;

  const response = await fetch(`${API_BASE_URL}/auth/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    console.warn(response);
    return;
  }

  const { data } = await response.json();
  return data;
}
