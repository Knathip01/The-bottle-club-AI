'use server'

import { login as setAuthSession, logout as clearAuthSession } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://possimon.onrender.com';

export async function register(formData: any) {
  const { firstName, lastName, email, phone, username, password } = formData;

  // Use email as username if not provided (to support email-only login)
  const effectiveUsername = username || email;

  if (!email || !password) {
    return { error: 'กรุณากรอกข้อมูลให้ครบถ้วน (อีเมล และรหัสผ่าน)' };
  }

  try {
    // 1. Try to register with external API
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
      if (!response.ok) {
        if (response.status === 409) {
          return { error: 'อีเมลนี้ถูกใช้งานแล้ว' };
        }
      }
      data = text;
    }

    // 2. Always try to save to local database for fallback
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
      
      if (existingUser.rows.length === 0) {
        await query(
          'INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4)',
          [firstName, lastName, email, hashedPassword]
        );
      }
    } catch (dbError) {
      console.error('Local registration fallback error:', dbError);
    }

    // 3. Set session
    if (response.ok && data) {
      await setAuthSession(data);
    } else {
      const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        await setAuthSession({
          id: user.id,
          username: effectiveUsername,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          is_local: true
        });
      } else {
        return { error: 'การลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' };
      }
    }
    
    revalidatePath('/');
  } catch (error: any) {
    console.error('Registration error:', error);
    
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
      
      if (existingUser.rows.length === 0) {
        await query(
          'INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4)',
          [firstName, lastName, email, hashedPassword]
        );
      }
      
      const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        await setAuthSession({
          id: user.id,
          username: effectiveUsername,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          is_local: true
        });
        revalidatePath('/');
        return redirect('/account');
      }
    } catch (dbError) {
      console.error('Final registration fallback failed:', dbError);
    }
    
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
    const url = new URL(`${API_BASE_URL}/login`);
    url.searchParams.append('username', email); 
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
      if (!response.ok) {
        // Fallback below
      } else {
        data = text;
      }
    }

    if (!response.ok) {
      try {
        const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);

        if (userResult.rows.length > 0) {
          const user = userResult.rows[0];
          const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
          
          if (isPasswordMatch) {
            const sessionData = {
              id: user.id,
              username: user.email.split('@')[0],
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
        console.error('Local login fallback error:', dbError);
      }

      return { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
    }

    await setAuthSession(data);
    revalidatePath('/');
  } catch (error: any) {
    if (error.digest?.startsWith('NEXT_REDIRECT')) throw error;
    
    try {
      const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
        if (isPasswordMatch) {
          const sessionData = {
            id: user.id,
            username: user.email.split('@')[0],
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
      console.error('API Failure fallback failed:', dbError);
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
