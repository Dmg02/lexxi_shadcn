'use client'

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/context/useAuth'
import { useForm, SubmitHandler } from "react-hook-form"

type TInputs = {
  email: string
  password: string
}

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<TInputs>()

  const onSubmit: SubmitHandler<TInputs> = async (data) => {
    try {
      await login(data)
      router.push('/main')
    } catch (error) {
      setError('Failed to login. Please check your credentials.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-[900px] grid gap-8 md:gap-12 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div className="flex justify-center lg:justify-start items-center">
          <svg width="116" height="39" viewBox="0 0 116 39" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-auto lg:w-64">
            <path d="M0.403409 38V1.63636H4.80682V34.0938H21.7102V38H0.403409Z" fill="#58B5CA"/>
            <path d="M39.3949 38.5682C36.767 38.5682 34.5002 37.9882 32.5945 36.8281C30.7005 35.6562 29.2386 34.0227 28.2088 31.9276C27.1908 29.8205 26.6818 27.3703 26.6818 24.5767C26.6818 21.7831 27.1908 19.321 28.2088 17.1903C29.2386 15.0478 30.6709 13.3788 32.5057 12.1832C34.3523 10.9759 36.5066 10.3722 38.9688 10.3722C40.3892 10.3722 41.7919 10.6089 43.1768 11.0824C44.5618 11.5559 45.8224 12.3253 46.9588 13.3906C48.0952 14.4441 49.0007 15.8409 49.6754 17.581C50.3501 19.321 50.6875 21.4635 50.6875 24.0085V25.7841H29.6648V22.1619H46.4261C46.4261 20.6231 46.1184 19.25 45.5028 18.0426C44.8991 16.8352 44.035 15.8823 42.9105 15.1839C41.7978 14.4856 40.4839 14.1364 38.9688 14.1364C37.2997 14.1364 35.8556 14.5507 34.6364 15.3793C33.429 16.196 32.4998 17.2614 31.8487 18.5753C31.1977 19.8892 30.8722 21.2978 30.8722 22.8011V25.2159C30.8722 27.2756 31.2273 29.0215 31.9375 30.4538C32.6596 31.8743 33.6598 32.9574 34.9382 33.7031C36.2166 34.437 37.7022 34.804 39.3949 34.804C40.4957 34.804 41.4901 34.6501 42.3778 34.3423C43.2775 34.0227 44.0528 33.5492 44.7038 32.9219C45.3549 32.2827 45.858 31.4896 46.2131 30.5426L50.2614 31.679C49.8352 33.0521 49.1191 34.2595 48.1129 35.3011C47.1068 36.331 45.8639 37.1359 44.3842 37.7159C42.9046 38.2841 41.2415 38.5682 39.3949 38.5682ZM59.4544 10.7273L65.9885 21.8778L72.5225 10.7273H77.3521L68.5453 24.3636L77.3521 38H72.5225L65.9885 27.4176L59.4544 38H54.6248L63.2896 24.3636L54.6248 10.7273H59.4544ZM86.4563 10.7273L92.9904 21.8778L99.5245 10.7273H104.354L95.5472 24.3636L104.354 38H99.5245L92.9904 27.4176L86.4563 38H81.6268L90.2915 24.3636L81.6268 10.7273H86.4563ZM110.333 38V10.7273H114.524V38H110.333ZM112.464 6.18182C111.647 6.18182 110.943 5.90365 110.351 5.3473C109.771 4.79096 109.481 4.12216 109.481 3.34091C109.481 2.55966 109.771 1.89086 110.351 1.33452C110.943 0.778172 111.647 0.5 112.464 0.5C113.281 0.5 113.979 0.778172 114.559 1.33452C115.151 1.89086 115.447 2.55966 115.447 3.34091C115.447 4.12216 115.151 4.79096 114.559 5.3473C113.979 5.90365 113.281 6.18182 112.464 6.18182Z" fill="black"/>
          </svg>
        </div>
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <Button variant="outline" className="w-full" onClick={() => {/* Implement Google login */}}>
            Login with Google
          </Button>
          <div className="text-center text-sm lg:text-left">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}