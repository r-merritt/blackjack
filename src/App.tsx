import { useState, useEffect } from 'react';
import { Button } from 'react-native';
import { newDeck, shuffleDeck, drawCards } from './util/deckFunctions';
import { Card, ImageAndDesc } from './util/types';
import Player from './components/Player';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('begin');
  const [deckId, setDeckId] = useState('');
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerValue, setDealerValue] = useState(0);
  const [playerValue, setPlayerValue] = useState(0);
  const [showPlayerValues, setShowPlayerValues] = useState(false);
  const [dealerImgs, setDealerImgs] = useState<ImageAndDesc[]>([]);
  const [playerImgs, setPlayerImgs] = useState<ImageAndDesc[]>([]);
  const [showDealerCards, setShowDealerCards] = useState(false);

  // Update card images when new cards are drawn
  useEffect(() => {
    if (dealerCards.length === 0 || playerCards.length === 0) {
      return;
    }
    if (dealerImgs.length === 0) {
      setDealerImgs([
        {
          image: dealerCards[0].image,
          desc: cardDescription(dealerCards[0])
        },
        {
          image: dealerCards[1].image,
          desc: cardDescription(dealerCards[1])
        }]);
    } else if (dealerImgs.length === dealerCards.length - 1) {
      setDealerImgs([...dealerImgs,
        {image: dealerCards[dealerCards.length-1].image,
          desc: cardDescription(dealerCards[dealerCards.length-1])}]);
    }

    if (playerImgs.length === 0) {
      setPlayerImgs([
        {
          image: playerCards[0].image,
          desc: cardDescription(playerCards[0])
        },
        {
          image: playerCards[1].image,
          desc: cardDescription(playerCards[1])
        }
      ]);
    } else if (playerImgs.length === playerCards.length - 1) {
      setPlayerImgs([...playerImgs,
        {image: playerCards[playerCards.length-1].image,
          desc: cardDescription(playerCards[playerCards.length-1])}]);
    }
  }, [dealerCards, playerCards, dealerImgs, playerImgs]);

  function cardDescription(card: Card) {
    return `${card.value.toLowerCase()} of ${card.suit.toLowerCase()}`;
  }

  // Update dealer card value
  useEffect(() => {
    // console.log(dealerCards);
    var value = 0;
    var aces = 0;
    for (var card of dealerCards) {
      value += cardVal(card.value);
      if (card.value === "ACE") {
        aces++;
      }
    }
    while (value > 21 && aces > 0) {
      value -= 10;
      aces --;
    }
    if (value > 21) {
      setShowDealerCards(true);
      setGameState("win");
    }
    setDealerValue(value);
  }, [dealerCards]);

  useEffect(() => {
    if (gameState == "dealer") {
      if (dealerValue < 17) {
        dealerDraw();
      } else {
        if (dealerValue > 21) {
          setGameState("win");
        } else {
          checkWin();
        }
      }
    }
  }, [gameState, dealerValue]);

  // Update player card value
  useEffect(() => {
    var value = 0;
    var aces = 0;
    for (var card of playerCards) {
      value += cardVal(card.value);
      if (card.value === "ACE") {
        aces++;
      }
    }
    while (value > 21 && aces > 0) {
      value -= 10;
      aces --;
    }
    if (value > 21) {
      setGameState("bust");
    }
    setPlayerValue(value);
  }, [playerCards]);

  function cardVal(value: string) {
    // console.log(value);
    if (parseInt(value)) {
      return parseInt(value);
    } else if (value === "ACE") {
      return 11;
    } else {
      return 10;
    }
  }

  async function newDeckOrShuffle() {
    if (deckId === '') {
      try {
        const deck = await newDeck();
        const id = deck["deck_id"];
        setDeckId(id);
        return id;
      } catch (error) {
        console.log('error getting new deck: ', error);
      }
    } else {
      var shuffle;
      try {
        shuffle = await shuffleDeck(deckId);
        if (!shuffle.success) {
          console.log(shuffle);
          console.log('shuffling deck unsuccessful');
        }
      } catch (error) {
        console.log('error shuffling deck: ', error);
      }
      return deckId;
    }
  }

  async function onStart() {
    const id = await newDeckOrShuffle();
    const cardsResult = await drawCards(id, "4");
    setDealerCards([cardsResult.cards[0], cardsResult.cards[1]]);
    setPlayerCards([cardsResult.cards[2], cardsResult.cards[3]]);

    setGameState("playing");
  }

  async function onHit() {
    const cardsResult = await drawCards(deckId, "1");
    setPlayerCards([...playerCards, cardsResult.cards[0]]);
  }

  async function dealerDraw() {
    const cardsResult = await drawCards(deckId, "1");
    setDealerCards([...dealerCards, cardsResult.cards[0]]);
  }

  async function onStand() {
    setGameState("dealer");
  }

  async function checkWin() {
    setShowDealerCards(true);
    if (playerValue > 21) {
      setGameState("bust");
    } else if (playerValue > dealerValue) {
      setGameState("win");
    } else {
      setGameState("lose");
    }
  }

  async function restart() {
    setDealerCards([]);
    setPlayerCards([]);
    setDealerImgs([]);
    setPlayerImgs([]);

    onStart();
  }

  return (
    <div className="App">
      <p className="Title">Blackjack</p>
      {gameState==="begin" && (
        <div className="Buttons">
          <Button color="darkgreen" title="Start" onPress={onStart}/>
        </div>
      )}
      {gameState==="lose" && (
        <div>
          <p className="Result">You lose :(</p>
          <div className="Buttons">
            <Button color="darkgreen" title="Play Again" onPress={restart}/>
          </div>
        </div>
      )}
      {gameState==="win" && (
        <div>
          <p className="Result">You won!</p>
          <div className="Buttons">
            <Button color="darkgreen" title="Play Again" onPress={restart}/>
          </div>
        </div>
      )}
      {gameState==="bust" && (
        <div>
          <p className="Result">You went over 21 :(</p>
            <div className="Buttons">
              <Button color="darkgreen" title="Play Again" onPress={restart}/>
            </div>
        </div>
      )}

      {gameState==="playing" && (
        <div className="Buttons">
          <Button color="darkgreen" title="Restart" onPress={restart}/>
        </div>
      )}

      {gameState!=="begin" && (
        <div>
          <Player cards={dealerImgs} showCards={showDealerCards} name="Dealer" />
          <Player cards={playerImgs} showCards={true} name="Player" />
          {gameState==="playing" && (
            <div className="Buttons">
              <div className="Button">
                <Button color="darkgreen" title="Hit" onPress={onHit} />
              </div>
              <div className="Button">
                <Button color="darkgreen" title="Stand" onPress={onStand}/>
              </div>
              <div className="Button">
                <Button color="darkgreen" title="Show Player Values" onPress={() => setShowPlayerValues(!showPlayerValues)} />
              </div>
            </div>
          )}
          {showPlayerValues && (
            <div>
              <p>Dealer Value: {dealerValue}</p>
              <p>Player Value: {playerValue}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
