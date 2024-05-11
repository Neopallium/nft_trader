import Link from 'next/link'
import { FC } from 'react'

export const HomePageTitle: FC = () => {
  const title = 'Nft Trader'
  const githubHref = 'https://github.com/Neopallium/nft_trader_frontend'

  return (
    <>
      <div className="flex flex-col items-center text-center font-mono">
        {/* Logo & Title */}
        <Link
          href={githubHref}
          target="_blank"
          // className="group"
          className="group flex cursor-pointer items-center gap-4 rounded-3xl px-3.5 py-1.5 transition-all hover:bg-gray-900"
        >
          <h1 className="text-[1.5rem] font-black tracking-tighter">{title}</h1>
        </Link>
      </div>
    </>
  )
}
