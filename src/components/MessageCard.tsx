'use client'
import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
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
import dayjs from 'dayjs';
import { X } from 'lucide-react'
import { Message } from '@/model/User'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            toast.success(response.data.message)
            onMessageDelete(message._id.toString())
        } catch (error) {
            toast.error('Failed to delete message')
        }
    }

    return (
        <Card className="card-bordered max-w-full break-words">
    <CardHeader>
        <div className="flex justify-between items-start w-full">
            <CardTitle className="break-words max-w-full">
                {message.content}
            </CardTitle>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant='destructive' className="ml-2">
                        <X className="w-5 h-5" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this message.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
        <div className="text-sm mt-1">
            {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
    </CardHeader>
    <CardContent></CardContent>
</Card>


    );
}