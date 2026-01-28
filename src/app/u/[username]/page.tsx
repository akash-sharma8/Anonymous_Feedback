'use client'

import React, { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import * as z from 'zod'
import { ApiResponse } from '@/types/ApiResponse'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { messageSchema } from '@/Schemas/messageSchema'

const specialChar = '||'

const parseStringMessages = (messageString: string | unknown): string[] => {
  if (typeof messageString !== 'string') return []
  return messageString.split(specialChar)
}

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?"

export default function SendMessage() {
  const params = useParams<{ username: string }>()
  const username = params.username

  const [suggestions, setSuggestions] = useState(initialMessageString)
  const [isSuggestLoading, setIsSuggestLoading] = useState(false)
  const [suggestError, setSuggestError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  })

  const messageContent = form.watch('content')

  const handleMessageClick = (message: string) => {
    form.setValue('content', message)
  }

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      })
      toast.success(response.data.message)
      form.reset({ content: '' })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(
        axiosError.response?.data.message ?? 'Failed to send message'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true)
    setSuggestError(null)
    try {
      const res = await axios.post<ApiResponse<string>>('/api/suggest-messages')
      setSuggestions(res.data.data || initialMessageString)
    } catch (error: any) {
      setSuggestError(error.message || 'Failed to fetch suggestions')
    } finally {
      setIsSuggestLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Send Anonymous Message
          </h1>
          <p className="text-gray-500">
            Share honest thoughts with <span className="font-medium">@{username}</span>
          </p>
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Your Message</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anonymous Message</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={5}
                          placeholder="Write your message here..."
                          className="
                            w-full resize-none rounded-xl border
                            border-gray-300 px-4 py-3 text-sm
                            focus:outline-none focus:ring-2 focus:ring-indigo-500
                          "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full rounded-xl"
                  disabled={isLoading || !messageContent}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send Message
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Need inspiration?</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading}
              className="flex gap-1"
            >
              <Sparkles className="h-4 w-4" />
              {isSuggestLoading ? 'Loading...' : 'Suggest'}
            </Button>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-2">
            {suggestError ? (
              <p className="text-sm text-red-500">{suggestError}</p>
            ) : (
              parseStringMessages(suggestions).map((message, index) => (
                <button
                  key={index}
                  onClick={() => handleMessageClick(message)}
                  className="
                    rounded-full border border-gray-300
                    px-4 py-1.5 text-sm
                    text-gray-700 hover:bg-gray-100
                    transition
                  "
                >
                  {message}
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Separator />

        <div className="text-center space-y-3">
          <p className="text-gray-500">Want your own message board?</p>
          <Link href="/sign-up">
            <Button className="rounded-xl">Create Your Account</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
