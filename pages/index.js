import Head from 'next/head'
import Image from 'next/image'
import '@fontsource/work-sans'
import clouds from '../public/clouds.png'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const maxRetries = 20
  const [input, setInput] = useState('')
  const [img, setImg] = useState('')
  const [retry, setRetry] = useState(0)
  const [retryCount, setRetryCount] = useState(maxRetries)
  const [isGenerating, setIsGenerating] = useState(false)
  const [finalPrompt, setFinalPrompt] = useState('')
  const onChange = (event) => {
    setInput(event.target.value)
  }
  const generateAction = async () => {
    console.log('Generating...')
    // If this is a retry request, take away retryCount
    setIsGenerating(true);
    if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1;
        }
      });

      setRetry(0);
    }

    // Add the fetch request
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: JSON.stringify({ input }),
    })

    const data = await response.json()
    if (response.status === 503) {
      setRetry(data.estimated_time);
      return
    }

    // If another error, drop error
    if (!response.ok) {
      console.log(`Error: ${data.error}`)
      setIsGenerating(false);
      return
    }
    setFinalPrompt(input);
    // Remove content from input box
    setInput('');
    setImg(data.image);
    setIsGenerating(false);
    // Set image data into state property
    setImg(data.image);
    console.log(img)
    setIsGenerating(false);
  }

  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  useEffect(() => {
    console.log("hello")
  }, [img, generateAction, retryCount]);


  useEffect(() => {
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(`Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`);
        setRetryCount(maxRetries);
        return;
        }

      console.log(`Trying again in ${retry} seconds.`);

      await sleep(retry * 1000);

      await generateAction();
    };

    if (retry === 0) {
      return;
    }

    runRetry();
  }, [retry]);
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          <h1 className="header">AI Avatar Generator</h1>
          <p className="paragraph">
            Turn me into anyone you want! Make sure you refer to me as "
            <span>imliamcloud</span>" in the prompt
          </p>
        </div>
        <div className={`${img ? "flexCenter" : "flexPrompt"}`}>
        <div className={`promptContainer`}>
          <input
            placeholder="Portrait of imliamcloud by Michelangelo..."
            className="prompt-box"
            value={input}
            onChange={onChange}
          />

          <div className="prompt-buttons">
            <a onClick={generateAction} className="generate-button">
              <div className="generate">
                <p>Generate</p>
              </div>
            </a>
          </div>
        </div>
        <div>
        {img && (
      <div className="output-content">
        <Image src={img} width={512} height={512} alt={input} />
        <p className='finalPrompt'>{finalPrompt}</p>
      </div>
    )}
    </div>
    </div>
        <Image
          loader=""
          className="image"
          src={clouds}
          alt="Picture of the author"
          height={150}
        />
      </main>
    </>
  )
}
