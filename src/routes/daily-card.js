const express = require("express");
const router = express.Router();


router.get('/daily-card', async(req, res) => {
    try {
        await fetch(`https://bottleneko.app/api/dailys`,{
            method: "GET",
        })
        .then(res => {
           return res.json()
        })
        .then(data => {
            res.status(200).send(data)
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
})



module.exports = router;