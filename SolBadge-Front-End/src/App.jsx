import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import SolanaLogo from '/Solana.svg'
import './App.css'
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css';

function App() {

  const [data, setData] = useState([
    {title: 'NTF 1', subtitle: 'sample', description: 'more sample', date: '10/04/2024'},
    {title: 'NTF 2', subtitle: 'sample', description: 'more sample', date: '10/04/2024'},])

  useEffect(() => {
    fetch('http://localhost:3001/api')
    .then(response => response.json())
    .then(data => setData(data))
    .catch(error => console.error(error))
  }, [])

  return (
    <>
      <div>
        <a href="https://solana.com" target="_blank">
          <img src={SolanaLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>SolBadge is here!</h1>
      <div className="card">
        <input type="text" placeholder="Enter your wallet address" />
        <button>
          find NTFs
        </button>
      </div>
      <VerticalTimeline
        layout="1-column-left"
      >
        {data.map((item, index) => (
          <VerticalTimelineElement
            key={index}
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            date={item.date}
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            icon={<img src={reactLogo} alt="react logo" />}
          >
            <h3 className="vertical-timeline-element-title">{item.title}</h3>
            <h4 className="vertical-timeline-element-subtitle">{item.subtitle}</h4>
            <p>
              {item.description}
            </p>
          </VerticalTimelineElement>))}
      </VerticalTimeline>
    </>
  )
}

export default App
