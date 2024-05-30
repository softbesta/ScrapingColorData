

import puppeteer from "puppeteer"
import getPixels from "get-pixels"
import fs from 'fs'
import path from 'path'


function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

const getColorAtPosition = async (id, url, px, py) => {
  const screenshotPath = path.join(process.cwd(), `screenshot${id}.png`)

  console.log({ px, py })
  const browser = await puppeteer.launch({
    headless: false,
    // headless: true,
    defaultViewport: null,
    dumpio: true,
    defaultViewport: {
      width: 1280,
      height: 720,
    },
  })

  const page = await browser.newPage()

  console.log('0000000000111111')
  console.log(`Scraping URL: ${url}`)
  await page.goto(url, {
    waitUntil: "networkidle2",
  })
  console.log('0000000002222222', { screenshotPath })

  // await page.waitForTimeout(5000)
  // await page.waitForSelector('body', { timeout: 15000 })
  await delay(5000)

  console.log('11111111111111111', { screenshotPath })
  await page.screenshot({ path: screenshotPath });
  console.log('22222222222222222')

  await browser.close();

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
        console.log('zzzzzzzzzzzzz', { err })
        reject({ error: true, mesage: err.mesage })
      }
    })
  })

  return respColor
}

export default async function handler(req, res) {
  const { body: items } = req


  // for (const item of items) {
  const resColors = await Promise.all(items.map(async (item) => {
    try {
      const position = item.position
      const url = item.url
      const id = item.id
      if (!position) {
        res.status(400).json({ error: true, errorMessage: 'Position is required.' })
        return
      }
      if (!url) {
        res.status(400).json({ error: true, errorMessage: 'Url is required.' })
        return
      }

      const respColor = await getColorAtPosition(id, url, position.x, position.y)
      console.log('rrrrrr', { id, respColor })

      if (respColor.error) return

      return { id, color: respColor.color }
      // resColors.push(respColor.color)

    } catch (error) {
      res.status(500).json(error)
    }
  }))
  console.log({ resColors })

  res.status(200).json({ data: resColors })
  // res.status(200).json({ data: 'perfect!' })
}
