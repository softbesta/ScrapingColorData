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
  const initValues = [
    {
      id: 1, url: 'https://placard.pt/', x: 400, y: 200,
      lastUpdatedAt: undefined, diffSec: 0,
      isOpen: false, fetchedColor: undefined
    },
    {
      id: 2, url: 'https://placard.pt/', x: 200, y: 200,
      lastUpdatedAt: undefined, diffSec: 0,
      isOpen: false, fetchedColor: undefined
    },
    {
      id: 3, url: 'https://betclic.pt/', x: 300, y: 300,
      lastUpdatedAt: undefined, diffSec: 0,
      isOpen: false, fetchedColor: undefined
    },
    {
      id: 4, url: '', x: undefined, y: undefined,
      lastUpdatedAt: undefined, diffSec: 0,
      isOpen: false, fetchedColor: undefined
    },
    {
      id: 5, url: '', x: undefined, y: undefined,
      lastUpdatedAt: undefined, diffSec: 0,
      isOpen: false, fetchedColor: undefined
    },
    {
      id: 6, url: '', x: undefined, y: undefined,
      lastUpdatedAt: undefined, diffSec: 0,
      isOpen: false, fetchedColor: undefined
    },
    {
      id: 7, url: '', x: undefined, y: undefined,
      lastUpdatedAt: undefined, diffSec: 0,
      isOpen: false, fetchedColor: undefined
    },
    {
      id: 8, url: '', x: undefined, y: undefined,
      lastUpdatedAt: undefined, diffSec: 0,
      isOpen: false, fetchedColor: undefined
    },
    {
      id: 9, url: '', x: undefined, y: undefined,
      lastUpdatedAt: undefined, diffSec: 0,
      isOpen: false, fetchedColor: undefined
    },
    {
      id: 10, url: '', x: undefined, y: undefined,
      lastUpdatedAt: undefined, diffSec: 0,
      isOpen: false, fetchedColor: undefined
    },
  ]
  const [values, setValues] = useState(initValues)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    console.log({ values })
  }, [values])

  const handleChange = (e, id) => {
    const field = e.target.name
    const value = e.target.value
    setValues((v) =>
      v.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value }
        } else {
          return item
        }
      })
    )
  }

  const handleTab = (id) => {
    setTab(id)
  }

  return (
    <div className="app">
      <h1>REBEL TRADE SOFTWARE</h1>
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
