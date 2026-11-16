export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResDto {
  accessToken: string;
  refreshToken: string;
  expiresDate: string;
}

export interface UserDto {
  employeeId: string | null;
  customerId: string | null;
  userId: string;
  username: string;
  role: string;
  isActive: boolean;
}

export interface TokenDto {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenDto {
  token: string;
}

export interface RoleListDto {
  id: string;
  role: string;
}
export interface ChangePwdDto {
  oldPwd: string;
  newPwd: string;
}