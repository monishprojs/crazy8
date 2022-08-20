import React, { useEffect, useState } from 'react';
import './mat.css';

function Mat() {
    const [id, setId] = useState("l1sswc39sb10"); //deck id
    const [count, setCount] = useState(0); //count of cards left in deck
    const [turn, setTurn] = useState(0); //whose turn it is
    const crazy: string[] = ["ACE", "JACK"] //cards who can always be added to the pile
    const [hand, setHand] = useState([{ src: "", value: "", suit: "" }]); //player 0's hand
    const [hand1, setHand1] = useState([{ src: "", value: "", suit: "" }]); //player 1's hand
    const [hand2, setHand2] = useState([{ src: "", value: "", suit: "" }]); //player 2's hand
    const [hand3, setHand3] = useState([{ src: "", value: "", suit: "" }]); //player 3's hand
    const [pile, setPile] = useState([{ src: "", value: "", suit: "" }]); //current card on the pile
    const [deck, setDeck] = useState([{ src: "", value: "", suit: "" }]);

    /**
     * used to get deck id, not currently in use as deck id remains unlike a standard api call, 
     * but may use again later
     */
    function getData() {
        fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            .then((response) => response.json())
            .then((data) => {
                assignId(data);
            })
    }

    /**
     * 
     * @param data data from first api call to get the deck
     * assigns the deck id to be used for the game
     */
    function assignId(data: any) {
        setId(data.deck_id)
    }

    /**
    * returns all cards to the deck and reshuffles the deck
    */
    function reShuffle() {
        fetch("https://www.deckofcardsapi.com/api/deck/" + id + "/return/");
        fetch("https://www.deckofcardsapi.com/api/deck/" + id + "/shuffle/");
    }

    /**
     * handles the drawing the starting hand for four players
     */
    function drawStart(first: boolean) {
        setTurn(0);
        setDeck(([{ src: "", value: "", suit: "" }]));
        setPile(([{ src: "", value: "", suit: "" }]));
        setHand(([{ src: "", value: "", suit: "" }]));
        setHand1(([{ src: "", value: "", suit: "" }]));
        setHand2(([{ src: "", value: "", suit: "" }]));
        setHand3(([{ src: "", value: "", suit: "" }]));
        reShuffle();
        fetch("https://www.deckofcardsapi.com/api/deck/" + id + "/draw/?count=52")
            .then((response) => response.json())
            .then((data) => {
                assignStartingHand(data, first)
            })
    }


    /**
     * 
     * @param data data from api call of drawing cards
     * assigns each plyer 5 cards from the deck
     */
    function assignStartingHand(data: any, first: boolean) {
        if (first === true) {
            let placeholder = [...hand];
            placeholder.splice(0, 1)
            setHand(placeholder);
            placeholder = [...hand1];
            placeholder.splice(0, 1)
            setHand1(placeholder);
            placeholder = [...hand2];
            placeholder.splice(0, 1)
            setHand2(placeholder);
            placeholder = [...hand3];
            placeholder.splice(0, 1)
            setHand3(placeholder);
            placeholder = [...deck];
            placeholder.splice(0, 1)
            setDeck(placeholder);
        }
        console.log(data);
        for (let i = 0; i < 5; ++i) {
            setHand(hand => [...hand, { src: data.cards[i].image, value: data.cards[i].value, suit: data.cards[i].suit }]);
        }
        for (let i = 5; i < 10; ++i) {
            setHand1(hand1 => [...hand1, { src: data.cards[i].image, value: data.cards[i].value, suit: data.cards[i].suit }]);
        }
        for (let i = 10; i < 15; ++i) {
            setHand2(hand2 => [...hand2, { src: data.cards[i].image, value: data.cards[i].value, suit: data.cards[i].suit }]);
        }
        for (let i = 15; i < 20; ++i) {
            setHand3(hand3 => [...hand3, { src: data.cards[i].image, value: data.cards[i].value, suit: data.cards[i].suit }]);
        }
        for (let i = 21; i < 52; ++i) {
            setDeck(deck => [...deck, { src: data.cards[i].image, value: data.cards[i].value, suit: data.cards[i].suit }]);
        }
        setCount(32);
    }

    /**
     * 
     * @param index index of card in players hand
     * @param player number of player
     * checks if it's the players turn and if the deck has cards(otherwise the game is over),
     * if it is the player's turn it then checks if the card is 
     * eligible to be added to the pile (same value, suit, or is ace/jack),
     * if valid then adds card to the pile and updates the turn number as well as the player's hand
     */
    function addPile(index: number, player: number) {
        if (turn === player && count > 0) {
            let eligible: boolean = false;
            let handSrc = "";
            let handValue = "";
            let handSuit = "";
            if (turn === 0) {
                handSrc = hand[index].src;
                handValue = hand[index].value;
                handSuit = hand[index].suit;
            }
            else if (turn === 1) {
                handSrc = hand1[index].src;
                handValue = hand1[index].value;
                handSuit = hand1[index].suit;
            }
            else if (turn === 2) {
                handSrc = hand2[index].src;
                handValue = hand2[index].value;
                handSuit = hand2[index].suit;
            }
            else if (turn === 3) {
                handSrc = hand3[index].src;
                handValue = hand3[index].value;
                handSuit = hand3[index].suit;
            }

            if (pile[0].src === "") {
                eligible = true;
            }
            else {
                let pileValue = pile[0].value;
                let pileSuit = pile[0].suit;
                if (handValue === pileValue || pileSuit === handSuit || crazy.includes(handValue)) {
                    eligible = true;
                }
            }
            if (eligible === true) {
                if (turn < 3) {
                    setTurn(turn => turn + 1);
                }
                else {
                    setTurn(0)
                }
                setPile([{ src: handSrc, value: handValue, suit: handSuit }]);
                if (player === 0) {
                    let placeholder = [...hand];
                    placeholder.splice(index, 1);
                    setHand(placeholder);
                    if (placeholder.length === 0) {
                        let win = document.getElementById("win");
                        if (win != null) {
                            win.style.display = "inline-block";
                        }
                    }
                }
                else if (player === 1) {
                    let placeholder = [...hand1];
                    placeholder.splice(index, 1);
                    setHand1(placeholder);
                    if (placeholder.length === 0) {
                        let win = document.getElementById("win1");
                        if (win != null) {
                            win.style.display = "inline-block";
                        }
                    }
                }
                else if (player === 2) {
                    let placeholder = [...hand2];
                    placeholder.splice(index, 1);
                    setHand2(placeholder);
                    if (placeholder.length === 0) {
                        let win = document.getElementById("win2");
                        if (win != null) {
                            win.style.display = "inline-block";
                        }
                    }
                }
                else if (player === 3) {
                    let placeholder = [...hand3];
                    placeholder.splice(index, 1);
                    setHand3(placeholder);
                    if (placeholder.length === 0) {
                        let win = document.getElementById("win3");
                        if (win != null) {
                            win.style.display = "inline-block";
                        }
                    }
                }
            }
        }
    }

    /**
     * 
     * @param player player number
     * draws from the deck
     */
    function draw(player: number) {
        if (player === turn && count > 0) {
            let deckImage = deck[0].src;
            let deckSuit = deck[0].suit;
            let deckValue = deck[0].value;
            if (player === 0) {
                setHand(hand => [...hand, { src: deckImage, value: deckValue, suit: deckSuit }]);
            }
            else if (player === 1) {
                setHand1(hand1 => [...hand1, { src: deckImage, value: deckValue, suit: deckSuit }]);
            }
            else if (player === 2) {
                setHand2(hand2 => [...hand2, { src: deckImage, value: deckValue, suit: deckSuit }]);
            }
            else if (player === 3) {
                setHand3(hand3 => [...hand3, { src: deckImage, value: deckValue, suit: deckSuit }]);
            }
            if (turn < 3) {
                setTurn(turn => turn + 1)
            }
            else {
                setTurn(0)
            }
            let placeholder = [...deck];
            placeholder.splice(0, 1)
            setDeck(placeholder);
            setCount(deck.length - 1);
        }
    }


    useEffect(() => {
        drawStart(true);
    }, [])
    return (
        <div className="mat">
            <div className="label label2">P2&nbsp;
                <div className='win2' id="win2">
                    wins!
                </div></div>
            <div className='items2'>
                {hand2.map((card, index) => {
                    return (
                        <div className="item">
                            <img className='card img2' onClick={() => addPile(index, 2)} src={card.src} alt="" />
                        </div>
                    );
                })}
            </div>
            <div className="label label1">P1&nbsp;
                <div className='win1' id="win1">
                    wins!
                </div>
            </div>
            <div className='items1'>
                {hand1.map((card, index) => {
                    return (
                        <div className="item">
                            <img className='card flipped img1' onClick={() => addPile(index, 1)} src={card.src} alt="" />
                        </div>
                    );
                })}
            </div>
            <div className='items3'>
                {hand3.map((card, index) => {
                    return (
                        <div className="item">
                            <img className='card flipped img3' onClick={() => addPile(index, 3)} src={card.src} alt="" />
                        </div>
                    );
                })}
            </div>
            <div className='label label3'>P3&nbsp;
                <div className='win3' id="win3">
                    wins!
                </div></div>
            <div className='items'>
                {hand.map((card, index) => {
                    return (
                        <div className="item">
                            <img className='card img' onClick={() => addPile(index, 0)} src={card.src} alt="" />
                        </div>
                    );
                })}
            </div>
            <div className='label label0'>P0&nbsp;
                <div className='win' id="win">
                    wins!
                </div></div>
            <div>
                <div className='info'>
                    <button className="start" onClick={() => drawStart(false)}>New Game <br /> (Click to Start)</button>
                    <p className='turn'>
                        Turn: P{turn}
                        <br />
                        Cards Left: {count}
                    </p>
                </div>
                <div className='pile'>
                    <img src="https://www.deckofcardsapi.com/static/img/back.png" alt="back" className='card' onClick={() => draw(turn)}>
                    </img>
                    {pile.map((card) => {
                        return (
                            <div className="item">
                                <img className='card' src={card.src} alt="" />
                            </div>
                        );
                    })}
                    <br />
                </div>
                <div className='deckLabel'>
                    Click Deck to Draw
                </div>
            </div>
        </div>
    );
}

export default Mat;
