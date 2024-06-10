import React, { useEffect, useRef, useState } from "react";
import { CustomTable } from "./DataTable";

const Dashboard = ({
  values,
  setValues,
  isConnected,
  setIsConnected,
}) => {

  const [isLoading, setIsLoading] = useState(false)
  const isFetching = useRef(false)
  const [timerCount, setTimerCount] = useState(0)
  const timerRef = useRef(0)

  const valuesRef = useRef(values)
  useEffect(() => {
    valuesRef.current = values
    const urlValues = JSON.stringify(values)
    localStorage.setItem('urlValues', urlValues)
  }, [values])

  const intervalSec = 1

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  const startTImer = () => {
    stopTimer()
    console.log('===timer started===')
    timerRef.current = setInterval(() => {
      setTimerCount(v => v + intervalSec)
    }, intervalSec * 1000)
  }
  const stopTimer = () => {
    if (timerRef.current > 0) {
      console.log('===timer ended===')
      clearInterval(timerRef.current)
      timerRef.current = 0
      setTimerCount(0)
    }
  }

  useEffect(() => {
    return () => stopTimer()
  }, [])
  useEffect(() => {
    if (timerCount > 0) {
      console.log({ timerCount })
      if (isFetching.current) return
      getColors()
    }
  }, [timerCount])

  const getColors = async () => {
    isFetching.current = true
    console.log('===getColors===')
    try {
      const items = []
      valuesRef.current.forEach(item => {
        if (!item || !item.url || !item.x || !item.y) return
        items.push({
          id: item.id,
          url: item.url,
          position: {
            x: +item.x,
            y: +item.y,
          }
        })
      })
      const data = {
        status: 'get',
        items
      }

      const response = await fetch(`/api/scraping/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        isFetching.current = false
        throw new Error(response.statusText)
      }

      const res = await response.json()
      const resData = res.data
      if (!resData || resData.length <= 0) return

      const update = valuesRef.current.map(item => {
        const idx = resData.findIndex(color => color.id === item.id)
        if (idx < 0) return {
          ...item,
          isOpen: false,
        }
        const color = `rgb(${resData[idx].color.r}, ${resData[idx].color.g}, ${resData[idx].color.b})`
        if (color === item.fetchedColor) return item

        const lastUpdatedAt = (new Date()).valueOf()
        let diffSec = 0
        if (item.lastUpdatedAt > 0) {
          diffSec = (lastUpdatedAt - item.lastUpdatedAt) / 1000
        }
        return {
          ...item,
          fetchedColor: color,
          lastUpdatedAt,
          diffSec,
          isOpen: true,
        }

      })
      // console.log({ update })
      setValues(update)

      isFetching.current = false
    } catch (err) {
      isFetching.current = false
    }
  }

  const openAllPages = async () => {
    try {
      const items = []
      valuesRef.current.forEach(item => {
        if (!item || !item.url || !item.x || !item.y) return
        items.push({
          id: item.id,
          url: item.url,
          position: {
            x: +item.x,
            y: +item.y,
          }
        })
      })
      const data = {
        status: 'open',
        items
      }
      const response = await fetch(`/api/scraping/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const res = await response.json()
      const resData = res.data
      if (!resData || resData.length <= 0) return
      // console.log('fffffffffff', { resData })

      const update = valuesRef.current.map(item => {
        const idx = resData.findIndex(color => color.id === item.id)
        if (idx < 0) return item
        return {
          ...item,
          isOpen: resData[idx].isOpen,
        }

      })
      // console.log('vvvvvvvvv', { update })
      setValues(update)

    } catch (err) {
    }

  }

  const closeAllPages = async () => {
    try {
      const data = {
        status: 'close',
      }
      const response = await fetch(`/api/scraping/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const res = await response.json()
      const resData = res.data
      if (!resData || resData.length <= 0) return

      const update = valuesRef.current.map(item => {
        return {
          ...item,
          isOpen: false,
        }
      })
      // console.log({ update })
      setValues(update)
    } catch (err) {
    }
  }

  const handleOnAll = async () => {

    if (!isConnected) {
      setIsLoading(true)
      await openAllPages()
      await delay(2000)
      startTImer()
      setIsLoading(false)
    } else {
      setIsLoading(true)
      stopTimer()
      await delay(5000)
      await closeAllPages()
      // closeAllPages()
      setIsLoading(false)
    }
    setIsConnected(v => !v)

    return
  }


  const onTblChange = (e, siteId) => {
    const field = e.target.name
    const value = e.target.value
    setValues((v) =>
      v.map((item) => {
        if (item.siteId === siteId) {
          return { ...item, [field]: value }
        } else {
          return item
        }
      })
    )
  }
  const onToogleItem = (siteId) => {
    const value = values.find(v => v.siteId === siteId)
    if (!value) return
    console.log({value})
    const update = values.map(v => {
      if (v.siteId === siteId) {
        return {...v, isOpen: !v.isOpen}
      }
      return v
    })
    setValues(update)
  }
  const onRemoveItem = (siteId) => {
    const idx = values.findIndex(v => v.siteId === siteId)
    if (idx < 0) return
    const update = [...values]
    update.splice(idx, 1)
    console.log({idx, update})
    setValues(update)
  }

  return (
    <div className="dashboard">
      <div className="container">
        <CustomTable
          rows={values}
          onChange={(_event, siteId) => onTblChange(_event, siteId)}
          onToggleItem={(siteId) => onToogleItem(siteId)}
          onRemoveItem={(siteId) => onRemoveItem(siteId)}
        />
        {/* <div className={'titles'}>
          <button onClick={() => {
            console.log({values})
          }}>Test</button>
        </div> */}
      </div>
      <button
        className={`on-button ${isConnected ? 'btnOff' : ''} ${isLoading ? 'btnDisabled' : ''}`}
        onClick={handleOnAll}
        disabled={isLoading}
      >
        {isLoading ?
          'Loading'
          :
          !isConnected ? 'Turn On (All)' : 'Turn Off (All)'
        }
      </button>
    </div>
  )
};

export default Dashboard;