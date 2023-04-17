import { Inter } from 'next/font/google'
import AudioPlayer from '@/components/AudioPlayer'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-20 py-20 px-4 md:px-24 md:py-24">
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-2xl text-sky-600 font-mono">next.js custom audio player</h1>
        <h2 className="text-center text-sky-500 font-mono flex gap-2 mx-auto">
          <div>Song By:</div>
          <Link className="underline text-blue-600" href="https://jaysudo.com" target="_blank">DJ Jay Sudo</Link>
        </h2>
      </div>
      <AudioPlayer
        title="Take Me - DJ Jay Sudo"
        src="https://cdn.designly.biz/jaysudo/music/take-me/song.mp3"
      />
    </main>
  )
}
