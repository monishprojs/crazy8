import React, { useEffect, useState } from 'react';
import './mat.css';

function Mat() {
    let id: string = "jtatq55nbryd";
    let count: number = 0;
    let turn: number = 0;
    const crazy: string[] = ["ace", "jack", "king", "queen"]
    const [hand, setHand] = useState([{ src: "", value: "", suit: "" }]);
    const [hand1, setHand1] = useState([{ src: "", value: "", suit: "" }]);
    const [hand2, setHand2] = useState([{ src: "", value: "", suit: "" }]);
    const [hand3, setHand3] = useState([{ src: "", value: "", suit: "" }]);
    const [pile, setPile] = useState([{ src: "", value: "", suit: "" }]);


    function getData() {
        fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                assignDeck(data)
            })
    }

    function drawStart() {
        fetch("https://www.deckofcardsapi.com/api/deck/" + id + "/draw/?count=20")
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                assignStartingHand(data)
                assignDeck(data)
                console.log(data)
            })
    }

    function assignDeck(data: any) {
        count = data.remaining as unknown as number;
    }


    function assignStartingHand(data: any) {
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
    }

    function addPile(index: number) {
        let eligible: boolean = false;
        let handSrc = hand[index].src;
        let handValue = hand[index].value;
        let handSuit = hand[index].suit;
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
            setPile([{ src: handSrc, value: handValue, suit: handSuit }])

            let placeholder = [...hand];
            placeholder.splice(index, 1);
            setHand(placeholder);
        }


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
                <button onClick={() => drawStart()}>start</button>
            </div>
            <div>
                <button >draw</button>
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
            <div className='items'>
                {hand1.map((card, index) => {
                    return (
                        <div className="item">
                            <img className='card' onClick={() => addPile(index)} src={card.src} alt="" />
                        </div>
                    );
                })}
            </div>
            <div className='items'>
                {hand2.map((card, index) => {
                    return (
                        <div className="item">
                            <img className='card' onClick={() => addPile(index)} src={card.src} alt="" />
                        </div>
                    );
                })}
            </div>
            <div className='items'>
                {hand3.map((card, index) => {
                    return (
                        <div className="item">
                            <img className='card' onClick={() => addPile(index)} src={card.src} alt="" />
                        </div>
                    );
                })}
            </div>
            <div className='pile'>
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
