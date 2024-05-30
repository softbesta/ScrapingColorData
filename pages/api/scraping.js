
import cron from 'node-cron'

import puppeteer from "puppeteer"
import getPixels from "get-pixels"
import path from 'path'


function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

let pages = []
let browser

const connectBrowser = async () => {
  browser = await puppeteer.launch({
    headless: false,
    // headless: true,
    defaultViewport: null,
    dumpio: true,
    defaultViewport: {
      width: 1280,
      height: 720,
    },
  })
  console.log('successfully opened')
}

const openPages = async (id, url) => {
  console.log('00000', { id, url })
  pages[id] = await browser.newPage()

  await pages[id].goto(url, {
    waitUntil: "networkidle2",
  })
  await delay(5000)
  return true
}
const closePages = async () => {
  if (!pages || pages.length <= 0) return
  // const len = pages.length
  await Promise.all(pages.map(async (page) => {
    if (!page || page.isClosed()) return
    await page.close()
  }))
  pages = []
  return false
}

const getColorAtPosition = async (id, url, px, py) => {
  const screenshotPath = path.join(process.cwd(), `screenshot${id}.png`)

  console.log({ px, py })
  const page = pages[id]
  if (!page) return

  // await page.goto(url, {
  //   waitUntil: "networkidle2",
  // })

  // await delay(5000)
  await page.screenshot({ path: screenshotPath });

  const respColor = await new Promise((resolve, reject) => {
    getPixels(screenshotPath, (err, pixcels) => {
      try {
        // Delete a screenshot file.
        // fs.unlinkSync(screenshotPath)
        if (err) {
          throw Error
        }
        const r = pixcels.get(px, py, 0)
        const g = pixcels.get(px, py, 1)
        const b = pixcels.get(px, py, 2)
        console.log({ r, g, b })
        resolve({ error: false, color: { r, g, b } })
      } catch (err) {
        reject({ error: true, mesage: err.mesage })
      }
    })
  })

  return respColor
}


export default async function handler(req, res) {
  const { body: data } = req

  const { items, status } = data

  console.log('=--------------  api called -------------------')

  // if (status === 'connect') {
  //   console.log('=== connect ===')
  //   await connectBrowser()
  //   res.status(200).json({ data: 'connected' })
  //   return
  // }
  if (status === 'open') {
    await connectBrowser()
    console.log('=== open ===', { status, items })
    const response = await Promise.all(items.map(async (item) => {
      try {
        const url = item.url
        const id = item.id
        // if (!position) {
        //   response.status(400).json({ error: true, errorMessage: 'Position is required.' })
        //   return
        // }
        if (!url) {
          // response.status(400).json({ error: true, errorMessage: 'Url is required.' })
          return
        }

        const isOpen = await openPages(id, url)

        return { id, isOpen: true }
      } catch (error) {
        // res.status(500).json(error)
        return
      }
    }))

    res.status(200).json({ data: response })
    return
  }
  else if (status === 'close') {
    console.log('=== close ===', { status, items })
    const response = (items ?? []).map(async (item) => {
      return { id: item.id, isOpen: false }
    })
    await closePages()
    await browser.close()

    res.status(200).json({ data: response })
    return
  }
  else if (status === 'get') {
    console.log('=== get ===', { status, items, browser })
    const response = await Promise.all(items.map(async (item) => {
      try {
        const position = item.position
        const url = item.url
        const id = item.id
        if (!position) {
          // res.status(400).json({ error: true, errorMessage: 'Position is required.' })
          return
        }
        if (!url) {
          // res.status(400).json({ error: true, errorMessage: 'Url is required.' })
          return
        }

        const respColor = await getColorAtPosition(id, url, position.x, position.y)
        console.log('rrrrrr', { id, respColor })

        if (respColor.error) return

        return { id, color: respColor.color }
        // resColors.push(respColor.color)

      } catch (error) {
        // res.status(500).json(error)
        return {}
      }
    }))
    res.status(200).json({ data: response })
    return
  }

  // res.status(200).json({ data: 'perfect!' })
}
