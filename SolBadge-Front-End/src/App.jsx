import { useState, useEffect } from 'react'
import RightArrow from './assets/maki_arrow.svg'
import LocationIcon from './assets/location.svg'
import './App.css'
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css';
import axios from 'axios'

function App() {
  const SampleNFT = 'https://cdn.prod.website-files.com/6615636a03a6003b067c36dd/661ffd0dbe9673d914edca2d_6423fc9ca8b5e94da1681a70_Screenshot%25202023-03-29%2520at%252010.53.43.jpeg'

  const [focus, setFocus] = useState(false)
  const [address, setAddress] = useState('')
  const [nfts, setNFTs] = useState([
    {name: 'NFT 1', address: '0x1234567890', description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et.', image: SampleNFT, timestamp: '2022-10-10'},
    {name: 'NFT 1', address: '0x1234567890', description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et.', image: SampleNFT, timestamp: '2022-10-10'},
    {name: 'NFT 1', address: '0x1234567890', description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et.', image: SampleNFT, timestamp: '2022-10-10'},
    {name: 'NFT 1', address: '0x1234567890', description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et.', image: SampleNFT, timestamp: '2022-10-10'},
    {name: 'NFT 1', address: '0x1234567890', description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et.', image: SampleNFT, timestamp: '2022-10-10'}
  ])
  const [error, setError] = useState(null)

  const getNfts = async () => {
    try {
      const response = await axios.get('http://localhost:3003/nfts', {params: {addr: address}})
      console.log(response.data.data)
      setNFTs(response.data.data)
    } catch (error) {
      setError(error.message)
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
        <button onClick={getNfts}>
          <img src={RightArrow} alt="Search" className="bg-[var(--primary)] p-1 rounded-full"/>
        </button>
      </div>
      <VerticalTimeline layout="1-column-left">
        {nfts.map((nft, index) => (
          <VerticalTimelineElement
            key={index}
            date={nft.timestamp}
            // icon={<div className="w-2 h-2 rounded-full bg-white"/>}
          >
            <div 
              className="
                bg-cover bg-center w-72 h-96 rounded-3xl p-2 
                border-2 flex flex-col justify-between
                hover:border-[var(--primary)] hover:cursor-pointer"
              style={{ backgroundImage: `url(${nft.image})`}}>
              <div className="w-full flex justify-end">
                <button className="
                  p-2 w-12 h-12 flex items-center justify-center rounded-2xl 
                  bg-[var(--text)] backdrop-blur-sm hover:bg-[var(--primary)]">
                  <img src={LocationIcon} alt="Location" className="w-6"/>
                </button>
              </div>
              <div className="
                  p-2 items-center justify-center rounded-2xl 
                  bg-white/30 backdrop-blur-sm">
                <h3 className="text-white text-xl font-bold">{nft.name}</h3>
                <h4 className="text-white text-sm">{nft.description}</h4>
              </div>
            </div>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </>
  )
}

export default App
