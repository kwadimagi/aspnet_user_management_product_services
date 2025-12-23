// src/services/authService.ts
import api from './api';
import { LoginDto, RegisterDto, AuthResponseDto } from '../types/Auth';

const AUTH_ENDPOINT = '/auth';

export const authService = {
  login: async (credentials: LoginDto): Promise<AuthResponseDto> => {
    const response = await api.post<AuthResponseDto>(`${AUTH_ENDPOINT}/login`, credentials);
    return response.data;
  },

  register: async (userData: RegisterDto): Promise<AuthResponseDto> => {
    const response = await api.post<AuthResponseDto>(`${AUTH_ENDPOINT}/register`, userData);
    return response.data;
  },

  changePassword: async (passwordData: any): Promise<AuthResponseDto> => {
    const response = await api.put<AuthResponseDto>(`${AUTH_ENDPOINT}/changepassword`, passwordData);
    return response.data;
  },
};