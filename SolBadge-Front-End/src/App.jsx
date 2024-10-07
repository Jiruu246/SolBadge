import { useState, useEffect } from 'react'
import RightArrow from './assets/maki_arrow.svg'
import LoadingIcon from './assets/90-ring.svg'
import './App.css'
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css';
import axios from 'axios'
import NFTCard from './components/NFTCard'

function GroupNFTsByDate(nfts) {
  const grouped = nfts.reduce((acc, nft) => {
    const date = new Date(nft.timestamp * 1000)
    const year = date.getFullYear()
    const month = date.toLocaleString('default', { month: 'long' })

    const key = `${month} ${year}`

    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(nft)
    return acc
  }, {})

  // Sort each group by timestamp in descending order
  Object.keys(grouped).forEach(key => {
    grouped[key].sort((a, b) => b.timestamp - a.timestamp)
  })

  return grouped
}

function App() {

  const [loading, setLoading] = useState(false)
  const [focus, setFocus] = useState(false)
  const [address, setAddress] = useState('')
  const [nfts, setNFTs] = useState(null)
  // const [nfts, setNFTs] = useState(GroupNFTsByDate([
  //   {
  //     "name": "DePIN Revolution 2024 - day 2",
  //     "timestamp": 1724545405,
  //     "description": "DePIN Revolution 2024 - day 2 - I was there!",
  //     "address": "E8TukwBikJUguTQcQBTbAiRGpUMBPwGLhhCWppBHW9xQ",
  //     "image": "https://arweave.net/3tflnppn4YGmxyIKoqva2kiVwm7yv5MJbAQRDTZA0_g",
  //     "location": null
  //   },
  //   {
  //     "name": "Breakpoint Singapore 2024 - POAP",
  //     "timestamp": 1726914878,
  //     "description": "This POAP collection marks your last Chomp at a RWE (Real World Event) powered by Chomp. It looks like you chomped a deck at Breakpoint Singapore 2024! To celebrate your contribution to building better information for us all, Chompy has gifted you one free in-Chomp answer reveal in the form of this POAP. 👾 Go test it out now at app.chomp.games!",
  //     "address": "6KGyUsfQZozLkAVfKuyYuQQaPeqzs2z2SfU7UcF6szhd",
  //     "image": "https://gateway.irys.xyz/uAkw5mShxxzhLNAfVjjgDwdXvjsfSe0u8AKGzENqydA",
  //     "location": null
  //   },
  //   {
  //     "name": "DePIN Revolution 2024 - day 1",
  //     "timestamp": 1724466335,
  //     "description": "DePIN Revolution 2024 - day 1 - I was there!",
  //     "address": "5Ar9mr9vLEmvaSCY9ccPvE38bVSnnKuLURLTvu6Qx4zu",
  //     "image": "https://arweave.net/0HQrwgcWs-_NO3Mk4AiJjt_nEZg9OQaJ7Hbpcwt_ix8",
  //     "location": null
  //   },
  //   {
  //     "name": "DePIN Revolution 2024 - day 3",
  //     "timestamp": 1724628101,
  //     "description": "DePIN Revolution 2024 - day 3 - I was there!",
  //     "address": "2R743vkEkSBwKLwitQZHoLtutF1jr7haxLXgP937J7cM",
  //     "image": "https://arweave.net/4WIUFEGcY86VJyeBGKdIQ-wrmXB6HNjRohDfmyxowo0",
  //     "location": null
  //   }
  // ]))
  
  const [error, setError] = useState(null)

  const getNfts = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:3003/nfts', {params: {addr: address}})
      setNFTs(GroupNFTsByDate(response.data.data))
      console.log(response.data.data)
    } catch (error) {
      setError(error.message)
      console.error(error)
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      <p className='text-6xl font-bold p-6 mt-48'>SolBadge is here!</p>
      <p className='text-xl'>Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et.</p>
      <div className={`
        w-1/2 m-8 pl-8 pr-2 py-2 flex justify-between
        ${focus? 'border-[var(--primary)]' : 'border-[var(--secondary-light)]'}
        bg-transparent border-2 rounded-full
        hover:border-2 hover:border-[var(--primary)]
        transition-colors duration-300 ease-in-out`}>
        <input 
          type="text" 
          placeholder="Enter your wallet address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="bg-transparent focus:outline-none w-full"
          />
        <button onClick={getNfts} disabled={loading} 
          className={`
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--primary-darken)]'} 
            bg-[var(--primary)] p-1 rounded-full`}>
          <img src={loading ? LoadingIcon : RightArrow } alt="button image" className="w-8"/>
        </button>
      </div>
      {nfts !== null && <VerticalTimeline layout="1-column-left">
        {Object.keys(nfts).map((date, index) => (
          <VerticalTimelineElement key={index} icon={<p className="text-lg font-bold text-left">{date}</p>}>
            <div className="flex flex-wrap gap-8">
            {nfts[date].map((nft, index) => (
              <NFTCard key={index} nft={nft}/>
            ))}
            </div>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>}
    </>
  )
}

export default App
