const axios = require('axios')
const fs = require('fs');

const setName = "Shadows over Innistrad"

const getSet = async () => {
    await axios.get(`http://api.magicthegathering.io/v1/sets?name=${setName}`).then(res => {
        console.log(res.data)

    }, err => {
        console.log(err)
    })
}

const init = async (args) => {

    const cardNumbers = fs.readFileSync(args[0])

    const cardsLength = cardNumbers.toString().split(',').length

    const numberOfPages = Math.ceil((cardsLength / 100) + 0.5);

    let cardsArray = []

    for (let i = 1; i <= numberOfPages; i++) {
        await axios.get(
            `http://api.magicthegathering.io/v1/cards?number=${cardNumbers.toString()}&set=${args[1]}&page=${i}`
        ).then(res => {
            cardsArray = [...cardsArray, ...res.data.cards]
        }, err => {
            console.log(err)
        })
    }

    const mappedCards = cardsArray.map(card => `${card.name} (${setName})`)

    var file = fs.createWriteStream(`./export/${setName.replace(/\s/g, '_')}.txt`);

    file.on('error', (err) => console.log(err));

    mappedCards.forEach((el) => file.write(el + '\n'));

    file.end();

}

// getSet()
const args = process.argv.splice(2) 
init(args)

