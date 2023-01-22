import Head from 'next/head'
import Image from 'next/image'
import "@fontsource/work-sans"
import clouds from '../public/clouds.png'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [input, setInput] = useState('')
  const onChange = (event) => {
    setInput(event.target.value)
  }
  return(
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          <h1 className='header'>AI Avatar Generator</h1>
          <p className='paragraph'>Turn me into anyone you want! Make sure you refer to me as "<span>imliamcloud</span>" in the prompt</p>
        </div>
        <div className='promptContainer'>
          <input placeholder="Portrait of imliamcloud by Michelangelo..." className="prompt-box" value={input} onChange={onChange} />
          <div className="prompt-buttons">
    <a className="generate-button">
      <div className="generate">
        <p>Generate</p>
      </div>
    </a>
  </div>
        </div>
        <Image
      loader=""
      className='image'
      src={clouds}
      alt="Picture of the author"
      height={800}
        />
      </main>
    </>
    )
}
