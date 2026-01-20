'use client';
import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/Schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner';

const UserDashboard = () => {


    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)


    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id.toString() !== messageId))
    }
    const { data: session } = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const { register, watch, setValue } = form
    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages');
            setValue('acceptMessages', response.data.isAcceptingMessages ?? false);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ??
                'Failed to fetch message settings')
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue, toast]);

    const fetchMessages = useCallback(
        async (refresh: boolean = false) => {
            setIsLoading(true);
            setIsSwitchLoading(false);
            try {
                const response = await axios.get<ApiResponse>('/api/get-messages');
                setMessages(response.data.messages || []);
                if (refresh) {
                    toast.success('Messages refreshed', {
                        description: 'Showing latest messages',
                    });
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast.error(axiosError.response?.data.message ?? 'Failed to fetch messages');
            } finally {
                setIsLoading(false);
                setIsSwitchLoading(false);
            }
        },
        [setIsLoading, setMessages, toast]
    );

    useEffect(() => {

        if (!session || !session.user) return

        fetchMessages()
        fetchAcceptMessages()

    }, [session, setValue, fetchAcceptMessages, fetchMessages])

    const handleSwitchChange = async () => {
        try {
            
            const response = await axios.post('/api/accept-messages', {
                acceptMessages: !acceptMessages,
            });
            setValue('acceptMessages', !acceptMessages);
            toast.success(response.data.message);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(
                axiosError.response?.data.message ??
                'Failed to update message settings'
            );
        }
    };

   if (!session || !session.user) {
  return (
    <main className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Please login</h1>
        <p className="text-gray-400">
          You must be signed in to access the dashboard.
        </p>
        <Button asChild>
          <a href="/sign-in">Go to Login</a>
        </Button>
      </div>
    </main>
  );
}
    const { username } = session?.user as User
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipBoard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast.success('Profile URL has been copied to clipboard.');
    }



    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipBoard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            key={message._id.toString()}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>

    )
}

export default UserDashboard
