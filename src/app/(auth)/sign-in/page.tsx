'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { signIn } from 'next-auth/react'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { signInSchema } from '@/Schemas/signInSchema'

export default function SignInForm() {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    })

    if (result?.error) {
      toast({
        title: 'Login Failed',
        description:
          result.error === 'CredentialsSignin'
            ? 'Incorrect username or password'
            : result.error,
        variant: 'destructive',
      })
      return
    }

    if (result?.url) {
      router.replace('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome Back 
          </h1>
          <p className="text-sm text-gray-500">
            Sign in to continue your anonymous conversations
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <Input
                    {...field}
                    placeholder="Enter your email or username"
                    className="rounded-xl"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    {...field}
                    placeholder="••••••••"
                    className="rounded-xl"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full rounded-xl text-base"
            >
              Sign In
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Not a member yet?{' '}
          <Link
            href="/sign-up"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}
