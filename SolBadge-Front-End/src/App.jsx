import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import SolanaLogo from '/Solana.svg'
import './App.css'
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css';
import axios from 'axios'

function App() {

  const [address, setAddress] = useState('')
  const [nfts, setNFTs] = useState([])
  const [error, setError] = useState(null)

  const getNfts = async () => {
    try {
      const response = await axios.get('http://localhost:3003/nfts', {params: {addr: address}})
      console.log(response.data)
      // setNFTs(response.data)
    } catch (error) {
      setError(error)
    }
  };

  return (
    <>
      <div>
        <a href="https://solana.com" target="_blank">
          <img src={SolanaLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>SolBadge is here!</h1>
      <div className="card">
        <input 
          type="text" 
          placeholder="Enter your wallet address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          />
        <button onClick={getNfts}>find NTFs</button>
      </div>
      <VerticalTimeline
        layout="1-column-left"
      >
        {(error !== null)? 
          <p> Error: {error}</p> : 
          nfts.map((nft, index) => (
            <VerticalTimelineElement
              key={index}
              className="vertical-timeline-element--work"
              contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
              contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
              date={nft.timestamp}
              iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
              icon={<img src={nft.image} alt="react logo" />}
            >
              <h3 className="vertical-timeline-element-title">{nft.name}</h3>
              <h4 className="vertical-timeline-element-subtitle">{nft.address}</h4>
              <p>{nft.description}</p>
            </VerticalTimelineElement>))}
        </VerticalTimeline>
    </>
  )
}

export default App
