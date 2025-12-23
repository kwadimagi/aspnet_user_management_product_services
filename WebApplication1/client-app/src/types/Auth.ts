// src/types/Auth.ts
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface AuthResponseDto {
  success: boolean;
  message: string;
  token: string;
  expiresAt: string;
}