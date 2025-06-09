async function newDeck() {
    const deck = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6");
    return deck.json();
}

async function shuffleDeck(id:string) {
    const shuffle = await fetch(`https://deckofcardsapi.com/api/deck/${id}/shuffle/`);
    return shuffle.json();
}

async function drawCards(id:string, amount:string) {
    const cards = await fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=${amount}`);
    return cards.json();
}

export { newDeck, shuffleDeck, drawCards };