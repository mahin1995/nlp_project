export const JWT_TOKEN_FIELD_NAME: string  = "jwt_token";
export const USER_NAME_FIELD_NAME: string  = "user";

export const getJwtToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(JWT_TOKEN_FIELD_NAME);
  }
  return null;
}