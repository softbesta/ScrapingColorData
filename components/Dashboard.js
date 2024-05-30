import React, { useEffect, useRef, useState } from "react";

const Dashboard = ({
  values,
  setValues,
  isConnected,
  setIsConnected,
}) => {

  const isFetching = useRef(false)
  const [timerCount, setTimerCount] = useState(0)
  const timerRef = useRef(0)

  const intervalSec = 3

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  const startTImer = () => {
    stopTimer()
    console.log('===timer started===')
    timerRef.current = setInterval(() => {
      setTimerCount(v => v + 1)
    }, intervalSec * 1000)
  }
  const stopTimer = () => {
    if (timerRef.current > 0) {
      console.log('===timer ended===')
      clearInterval(timerRef.current)
      timerRef.current = 0
    }
  }

  useEffect(() => {
    return () => stopTimer()
  }, [])
  useEffect(() => {
    console.log({ timerCount })
    getColors()
  }, [timerCount])

  const onSave = async (id) => {
    const selectedItem = values.find((item) => item.id === id)
    console.log({ selectedItem })
  }

  const getColors = async () => {
    if (isFetching.current) return
    try {
      const items = []
      values.forEach(item => {
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

      isFetching.current = true
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
      isFetching.current = false

      const res = await response.json()
      const resData = res.data
      if (!resData || resData.length <= 0) return

      const update = values.map(item => {
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
      console.log({ update })
      setValues(update)
    } catch (err) {
    }
  }

  const openAllPages = async () => {
    try {
      const items = []
      values.forEach(item => {
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
      console.log('fffffffffff', { resData })

      const update = values.map(item => {
        const idx = resData.findIndex(color => color.id === item.id)
        if (idx < 0) return item
        return {
          ...item,
          isOpen: resData[idx].isOpen,
        }

      })
      console.log('vvvvvvvvv', { update })
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

      const update = values.map(item => {
        return {
          ...item,
          isOpen: false,
        }
      })
      console.log({ update })
      setValues(update)
    } catch (err) {
    }
  }

  const handleOn = async () => {

    if (!isConnected) {
      await openAllPages()
      delay(10000)
      startTImer()
    } else {
      stopTimer()
      await closeAllPages()
    }
    setIsConnected(v => !v)
    return
  }


  const onChange = (e, id) => {
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

  return (
    <div className="content">
      <table>
        <thead>
          <tr>
            <th>N°</th>
            <th>URL</th>
            <th>Status</th>
            <th>X</th>
            <th>Y</th>
            <th>COR HTML PADRÃO</th>
            <th>Time Update</th>
            {/* <th>ACTION</th> */}
          </tr>
        </thead>
        <tbody>
          {values && values.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.id}</td>
              <td>
                <input
                  type="text"
                  name="url"
                  value={entry.url}
                  onChange={(e) => onChange(e, entry.id)}
                  disabled={isConnected}
                />
              </td>
              <td
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* <input
                  type="text"
                  name="isOpen"
                  value={entry.isOpen}
                  onChange={(e) => onChange(e, entry.id)}
                /> */}
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '100%',
                    backgroundColor: entry.isOpen ? 'green' : 'red',
                  }}
                />
              </td>
              <td><input type="number" name="x" value={entry.x} onChange={(e) => onChange(e, entry.id)} /></td>
              <td><input type="number" name="y" value={entry.y} onChange={(e) => onChange(e, entry.id)} /></td>
              <td
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: `${entry.fetchedColor}`,
                  }}
                />
                {/* <input
                  type="text"
                  name="color"
                  value={entry.color}
                  onChange={(e) => onChange(e, entry.id)}
                /> */}
              </td>
              <td>
                {entry.diffSec}
              </td>
              {/* <td><button onClick={() => onSave(entry.id)}>SAVE</button></td> */}
            </tr>
          ))}
        </tbody>
      </table>
      <button className="on-button" onClick={handleOn}>{!isConnected ? 'Turn On' : 'Turn Off'}</button>
    </div>
  )
};

export default Dashboard;