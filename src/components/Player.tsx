import React from 'react';
import { ImageAndDesc } from '../util/types';

function Player({cards, name, showCards} : {cards: ImageAndDesc[], name: string, showCards: boolean}) {

  return (
    <div className="Player">
      <p>{name}</p>

    {!showCards && (
      <div>
        <img className="Image" src={cards?.[0]?.image} alt={cards?.[0]?.desc} />
        <img className="Image" src="https://deckofcardsapi.com/static/img/back.png" alt="back of card" />
      </div>
    )}

    {showCards && (
      <div>
      {cards.map(function(card, key){
        return <img className="Image" src={card.image} alt={card.desc} key={key} />;
      })}
    </div>
    )}

    </div>
  );
}

export default Player;
