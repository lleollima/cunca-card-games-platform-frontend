import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utilitário para combinar classes CSS do Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Decodifica um JWT token e retorna o payload
 */
export function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
}

/**
 * Verifica se um JWT token está expirado
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
}

/**
 * Extrai informações do usuário de um JWT token
 */
export function getUserFromToken(token: string): { id: string; name: string; email: string } | null {
  try {
    const payload = decodeJWT(token);
    if (!payload) return null;

    return {
      id: payload.sub || payload.userId || payload.id,
      name: payload.name || payload.username || payload.email?.split('@')[0] || 'Usuário',
      email: payload.email || '',
    };
  } catch (error) {
    console.error('Erro ao extrair usuário do token:', error);
    return null;
  }
}

