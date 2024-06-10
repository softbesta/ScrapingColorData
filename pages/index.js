import Head from "next/head"
import Image from "next/image"
import { Inter } from "next/font/google"
import styles from "@/styles/Home.module.css"
import Dashboard from "@/components/Dashboard"
import Relations from "@/components/Relations"
import { useState, useEffect, useRef } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const prevTime = useRef((new Date()).valueOf())
  const initValue = {
    siteId: 10, url: '', x: '', y: '', width: 100, height: 100,
    lastUpdatedAt: '', diffSec: 0,
    isOpen: false, isLoading: false, fetchedColor: ''
  }
  const initValues = [
    {
      siteId: 1, url: 'https://betclic.pt/', x: 300, y: 300, width: 100, height: 100,
      lastUpdatedAt: '', diffSec: 0,
      isOpen: false, isLoading: false, fetchedColor: ''
    },
    {
      siteId: 2, url: 'https://placard.pt/', x: 400, y: 200, width: 100, height: 100,
      lastUpdatedAt: '', diffSec: 0,
      isOpen: false, isLoading: false, fetchedColor: ''
    },
    {
      siteId: 3, url: 'https://placard.pt/', x: 200, y: 200, width: 100, height: 100,
      lastUpdatedAt: '', diffSec: 0,
      isOpen: false, isLoading: false, fetchedColor: ''
    },
  ]
  const [values, setValues] = useState(initValues)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    const urlValues = localStorage.getItem('urlValues')
    console.log({ urlValues })
    const update = JSON.parse(urlValues)
    if (update.length > 0) {
      setValues(update)
    }
  }, [])

  const onAddValue = () => {
    const update = initValue
    const siteId = Math.max(...values.map(v => v.siteId)) + 1
    update.siteId = siteId
    setValues(v => ([...v, update]))
  }

  return (
    <div className="app">
      <div className="appTitle">
        <h1>REBEL TRADE SOFTWARE</h1>
        <button
          className="btnAdd"
          onClick={() => onAddValue()}
        >
          Add Item
        </button>
      </div>
      {/* <div className="tabs">
        <button className="tab" onClick={() => handleTab(0)}>DASHBOARD</button>
        <button className="tab" onClick={() => handleTab(1)}>RELATÓRIOS</button>
      </div> */}
      {tab === 0 && <Dashboard
        values={values}
        setValues={setValues}
        isConnected={isConnected}
        setIsConnected={setIsConnected}
      />}
      {/* {tab === 1 && <Relations values={values} onChange={handleChange} />} */}
    </div>
  )
}
