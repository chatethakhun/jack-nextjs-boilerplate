// app/login/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { SignInFormData, signInSchema } from '@/schema/sign-in.schema';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      console.log('Login data:', data);
      // TODO: เรียก API login ของคุณที่นี่
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      // })

      // ถ้าสำเร็จ redirect ไป dashboard
      // window.location.href = '/dashboard'
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ยินดีต้อนรับ
            </h1>
            <p className="text-gray-600">เข้าสู่ระบบเพื่อดำเนินการต่อ</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                อีเมล
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                รหัสผ่าน
              </label>
              <input
                {...register('password')}
                type="password"
                id="password"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
