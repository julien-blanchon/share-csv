'use server'
// import type { NextApiRequest, NextApiResponse } from 'next'
// import { z } from 'zod'
// const loginSchema = z.object({
//   // ...
// })

// const registerSchema = z.object({
//   // ...
// })

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = createClient()

  // Collect form data
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    firstName: formData.get('first-name') as string,
    lastName: formData.get('last-name') as string,
  }

  // Optionally validate form data here
  console.log('Signup data:', data)

  // Attempt sign up
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
    },
  })

  if (error) {
    console.log('Signup error:', error)
    // Redirect to an error page or show an error message
    redirect('/error')
  }

  // Revalidate path or perform other actions upon success
  revalidatePath('/')
  redirect('/')
}

export async function login(formData: FormData) {
  const supabase = createClient()

  // Collect form data
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Optionally validate form data here
  console.log('Login data:', data)

  // Attempt to sign in
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    console.log('Login error:', error)
    // Redirect to an error page or show an error message
    redirect('/error')
  }

  // Revalidate path or perform other actions upon success
  revalidatePath('/')
  redirect('/')
}