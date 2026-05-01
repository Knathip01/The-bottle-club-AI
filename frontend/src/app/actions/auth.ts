'use server'

import { login as setAuthSession, logout as clearAuthSession } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://possimon.onrender.com';

export async function register(formData: any) {
  const { firstName, lastName, email, phone, username, password } = formData;

  if (!email || !password || !username) {
    return { error: 'กรุณากรอกข้อมูลให้ครบถ้วน (อีเมล, ชื่อผู้ใช้ และรหัสผ่าน)' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone || '',
        username: username,
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
      if (!response.ok) {
        return { error: `เซิร์ฟเวอร์เกิดข้อผิดพลาด (${response.status}): ${text.slice(0, 50)}` };
      }
      data = text;
    }

    if (!response.ok) {
      console.error('Register API Error Response:', data);
      let errorMessage = 'การลงทะเบียนไม่สำเร็จ';
      if (data && typeof data === 'object' && data.detail) {
        if (Array.isArray(data.detail)) {
          errorMessage = data.detail[0]?.msg || errorMessage;
        } else {
          errorMessage = data.detail;
        }
      }
      return { error: errorMessage };
    }

    await setAuthSession(data);
    revalidatePath('/');
  } catch (error: any) {
    console.error('Registration error:', error);
    return { error: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง' };
  }

  redirect('/account');
}

export async function login(formData: any) {
  const { username, password } = formData;

  if (!username || !password) {
    return { error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' };
  }

  try {
    const url = new URL(`${API_BASE_URL}/login`);
    url.searchParams.append('username', username);
    url.searchParams.append('password', password);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    });

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Login API Non-JSON Response:', text);
      if (!response.ok) {
        return { error: `ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (${response.status})` };
      }
      data = text;
    }

    if (!response.ok) {
      console.error('Login API Error Response:', data);
      
      // FALLBACK: Try local database for "old data" users
      try {
        console.log('Attempting local database login fallback for:', username);
        const userResult = await query(
          'SELECT * FROM users WHERE username = $1 OR email = $1',
          [username]
        );

        if (userResult.rows.length > 0) {
          const user = userResult.rows[0];
          const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
          
          if (isPasswordMatch) {
            console.log('Local database login successful for:', username);
            const sessionData = {
              id: user.id,
              username: user.username,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              is_local: true // Flag to indicate this is a local user
            };
            await setAuthSession(sessionData);
            revalidatePath('/');
            return redirect('/account');
          }
        }
      } catch (dbError) {
        console.error('Local database fallback error:', dbError);
      }

      let errorMessage = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
      if (data && typeof data === 'object' && data.detail) {
        if (Array.isArray(data.detail)) {
          errorMessage = data.detail[0]?.msg || errorMessage;
        } else {
          errorMessage = data.detail;
        }
      }
      return { error: errorMessage };
    }

    await setAuthSession(data);
    revalidatePath('/');
  } catch (error: any) {
    if (error.digest?.startsWith('NEXT_REDIRECT')) throw error; // Allow redirects to work
    console.error('Login error:', error);
    
    // Also try local database if API is down
    try {
      const userResult = await query(
        'SELECT * FROM users WHERE username = $1 OR email = $1',
        [username]
      );

      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
        
        if (isPasswordMatch) {
          const sessionData = {
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            is_local: true
          };
          await setAuthSession(sessionData);
          revalidatePath('/');
          return redirect('/account');
        }
      }
    } catch (dbError) {
      console.error('Local database fallback error during API failure:', dbError);
    }
    
    return { error: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง' };
  }

  redirect('/account');
}

export async function logout() {
  await clearAuthSession();
  revalidatePath('/');
  redirect('/login');
}

