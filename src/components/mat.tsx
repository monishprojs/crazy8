import React, { useEffect, useState } from 'react';
import './mat.css';

function Mat() {
    let id: string = "jtatq55nbryd";
    const [count, setCount] = useState(0);
    const [turn, setTurn] = useState(0);
    const crazy: string[] = ["ACE", "JACK", "KING", "QUEEN"]
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
                assignCount(data)
            })
    }

    function drawStart() {
        fetch("https://www.deckofcardsapi.com/api/deck/" + id + "/draw/?count=20")
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                assignStartingHand(data)
                assignCount(data)
                console.log(data)
            })
    }

    function assignCount(data: any) {
        setCount(data.remaining as unknown as number);
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

    function addPile(index: number, player: number) {
        if (turn === player) {
            let eligible: boolean = false;
            let handSrc = "";
            let handValue = "";
            let handSuit = "";
            if (player === 0) {
                handSrc = hand[index].src;
                handValue = hand[index].value;
                handSuit = hand[index].suit;
            }
            else if (player === 1) {
                handSrc = hand1[index].src;
                handValue = hand1[index].value;
                handSuit = hand1[index].suit;
            }
            else if (player === 2) {
                handSrc = hand2[index].src;
                handValue = hand2[index].value;
                handSuit = hand2[index].suit;
            }
            else if (player === 3) {
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
                    setTurn(0);
                }
                if (player === 0) {
                    setPile([{ src: handSrc, value: handValue, suit: handSuit }])
                    let placeholder = [...hand];
                    placeholder.splice(index, 1);
                    setHand(placeholder);
                    aiLoop1();
                }
                else if (player === 1) {
                    setPile([{ src: handSrc, value: handValue, suit: handSuit }])
                    let placeholder = [...hand1];
                    placeholder.splice(index, 1);
                    setHand1(placeholder);
                }
                else if (player === 2) {
                    setPile([{ src: handSrc, value: handValue, suit: handSuit }])
                    let placeholder = [...hand2];
                    placeholder.splice(index, 1);
                    setHand2(placeholder);
                }
                else if (player === 3) {
                    setPile([{ src: handSrc, value: handValue, suit: handSuit }])
                    let placeholder = [...hand3];
                    placeholder.splice(index, 1);
                    setHand3(placeholder);
                }
            }
        }
    }

    function draw(player: number) {
        if (player === turn + 1) {
            fetch("https://www.deckofcardsapi.com/api/deck/" + id + "/draw/?count=1")
                .then((response) => response.json())
                .then((data) => {
                    assignHand(data, player)
                    assignCount(data)
                })
        }
    }

    function assignHand(data: any, player: number) {
        if (player === 0) {
            setHand(hand => [...hand, { src: data.cards[0].image, value: data.cards[0].value, suit: data.cards[0].suit }]);
        }
        else if (player === 1) {
            setHand1(hand1 => [...hand1, { src: data.cards[0].image, value: data.cards[0].value, suit: data.cards[0].suit }]);
        }
        else if (player === 2) {
            setHand2(hand2 => [...hand2, { src: data.cards[0].image, value: data.cards[0].value, suit: data.cards[0].suit }]);
        }
        else if (player === 3) {
            setHand3(hand3 => [...hand3, { src: data.cards[0].image, value: data.cards[0].value, suit: data.cards[0].suit }]);
        }
    }

    function aiLoop1() {
        let shouldDraw: boolean = true;
        let i: number = 0;
        while (i < hand1.length) {
            console.log(pile[0].suit);
            console.log(hand[i].suit);
            if (hand1[i].suit === pile[0].suit || hand1[i].value === pile[0].value) {
                shouldDraw = false;
                i = hand1.length + 1;
            }
            else {
                i = i + 1;
            }
        }
        if (shouldDraw) {
            draw(1);
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
                <button className="start" onClick={() => drawStart()}>start</button>
            </div>
            <div className='items2'>
                {hand2.map((card, index) => {
                    return (
                        <div className="item">
                            <img className='card' onClick={() => addPile(index, 2)} src={card.src} alt="" />
                        </div>
                    );
                })}
            </div>
            <div className='items1'>
                {hand1.map((card, index) => {
                    return (
                        <div className="item">
                            <img className='card' onClick={() => addPile(index, 1)} src={card.src} alt="" />
                        </div>
                    );
                })}
            </div>
            <div className='items3'>
                {hand3.map((card, index) => {
                    return (
                        <div className="item">
                            <img className='card' onClick={() => addPile(index, 3)} src={card.src} alt="" />
                        </div>
                    );
                })}
            </div>
            <div className='items'>
                {hand.map((card, index) => {
                    return (
                        <div className="item">
                            <img className='card' onClick={() => addPile(index, 0)} src={card.src} alt="" />
                        </div>
                    );
                })}
            </div>
            <div className='pile'>
                <p>Turn: {turn}</p>
                <button className='card' onClick={() => draw(0)}>draw {count}</button>
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
