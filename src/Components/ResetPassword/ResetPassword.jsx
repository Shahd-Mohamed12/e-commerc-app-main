import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faEnvelope,
  faKey,
  faArrowLeft,
  faEye,
  faEyeSlash,
  faSpinner,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';
import { verifyResetCodeAction, resetPasswordAction } from '../../api/endpoints';

const schema = z
  .object({
    resetCode: z.string().min(1, 'Reset code is required'),
    password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

const inputClass =
  'w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all';

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const emailFromQuery = searchParams.get('email') || '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { resetCode: '', password: '', confirmPassword: '' }
  });

  const onSubmit = async (values) => {
    if (!emailFromQuery) {
      toast.error('Email is required to reset your password');
      return;
    }

    const verifyRes = await verifyResetCodeAction(values.resetCode);
    if (!verifyRes.success) {
      toast.error(verifyRes.message || 'Reset code is invalid or has expired');
      return;
    }

    const resetRes = await resetPasswordAction(emailFromQuery, values.password);
    if (resetRes.success) {
      toast.success(resetRes.message || 'Password reset successfully');
      router.push('/login');
    } else {
      toast.error(resetRes.message || 'Failed to reset password');
    }
  };

  return (
    <div className="container py-16 mx-auto px-4" id="reset-password-section">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        <div className="hidden lg:block">
          <div className="text-center space-y-6">
            <div className="w-full h-96 bg-gradient-to-br from-primary-50 via-green-50 to-emerald-50 rounded-2xl shadow-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-8 left-8 w-24 h-24 rounded-full bg-primary-100/50"></div>
              <div className="absolute bottom-12 right-10 w-32 h-32 rounded-full bg-green-100/50"></div>
              <div className="absolute top-20 right-20 w-16 h-16 rounded-full bg-emerald-100/50"></div>
              <div className="relative flex flex-col items-center gap-6 z-10">
                <div className="w-28 h-28 rounded-3xl bg-white shadow-xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center">
                    <FontAwesomeIcon icon={faKey} className="text-4xl text-primary-600" />
                  </div>
                </div>
                <div className="absolute -left-16 top-4 w-14 h-14 rounded-xl bg-white shadow-lg flex items-center justify-center -rotate-12">
                  <FontAwesomeIcon icon={faEnvelope} className="text-xl text-primary-500" />
                </div>
                <div className="absolute -right-16 top-8 w-14 h-14 rounded-xl bg-white shadow-lg flex items-center justify-center rotate-12">
                  <FontAwesomeIcon icon={faShieldHalved} className="text-xl text-green-500" />
                </div>
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary-400 animate-pulse"></div>
                  <div className="w-3 h-3 rounded-full bg-primary-500 animate-pulse [animation-delay:150ms]"></div>
                  <div className="w-3 h-3 rounded-full bg-primary-600 animate-pulse [animation-delay:300ms]"></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">Choose a New Password</h2>
              <p className="text-lg text-gray-600">
                Pick a strong password you haven't used before to keep your account secure.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-primary-600">
                  Fresh<span className="text-gray-800">Cart</span>
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
              <p className="text-gray-600">Enter the reset code and your new password</p>
            </div>

            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-600 text-white ring-4 ring-primary-100 flex items-center justify-center">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div className="w-16 h-0.5 mx-2 bg-primary-600"></div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-600 text-white ring-4 ring-primary-100 flex items-center justify-center">
                  <FontAwesomeIcon icon={faKey} />
                </div>
                <div className="w-16 h-0.5 mx-2 bg-gray-200"></div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                  <FontAwesomeIcon icon={faLock} />
                </div>
              </div>
            </div>

            <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="resetCode" className="block text-sm font-semibold text-gray-700 mb-2">
                  Reset Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="resetCode"
                    className={inputClass}
                    placeholder="Enter the reset code"
                    aria-invalid={!!errors.resetCode}
                    {...register('resetCode')}
                  />
                  <FontAwesomeIcon
                    icon={faKey}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
                {errors.resetCode && (
                  <p className="text-sm text-red-600 mt-2">* {errors.resetCode.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={`${inputClass} pr-12`}
                    placeholder="Enter your new password"
                    aria-invalid={!!errors.password}
                    {...register('password')}
                  />
                  <FontAwesomeIcon
                    icon={faLock}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-2">* {errors.password.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className={inputClass}
                    placeholder="Confirm your new password"
                    aria-invalid={!!errors.confirmPassword}
                    {...register('confirmPassword')}
                  />
                  <FontAwesomeIcon
                    icon={faLock}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-2">* {errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl hover:bg-primary-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    Updating...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}