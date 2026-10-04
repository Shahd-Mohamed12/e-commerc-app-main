import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faSpinner,
  faTruck,
  faShieldHalved,
  faClock,
  faUsers,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { setAuth } from '../../redux/authSlice';
import { loginAction } from '../../api/endpoints';
const authImg = '/auth-illustration.png';

const schema = z.object({
  email: z.string().min(1, 'Email is required').pipe(z.email('Invalid email address')),
  password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean()
});

const inputClass =
  'w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all';

const socialClass =
  'w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-200';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '', rememberMe: false }
  });

  const onSubmit = async (values) => {
    try {
      const res = await loginAction(values);
      if (res.success) {
        toast.success(res.message);
        dispatch(
          setAuth({
            isAuthenticated: true,
            user: res.data?.user,
            token: res.data?.token
          })
        );
        router.push('/');
      } else {
        toast.error(res.message || 'Login failed. Please try again.');
      }
    } catch {
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <div className="container py-16 mx-auto px-4" id="login-section">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        <div className="hidden lg:block">
          <div className="text-center space-y-6">
            <img
              src={authImg}
              alt="fresh vegetables and fruits shopping cart illustration, modern clean style, green theme"
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">
                FreshCart - Your One-Stop Shop for Fresh Products
              </h2>
              <p className="text-lg text-gray-600">
                Join thousands of happy customers who trust FreshCart for their daily grocery needs
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faTruck} className="text-primary-600 mr-2" />
                  Free Delivery
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faShieldHalved} className="text-primary-600 mr-2" />
                  Secure Payment
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faClock} className="text-primary-600 mr-2" />
                  24/7 Support
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
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
              <p className="text-gray-600">Sign in to continue your fresh shopping experience</p>
            </div>

            <div className="space-y-3 mb-6">
              <button type="button" className={socialClass}>
                <FontAwesomeIcon icon={faGoogle} className="text-red-500 text-lg" />
                <span className="font-medium text-gray-700">Continue with Google</span>
              </button>
              <button type="button" className={socialClass}>
                <FontAwesomeIcon icon={faFacebook} className="text-blue-600 text-lg" />
                <span className="font-medium text-gray-700">Continue with Facebook</span>
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">OR CONTINUE WITH EMAIL</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    className={inputClass}
                    placeholder="Enter your email"
                    id="email"
                    name="email"
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

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>
                  <Link
                    href="/forget-password"
                    className="text-sm text-primary-600 hover:text-primary-700 cursor-pointer font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={`${inputClass} pr-12`}
                    placeholder="Enter your password"
                    name="password"
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

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 accent-primary-600 border-2 border-gray-300 rounded focus:ring-primary-500"
                    name="rememberMe"
                    {...register('rememberMe')}
                  />
                  <span className="ml-3 text-sm text-gray-700">Keep me signed in</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl hover:bg-primary-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="text-center mt-8 pt-6 border-t border-gray-100">
              <p className="text-gray-600">
                New to FreshCart?
                <Link
                  href="/register"
                  className="text-primary-600 hover:text-primary-700 ms-2 font-semibold cursor-pointer"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-6 mt-6 text-xs text-gray-500">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faLock} className="mr-1" />
              SSL Secured
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faUsers} className="mr-1" />
              50K+ Users
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faStar} className="mr-1" />
              4.9 Rating
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}