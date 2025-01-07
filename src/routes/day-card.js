const express = require('express')
const router = express.Router()

router.get('/day-card', async (req, res) => {
	try {
		await fetch(`https://bottleneko.app/api/daily`, {
			method: 'GET',
		})
			.then((res) => {
				return res.json()
			})
			.then((data) => {
				res.status(200).send(data)
			})
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		})
	}
})

module.exports = router
