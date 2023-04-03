import React from 'react'

function Avatar({ children }: {children: React.ReactNode}) {
  return (
    <figure className='w-[30px] h-[30px] flex items-center justify-center rounded-sm bg-gptLogo'>
      {children}
    </figure>
  )
}

export default Avatar
