'use strict';
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());
app.post(`/uploads`, (req, res, next) => {
	let playerImage = req.files.playerImage
	playerImage.mv(`${__dirname}/uploads/`, function (err) {
		if (err) {
			console.log('error');

			console.log(err)
		} else {
			console.log('uploaded')
			res.send('File uploaded!');
		}
	});
	res.status(200).json({
		message: req.body
	})
})
module.exports = function (nodecg) {

	const fs = require('fs');
	let playersData = JSON.parse(fs.readFileSync(`${__dirname}\\playersData.json`))
	const playersDataRep = nodecg.Replicant('playersData')
	playersDataRep.value = playersData

	nodecg.listenFor('addPlayer', newPlayer => {

		// playersData.push(newPlayer)
		// fs.writeFileSync(`${__dirname}\\playersData.json`, JSON.stringify(playersData, null, 2), function (err) {
		// 	if (err) throw err;
		// });
	})

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