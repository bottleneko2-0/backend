const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

// 亂數選取陣列中的指定數量元素
const getRandomElements = (array, count) => {
	const result = []
	const usedIndices = new Set()
	while (result.length < count && usedIndices.size < array.length) {
		const randomIndex = Math.floor(Math.random() * array.length)
		if (!usedIndices.has(randomIndex)) {
			result.push(array[randomIndex])
			usedIndices.add(randomIndex)
		}
	}
	return result
}

router.get('/cards/random', (_req, res) => {
	const apiIdDir = path.join(__dirname, '../API_ID')
	const covers = []
	const maxFiles = 5 // 限制最多隨機選取 5 個檔案
	const maxCovers = 50 // 限制回傳最多 50 個封面

	try {
		// 列出 API_ID 中的檔案並隨機選取最多 5 個
		const allFiles = fs
			.readdirSync(apiIdDir)
			.filter((file) => file !== 'series.json')
		const selectedFiles = getRandomElements(allFiles, maxFiles)

		// 選取的檔案並收集 cover 連結
		for (const file of selectedFiles) {
			if (covers.length >= maxCovers) break
			const filePath = path.join(apiIdDir, file)
			try {
				const data = fs.readFileSync(filePath, 'utf8')
				const jsonData = JSON.parse(data)
				if (Array.isArray(jsonData)) {
					const fileCovers = jsonData
						.map((item) => item.cover)
						.filter((cover) => cover)
					covers.push(...fileCovers)
				} else {
					if (jsonData.cover) {
						covers.push(jsonData.cover)
					}
				}
			} catch (err) {
				console.error(`讀取或解析檔案 ${file} 失敗：`, err)
				continue
			}
		}

		// 確保最多回傳 50 個連結
		const limitedCovers = covers.slice(0, maxCovers)
		res.status(200).json({ covers: limitedCovers })
	} catch (err) {
		console.error('讀取檔案時發生錯誤：', err)
		res.status(500).json({ error: '伺服器錯誤，無法讀取檔案' })
	}
})

module.exports = router
