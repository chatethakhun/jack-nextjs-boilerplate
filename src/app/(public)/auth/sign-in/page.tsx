import { UserForm } from '@/components/forms/user-form';

export default function SignInPage() {
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
          <UserForm />
        </div>
      </div>
    </div>
  );
}
