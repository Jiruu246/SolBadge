import { useState } from 'react'
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

  const [error, setError] = useState(false)

  const getNfts = async () => {
    setLoading(true)
    setError(false)
    try {
      const response = await axios.get(import.meta.env.VITE_API_END_POINT, {params: {addr: address}})
      setNFTs(GroupNFTsByDate(response.data.data))
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      <div className='px-4'>
        <p className='text-4xl font-bold p-6 mt-24 text-center'>POP NFT is here!</p>
        <p className='text-lg text-center'>Welcome to the POP Explorer! Enter your SOL address below to view all your POAP NFTs in a timeline 👇</p>
        <div className={`
          w-full my-8 pl-8 pr-2 py-2 flex justify-between
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
      </div>
      {error ? (
        <div>
          <p className="text-red-500 text-lg font-bold">{error}</p>
        </div>
      ) : (nfts !== null &&
        <container>
          <VerticalTimeline layout="1-column-left" className='hidden sm:block'>
            {Object.keys(nfts).map((date, index) => (
              <VerticalTimelineElement key={index} icon={<p className="text-lg font-bold text-left">{date}</p>}>
                <div className="flex flex-wrap gap-8">
                {nfts[date].map((nft, index) => (
                  <NFTCard key={index} nft={nft}/>
                ))}
                </div>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
          <div className='p-4 block sm:hidden'>
            {Object.keys(nfts).map((date, index) => (
              <div key={index} className='py-2'>
                <div class="flex items-center">
                    <div class="flex-grow border-t border-gray-300"></div>
                    <span class="font-light mx-4">{date}</span>
                    <div class="flex-grow border-t border-gray-300"></div>
                </div>
                <div className="flex flex-col gap-4 py-8
                ">
                {nfts[date].map((nft, index) => (
                  <NFTCard key={index} nft={nft}/>
                ))}
                </div>
              </div>
            ))}
          </div>
        </container>
      )}
    </>
  )
}

export default App
