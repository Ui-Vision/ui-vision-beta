export async function fetchUserData() {
  try {
    const res = await fetch("/api/user", { method: "GET" });
    if (!res.ok) {
      throw new Error(`Failed to fetch user: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}
