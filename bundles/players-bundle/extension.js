'use strict';
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());
const fs = require('fs');



//add player image to uploads
app.post('/uploads', (req, res, next) => {
	let playersData = JSON.parse(fs.readFileSync(`${__dirname}/graphics/assets/playersData.json`))
	const newPlayerData = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		status: req.body.status,
		number: req.body.number,
		age: req.body.age,
		height: req.body.height,
		weight: req.body.weight,
		imgPlayer: req.files ? `assets/images/${req.files.playerImage.name}` : ''
	}

	playersData.push(newPlayerData)

	fs.writeFileSync(`${__dirname}/graphics/assets/playersData.json`, JSON.stringify(playersData, null, 2), function (err) {
		if (err) throw err;
	});

	if (req.files && req.files.playerImage) {
		let playerImage = req.files.playerImage

		playerImage.mv(`${__dirname}/graphics/assets/images/${req.files.playerImage.name}`, function (err) {
			if (err) {
				console.log(err)
			} else {
				res.send('File uploaded!');
			}
		});
	}
})

module.exports = function (nodecg) {
	nodecg.listenFor('removePlayer', index => {
		const filteredPlayers = []
		playersDataRep.value.filter((player, playerIndex) => {
			if (playerIndex !== index) {
				filteredPlayers.push(player)
			}
		})
		playersDataRep.value = filteredPlayers

		fs.writeFile(`${__dirname}\\playersData.json`, JSON.stringify(filteredPlayers), function (err) {
			if (err) throw err;
		});

	})
	nodecg.mount(app);
};