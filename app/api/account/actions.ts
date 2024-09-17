'use server'
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
    // Redirect to an error page or show an error message
    redirect('/error')
  }

  // Log the user in
  await login(formData)
  
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