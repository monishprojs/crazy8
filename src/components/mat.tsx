import React, { useEffect, useState } from 'react';
import './mat.css';

function Mat() {
    let id: string = "jtatq55nbryd";
    let count: number = 0;
    const [hand, setHand] = useState([{ src: "", value: "", suit: "" }]);

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
        fetch("https://www.deckofcardsapi.com/api/deck/" + id + "/draw/?count=1")
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                assignHand(data)
            })
    }

    function assignHand(data: any) {
        setHand(hand => [...hand, { src: data.cards[0].image, value: data.cards[0].value, suit: data.cards[0].suit }]);
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
                {hand.map((card) => {
                    return (
                        <div className="item">
                            <img src={card.src} alt="" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Mat;
