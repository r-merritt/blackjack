## Demo video

[Youtube link to demo](https://youtu.be/Vl1akqQ5Cvc)

## App features

Uses [http://deckofcardsapi.com/](http://deckofcardsapi.com/) to draw and display cards

Follows most Blackjack rules:
* Starts with 6 decks
* Aces are worth either 1 or 11 depending on what is most helpful
* The house starts with one face up and one face down card
* The house will draw up to 17 if less than 17 when player stands
* The player can hit for additional cards or stand to end their turn
* The player loses if their card value goes over 21
* The player loses if they stand and the house has a higher value than them, or draws a higher value while drawing over 17
* The player loses if they tie with the house
* The player wins if the house is over 21
* The player wins if their score is higher than the house

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.
