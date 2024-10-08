import Image from 'next/image'
import { LoginDialog } from "./login"
import { RegisterDialog } from "./register"
import { createClient } from '@/utils/supabase/server'
import { AvatarDropdown } from "./AvatarDropdown"
import { FilesDropdown } from "./files-dropdown"
import { ShareDialog } from "./share"
import type { User as UserSupabase } from '@supabase/supabase-js';
import Link from 'next/link'

export default async function Component() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()

  return (
    <div className="flex items-center justify-between w-full px-4 py-2 gap-2">
      {/* TODO: Fix display, height has no impact right now and it overlays with toggle*/}
      <Link href="/">
        <Image src="/logo.svg" alt="Logo" width="40" height="40" />
      </Link>
      {data?.user && <FilesDropdown />}

      <div className="ml-auto flex gap-4">
        {data?.user ? (
          <>
            <ShareDialog />
            <AvatarDropdown user={data.user} />
          </>
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
