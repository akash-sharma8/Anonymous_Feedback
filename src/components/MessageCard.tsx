'use client'
import React from 'react'
import {
  Card,
  CardHeader,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import dayjs from 'dayjs'
import { X, MessageSquareText } from 'lucide-react'
import { Message } from '@/model/User'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'

type MessageCardProps = {
  message: Message
  onMessageDelete: (messageId: string) => void
}

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      )
      toast.success(response.data.message)
      onMessageDelete(message._id.toString())
    } catch {
      toast.error('Failed to delete message')
    }
  }

  return (
    <Card
      className="
        relative overflow-hidden rounded-2xl
        border border-gray-200 bg-white
        shadow-[0_8px_30px_rgb(0,0,0,0.06)]
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-[0_16px_40px_rgb(0,0,0,0.10)]
      "
    >
      {/* Gradient Accent */}
      <div className="absolute inset-x-0 top-0 h-1" />

      <CardHeader className="space-y-4">
        {/* Top Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <MessageSquareText className="h-5 w-5" />
            </div>

            <span className="text-xs font-medium text-gray-400">
              Anonymous message
            </span>
          </div>

          {/* Delete */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action is permanent and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Message Text */}
        <p className="text-sm leading-relaxed text-gray-800">
          {message.content}
        </p>

        {/* Timestamp */}
        <div className="flex justify-end">
          <span className="text-xs text-gray-400">
            {dayjs(message.createdAt).format('MMM D, YYYY • h:mm A')}
          </span>
        </div>
      </CardHeader>
    </Card>
  )
}
