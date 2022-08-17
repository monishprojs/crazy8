import React, { useEffect, useState } from 'react';
import './mat.css';

function Mat() {
    let id: string = "jtatq55nbryd";
    let count: number = 0;
    const [hand, setHand] = useState([{ src: "", value: "", suit: "" }]);
    const [pile, setPile] = useState([{ src: "", value: "", suit: "" }])

    function getData() {
        fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                assignDeck(data)
            })
    }

    function assignDeck(data: any) {
        count = data.remaining as unknown as number;
    }

    function draw() {
        fetch("https://www.deckofcardsapi.com/api/deck/" + id + "/draw/?count=5")
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                assignHand(data)
            })
    }

    function assignHand(data: any) {
        for (let i = 0; i < 5; ++i) {
            setHand(hand => [...hand, { src: data.cards[i].image, value: data.cards[i].value, suit: data.cards[i].suit }]);
        }
    }

    function addPile(index: number) {
        let srcPlace = hand[index].src;
        let valuePlace = hand[index].value;
        let suitPlace = hand[index].suit;
        setPile([{ src: srcPlace, value: valuePlace, suit: suitPlace }])

        let placeholder = [...hand];
        placeholder.splice(index, 1);
        setHand(placeholder);

    }

    function reShuffle() {
        fetch("https://www.deckofcardsapi.com/api/deck/" + id + "/return/")
    }

    useEffect(() => {
        reShuffle()
    }, [])
    return (
        <div className="mat">
            <div>
                <button onClick={getData}>start</button>
            </div>
            <div>
                <button onClick={draw}>draw</button>
            </div>
            <div className='items'>
                {hand.map((card, index) => {
                    return (
                        <div className="item">
                            <img className='card' onClick={() => addPile(index)} src={card.src} alt="" />
                        </div>
                    );
                })}
            </div>
            <div>
                {pile.map((card) => {
                    return (
                        <div className="item">
                            <img className='card' src={card.src} alt="" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Mat;
