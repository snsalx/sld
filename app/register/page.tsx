"use client"

import { redirect } from 'next/navigation';
import PocketBase from 'pocketbase'
import { FormEvent, useEffect } from 'react'

export default function RegisterPage() {
  const pb = new PocketBase('http://localhost:8090');

  useEffect(() => {
    console.log(pb.authStore)
    if (pb.authStore.isValid) {
      redirect('/')
    }
  }, [])

  async function handleSubmit(formData: FormData) {
    const data: any = {...Object.fromEntries(formData.entries()), emailVisibility: false, verified: false}

    await pb.collection('users').create(data)
    await pb.collection('users').authWithPassword(data.email, data.password)
    redirect('/')

    // TODO add error handling
  }
  
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-mantle">
      <form className='w-80 grid bg-base p-2 gap-2' action={handleSubmit}>
        <label>
          Name
          <input name="name" className="bg-mantle p-2 rounded-lg" />
        </label>

        <label>
          E-mail
          <input name="email" type="email" className="bg-mantle p-2 rounded-lg" />
        </label>

        <label>
          Password
          <input name="password" type="password" className="bg-mantle p-2 rounded-lg" />
        </label>

        <label>
          Password Confirmation
          <input name="passwordConfirm" type="password" className="bg-mantle p-2 rounded-lg" />
        </label>

        <button className='p-2 bg-blue text-base rounded-lg'>Register</button>
        <p>Already have an account? <a href="/login">Log in</a></p>
      </form>
    </div>
  )
}
