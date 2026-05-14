'use server'

import { login as setAuthSession, logout as clearAuthSession } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://possimon.onrender.com';

export async function register(formData: any) {
  const { firstName, lastName, email, phone, username, password } = formData;

  const effectiveUsername = username || email;

  if (!email || !password) {
    return { error: 'กรุณากรอกข้อมูลให้ครบถ้วน (อีเมล และรหัสผ่าน)' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone || '',
        username: effectiveUsername,
        password: password
      }),
    });

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Register API Non-JSON Response:', text);
      return { error: 'การลงทะเบียนไม่สำเร็จ: เซิร์ฟเวอร์ส่งการตอบกลับที่ไม่ถูกต้อง' };
    }

    if (!response.ok) {
      if (response.status === 409) {
        return { error: 'อีเมลนี้หรือชื่อผู้ใช้นี้ถูกใช้งานแล้ว' };
      }
      return { error: data.detail || data.message || 'การลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' };
    }

    // After successful registration, login the user
    await setAuthSession(data);
    revalidatePath('/');
  } catch (error: any) {
    console.error('Registration error:', error);
    return { error: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง' };
  }

  redirect('/account');
}

export async function login(formData: any) {
  const { email, password } = formData;

  if (!email || !password) {
    return { error: 'กรุณากรอกอีเมลและรหัสผ่าน' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/web`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password
      }),
    });

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Login API Non-JSON Response:', text);
      return { error: 'เข้าสู่ระบบไม่สำเร็จ: เซิร์ฟเวอร์ส่งการตอบกลับที่ไม่ถูกต้อง' };
    }

    if (!response.ok) {
      return { error: data.detail || data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
    }

    await setAuthSession(data);
    revalidatePath('/');
  } catch (error: any) {
    if (error.digest?.startsWith('NEXT_REDIRECT')) throw error;
    console.error('Login error:', error);
    return { error: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง' };
  }

  redirect('/account');
}

export async function setSessionFromToken(token: string) {
  try {
    // 1. Decode the token payload (it's a base64 encoded JSON)
    const parts = token.split('.');
    if (parts.length < 2) return { error: 'Invalid token format' };
    
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
    
    // 2. Extract user info from payload
    // Adjust based on typical JWT structures (id/sub, username/name, email)
    const user = {
      id: payload.id || payload.sub || 0,
      username: payload.username || payload.name || payload.email?.split('@')[0] || 'User',
      email: payload.email || '',
      first_name: payload.first_name || payload.name?.split(' ')[0] || '',
      last_name: payload.last_name || payload.name?.split(' ')[1] || '',
      access_token: token // Keep the token for future API calls
    };

    // 3. Create our own session cookie for Next.js
    await setAuthSession(user);
    
    return { success: true, user };
  } catch (error) {
    console.error('Error in setSessionFromToken:', error);
    return { error: 'Failed to process token' };
  }
}

export async function logout() {
  await clearAuthSession();
  revalidatePath('/');
  redirect('/login');
}
