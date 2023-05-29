import React, { useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { sizes } from './base/ButtonBase';
import { FieldError, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { error } from 'console';

type Props = {
  close: () => void;
};

const registerSchema = yup.object({
  email: yup.string().email('Невалідний формат').required("Обов'язково"),
  password: yup
    .string()
    .min(10, 'Мінімальна довжина 10 символів')
    .required("Обов'язково"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password')], 'Паролі мають співпадати')
    .min(10, 'Мінімальна довжина 10 символів')
    .required("Обов'язково"),
});
type RegisterFormData = yup.InferType<typeof registerSchema>;

type InputProps = { errors?: FieldError; type: 'text' | 'password' };

// eslint-disable-next-line react/display-name
const Input = React.forwardRef(({ errors, ...r }: InputProps, ref: any) => {
  const rest = r as any;
  return (
    <div>
      <input ref={ref} className='p-4' placeholder={rest.name} {...rest} />
      <p className='text-red-400'>{errors && errors.message}</p>
    </div>
  );
});

const RegisterTab = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = () => {};

  return (
    <form className='grid gap-3' onSubmit={handleSubmit(onSubmit)}>
      <Input type='text' errors={errors.email} {...register('email')} />
      <Input
        type='password'
        errors={errors.password}
        {...register('password')}
      />
      <Input
        type='password'
        errors={errors.passwordConfirm}
        {...register('passwordConfirm')}
      />
      <input
        value='Реєстрація'
        className='bg-sky-500 py-3'
        type='submit'
      ></input>
    </form>
  );
};

const loginSchema = yup.object({
  email: yup.string().email('Невалідний формат').required("Обов'язково"),
  password: yup
    .string()
    .min(10, 'Мінімальна довжина 10 символів')
    .required("Обов'язково"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password')], 'Паролі мають співпадати')
    .min(10, 'Мінімальна довжина 10 символів')
    .required("Обов'язково"),
});
type LoginFormData = yup.InferType<typeof registerSchema>;

const LoginTab = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => console.log(data);

  return (
    <form
      className='grid gap-3'
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)();
      }}
    >
      <Input type='text' errors={errors.email} {...register('email')} />
      <Input
        type='password'
        errors={errors.password}
        {...register('password')}
      />
      <input className='bg-sky-500 py-3' type='submit' value='Увійти' />
    </form>
  );
};

const Form = ({ close }: Props) => {
  const loggedIn = false;
  const [tab, setTab] = useState(0);
  return (
    <div className='bg-zinc-300 bg-opacity-5 p-8'>
      <button className='mb-4 block hover:text-rose-600' onClick={close}>
        <AiFillCloseCircle size={sizes.md} />
      </button>
      {!loggedIn && (
        <div>
          <div className='mb-8 flex gap-4'>
            <button
              onClick={() => setTab(0)}
              className={`${tab === 0 ? 'text-rose-600' : ''}`}
            >
              Вхід
            </button>
            <div className='w-[1px] bg-white'></div>
            <button
              onClick={() => setTab(1)}
              className={`${tab === 1 ? 'text-rose-600' : ''}`}
            >
              Реєстрація
            </button>
          </div>
          {tab === 0 && <LoginTab />}
          {tab === 1 && <RegisterTab />}
        </div>
      )}
      {loggedIn && (
        <div>
          <p className='mb-8 text-center text-3xl'>Збережені сцени</p>
          <div className='mb-8 flex gap-4'>
            <div className='bg-white p-8'></div>
            <div className='bg-white p-8'></div>
            <div className='bg-white p-8'></div>
            <div className='bg-white p-8'></div>
          </div>
          <button className='w-full bg-red-700 py-4'>Вийти</button>
        </div>
      )}
    </div>
  );
};

export { Form };
