export type AuthJwt = {
  id?: string;
  organisationId?: string;
  name?: string;
  email?: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  roles?: string[];
  permissions?: string[];
  error?: string;
};

export type AuthUser = {
  id: string;
  organisationId: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  roles: string[];
  permissions: string[];
};
