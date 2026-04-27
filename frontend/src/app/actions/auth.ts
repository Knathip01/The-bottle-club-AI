'use server'

import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { login as setAuthSession, logout as clearAuthSession } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function register(formData: any) {
  const { firstName, lastName, email, password } = formData;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    // Check if user exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return { error: 'User already exists' };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const result = await query(
      'INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name',
      [firstName, lastName, email, passwordHash]
    );

    const user = result.rows[0];

    // Set session
    await setAuthSession(user);

    revalidatePath('/');
  } catch (error: any) {
    console.error('Registration error:', error);
    return { error: 'Failed to register. Please ensure your database is set up correctly.' };
  }

  redirect('/account');
}

export async function login(formData: any) {
  const { email, password } = formData;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    // Find user
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return { error: 'Invalid email or password' };
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return { error: 'Invalid email or password' };
    }

    // Set session (exclude password hash)
    const { password_hash, ...userWithoutPassword } = user;
    await setAuthSession(userWithoutPassword);

    revalidatePath('/');
  } catch (error: any) {
    console.error('Login error:', error);
    return { error: 'Failed to login. Please ensure your database is set up correctly.' };
  }

  redirect('/account');
}

export async function logout() {
  await clearAuthSession();
  revalidatePath('/');
  redirect('/login');
}
