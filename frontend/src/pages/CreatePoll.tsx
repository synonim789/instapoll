import ky from 'ky'
import { useFieldArray, useForm } from 'react-hook-form'
import { IoIosClose } from 'react-icons/io'
import { useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import Navbar from '../components/Navbar'
import { type Poll } from '../types'

type FormValues = {
  options: { value: string }[]
  question: string
}

const CreatePoll = () => {
  const { control, register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      options: [{ value: '' }],
    },
  })
  const { token } = useAuth()
  const navigate = useNavigate()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  })

  const onSubmit = async (data: FormValues) => {
    const options = data.options.map((o) => o.value)
    try {
      await ky
        .post(`${import.meta.env.VITE_SERVER_URL}/poll`, {
          json: {
            options,
            question: data.question,
          },
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .json<Poll>()
      navigate('/polls')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col items-center justify-center"
      >
        <div className="w-full max-w-md mt-6">
          <input
            {...register('question')}
            placeholder="Question"
            className="border border-gray-300  p-2 rounded start items-start w-full"
          />
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-center gap-2 w-full max-w-md"
          >
            <input
              {...register(`options.${index}.value`)}
              placeholder={`Option #${index + 1}`}
              className="border border-gray-300 p-2 rounded w-full"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="bg-red-500 rounded-lg cursor-pointer"
            >
              <IoIosClose size={30} className="text-white" />
            </button>
          </div>
        ))}

        <div className="flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => append({ value: '' })}
            className="bg-gray-300 rounded-lg px-4 py-2 border border-gray-400 cursor-pointer"
          >
            Add Option
          </button>

          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}
export default CreatePoll
