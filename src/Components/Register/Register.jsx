import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faTruckFast,
  faShieldHalved,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { setAuth } from '../../redux/authSlice';
import { signupAction } from '../../api/endpoints';
const reviewAuthor = '/review-author.png';

const schema = z
  .object({
    name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').pipe(z.email('Invalid email address')),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one symbol'),
    rePassword: z.string().min(1, 'Confirm password is required'),
    phone: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^[+]?[\d\s-]{8,}$/, 'Invalid phone number'),
    terms: z.literal(true, { error: 'You must agree to the terms' })
  })
  .refine((data) => data.password === data.rePassword, {
    message: 'Passwords do not match',
    path: ['rePassword']
  });

function getPasswordStrength(password = '') {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (!password) return { label: 'Weak', width: 0, color: 'bg-red-500' };
  if (score <= 1) return { label: 'Weak', width: 25, color: 'bg-red-500' };
  if (score === 2) return { label: 'Fair', width: 50, color: 'bg-yellow-500' };
  if (score === 3) return { label: 'Good', width: 75, color: 'bg-blue-500' };
  return { label: 'Strong', width: 100, color: 'bg-green-500' };
}

const features = [
  {
    icon: faStar,
    title: 'Premium Quality',
    text: 'Premium quality products sourced from trusted suppliers.'
  },
  {
    icon: faTruckFast,
    title: 'Fast Delivery',
    text: 'Same-day delivery available in most areas'
  },
  {
    icon: faShieldHalved,
    title: 'Secure Shopping',
    text: 'Your data and payments are completely secure'
  }
];

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [passwordValue, setPasswordValue] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { name: '', email: '', password: '', rePassword: '', phone: '', terms: false }
  });

  const strength = useMemo(() => getPasswordStrength(passwordValue), [passwordValue]);

  const onSubmit = async (values) => {
    try {
      const res = await signupAction(values);
      if (res.success) {
        toast.success(res.message || 'Your account has been created successfully');
        if (res.data?.token) {
          dispatch(
            setAuth({
              isAuthenticated: true,
              user: res.data?.user,
              token: res.data?.token
            })
          );
          router.push('/');
          return;
        }
        router.push('/login');
      } else {
        toast.error(res.message || 'Failed to create account. Please try again.');
      }
    } catch {
      toast.error('Failed to create account. Please try again.');
    }
  };

  return (
    <main className="py-10">
      <div className="container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-4">
        <div>
          <h1 className="text-4xl font-bold">
            Welcome to <span className="text-primary-600">FreshCart</span>
          </h1>
          <p className="text-xl mt-2 mb-4">
            Join thousands of happy customers who enjoy fresh groceries delivered right to their
            doorstep.
          </p>

          <ul className="*:flex *:items-start *:gap-4 space-y-6 my-8">
            {features.map((feature) => (
              <li key={feature.title}>
                <div className="icon size-12 text-lg bg-primary-200 text-primary-600 rounded-full flex justify-center items-center">
                  <FontAwesomeIcon icon={feature.icon} />
                </div>
                <div className="content">
                  <h2 className="text-lg font-semibold">{feature.title}</h2>
                  <p className="text-gray-600">{feature.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="review bg-white shadow-sm p-4 rounded-md">
            <div className="author flex items-center gap-4 mb-4">
              <img alt="" src={reviewAuthor} className="size-12 rounded-full" />
              <div>
                <h3>Sarah Johnson</h3>
                <div className="rating *:text-yellow-300">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesomeIcon key={star} icon={faStar} />
                  ))}
                </div>
              </div>
            </div>
            <blockquote>
              <p className="italic text-gray-600">
                "FreshCart has transformed my shopping experience. The quality of the products is
                outstanding, and the delivery is always on time. Highly recommend!"
              </p>
            </blockquote>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg px-6 py-10">
          <h2 className="text-center text-3xl font-semibold mb-2">Create Your Account</h2>
          <p className="text-center">Start your fresh journey with us today</p>

          <div className="register-options flex gap-2 *:grow my-10">
            <button
              type="button"
              className="btn bg-transparent border border-gray-300 hover:bg-gray-100 flex justify-center items-center"
              aria-label="Sign up with Google"
            >
              <FontAwesomeIcon icon={faGoogle} className="me-2 text-red-600" />
              <span>Google</span>
            </button>
            <button
              type="button"
              className="btn bg-transparent border border-gray-300 hover:bg-gray-100 flex justify-center items-center"
              aria-label="Sign up with Facebook"
            >
              <FontAwesomeIcon icon={faFacebook} className="me-2 text-blue-600" />
              <span>Facebook</span>
            </button>
          </div>

          <div
            className="divider relative w-full h-0.5 bg-gray-300/30 my-4 flex items-center before:content-['or'] before:absolute before:top-1/2 before:left-1/2 before:-translate-1-1/2 before:bg-white before:px-4"
            aria-hidden="true"
          >
            <span className="sr-only">or</span>
          </div>

          <form className="space-y-7" noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Name*</label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Ali"
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-red-600 text-sm">* {errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="ali@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-600 text-sm">* {errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="password">Password*</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="create a strong password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  {...register('password', {
                    onChange: (event) => setPasswordValue(event.target.value)
                  })}
                />
                <div className="password-requirements">
                  <div className="flex items-center gap-2">
                    <div
                      className="bar grow h-1 bg-gray-200 rounded-md overflow-hidden"
                      role="progressbar"
                      aria-valuenow={strength.width}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Password strength: ${strength.label}`}
                    >
                      <div
                        className={`progress ${strength.color} h-full transition-all duration-300 ease-out`}
                        style={{ width: `${strength.width}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium min-w-[50px]">{strength.label}</span>
                  </div>
                </div>
                <p className="text-gray-500 -mt-2 text-xs">
                  Must be at least 8 characters with numbers and symbols
                </p>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm">* {errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="rePassword">Confirm Password*</label>
              <input
                type="password"
                id="rePassword"
                className="form-control"
                placeholder="confirm your password"
                autoComplete="new-password"
                aria-invalid={!!errors.rePassword}
                {...register('rePassword')}
              />
              {errors.rePassword && (
                <p className="text-red-600 text-sm">* {errors.rePassword.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone">Phone Number*</label>
              <input
                type="tel"
                id="phone"
                className="form-control"
                placeholder="+1 234 567 8900"
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-red-600 text-sm">* {errors.phone.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="size-4 accent-primary-600"
                  aria-invalid={!!errors.terms}
                  {...register('terms')}
                />
                <label htmlFor="terms" className="ms-2">
                  I agree to the{' '}
                  <a className="text-primary-600 hover:underline" href="/terms">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a className="text-primary-600 hover:underline" href="/privacy-policy">
                    Privacy Policy
                  </a>
                  *
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-600 text-sm mt-1">* {errors.terms.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed w-full transition-colors"
              aria-busy={isSubmitting}
            >
              <FontAwesomeIcon icon={faUserPlus} className="me-2" />
              <span>{isSubmitting ? 'Creating Account...' : 'Create My Account'}</span>
            </button>
          </form>

          <p className="border-t pt-10 border-gray-300/30 my-4 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}