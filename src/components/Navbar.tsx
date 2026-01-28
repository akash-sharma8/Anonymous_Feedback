'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { User } from 'next-auth'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur border-b border-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 
      flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-extrabold tracking-wide text-indigo-400"
        >
          Mstry Message
        </Link>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-200"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-gray-300">
                Welcome,{' '}
                <span className="text-white font-medium">
                  {user.username || user.email}
                </span>
              </span>
              <Button
                onClick={() => signOut()}
                variant="outline"
                className="bg-gray-100 text-black"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button variant="outline" className="bg-gray-100 text-black">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 bg-gray-900 border-t border-gray-800">
          {session ? (
            <div className="flex flex-col gap-3 mt-3">
              <span className="text-sm text-gray-300">
                Welcome,{' '}
                <span className="text-white font-medium">
                  {user.username || user.email}
                </span>
              </span>
              <Button
                onClick={() => {
                  signOut()
                  setOpen(false)
                }}
                variant="outline"
                className="bg-gray-100 text-black"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/sign-in" onClick={() => setOpen(false)}>
              <Button
                variant="outline"
                className="bg-gray-100 text-black mt-3 w-full"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
