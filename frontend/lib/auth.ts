export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export type User = { id: string; name: string; email: string; createdAt?: string };
export function saveSession(token: string, user: User) {
  localStorage.setItem("northstar_token", token);
  localStorage.setItem("northstar_user", JSON.stringify(user));
}
