import { zodResolver } from '@hookform/resolvers/zod'
import ky from 'ky'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { loginSchema, type LoginSchemaType } from '../schemas/auth'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({ resolver: zodResolver(loginSchema) })

  const submitHandler: SubmitHandler<LoginSchemaType> = async ({
    email,
    password,
  }) => {
    try {
      const { token } = await ky
        .post(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
          json: { email, passwordRaw: password },
        })
        .json<{ token: string }>()

      login(token)
      navigate('/polls')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className="h-screen flex items-center justify-center flex-col gap-5 bg-gray-100">
      <h1 className="text-2xl font-semibold">
        Insta<span className="text-purple-500">Poll</span>
      </h1>
      <div className="bg-gray-200 p-5 rounded-lg">
        <h3 className="text-xl font-semibold text-center mb-5">Login</h3>
        <form
          className="flex flex-col gap-5 w-[300px]"
          onSubmit={handleSubmit(submitHandler)}
        >
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              className="block border border-gray-300 px-1 py-2 rounded-lg w-full mt-1"
              placeholder="Email:"
              {...register('email')}
            />
            {errors.email?.message && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              className="block w-full border border-gray-300 px-1 py-2 rounded-lg mt-1"
              placeholder="*******"
              {...register('password')}
            />
            {errors.password?.message && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-purple-700 text py-2  px-4 rounded-xl mt-5 cursor-pointer hover:bg-purple-600 transition text-white"
          >
            Login
          </button>
        </form>
        <div className="flex gap-2 text-sm mt-3 items-center justify-center">
          <p className="">Don't have an account?</p>
          <Link to="/sign-up" className="underline text-purple-500">
            Create one
          </Link>
        </div>
      </div>
    </section>
  )
}
export default Login
