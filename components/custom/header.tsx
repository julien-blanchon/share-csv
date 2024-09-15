import Image from 'next/image'
import { LoginDialog } from "./login"
import { RegisterDialog } from "./register"
import { createClient } from '@/utils/supabase/server'
import { AvatarDropdown } from "./AvatarDropdown"

export default async function Component() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  return (
    <div className="flex items-center justify-between w-full">
      {/* TODO: Fix display, height has no impact right now and it overlays with toggle*/}
      <Image src="/logo_name.svg" alt="Logo" width="100" height={450} />
      <div className="ml-auto flex gap-2">
        {data?.user ? (
          <AvatarDropdown user={data.user} />
        ) : (
          <div className="flex gap-2">
            <LoginDialog />
            <RegisterDialog />
          </div>
        )}
      </div>
    </div>
  )
}
