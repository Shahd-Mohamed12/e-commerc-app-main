import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faEnvelope,
  faShieldHalved,
  faArrowLeft,
  faKey,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { forgotPasswordAction } from '../../api/endpoints';

const schema = z.object({
  email: z.string().min(1, 'Email is required').pipe(z.email('Invalid email address'))
});

const inputClass =
  'w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all';

const steps = [
  { icon: faEnvelope, label: 'Email' },
  { icon: faKey, label: 'Code' },
  { icon: faLock, label: 'Reset' }
];

export default function ForgetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { email: '' }
  });

  const onSubmit = async (values) => {
    const res = await forgotPasswordAction(values.email);
    if (res.success) {
      toast.success(res.message || 'Reset code sent to your email');
    } else {
      toast.error(res.message || 'Failed to send reset code');
    }
  };

  return (
    <div className="container py-16 mx-auto px-4" id="forgot-password-section">
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
                    <FontAwesomeIcon icon={faLock} className="text-4xl text-primary-600" />
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
              <h2 className="text-3xl font-bold text-gray-800">Reset Your Password</h2>
              <p className="text-lg text-gray-600">
                Don't worry, it happens to the best of us. We'll help you get back into your account
                in no time.
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faEnvelope} className="text-primary-600 mr-2" />
                  Email Verification
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faShieldHalved} className="text-primary-600 mr-2" />
                  Secure Reset
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faLock} className="text-primary-600 mr-2" />
                  Encrypted
                </div>
              </div>
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
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
              <p className="text-gray-600">No worries, we'll send you a reset code</p>
            </div>

            <div className="flex items-center justify-center mb-8">
              {steps.map((step, index) => (
                <div className="flex items-center" key={step.label}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      index === 0
                        ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <FontAwesomeIcon icon={step.icon} />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-16 h-0.5 mx-2 transition-all duration-300 bg-gray-200"></div>
                  )}
                </div>
              ))}
            </div>

            <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className={inputClass}
                    placeholder="Enter your email address"
                    aria-invalid={!!errors.email}
                    {...register('email')}
                  />
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 mt-2">* {errors.email.message}</p>
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
                    Sending...
                  </span>
                ) : (
                  'Send Reset Code'
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