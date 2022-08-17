import React, { useEffect, useState } from 'react';
import './mat.css';

function Mat() {
    let id: string = "jtatq55nbryd";
    const [count, setCount] = useState(0);
    const [turn, setTurn] = useState(0);
    const crazy: string[] = ["ACE", "JACK"]
    const [hand, setHand] = useState([{ src: "", value: "", suit: "" }]);
    const [hand1, setHand1] = useState([{ src: "", value: "", suit: "" }]);
    const [hand2, setHand2] = useState([{ src: "", value: "", suit: "" }]);
    const [hand3, setHand3] = useState([{ src: "", value: "", suit: "" }]);
    const [pile, setPile] = useState([{ src: "", value: "", suit: "" }]);

    /**
     * used to get deck id, not currently in use as deck id remains, but may use again later
     */
    function getData() {
        fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            .then((response) => response.json())
            .then((data) => {
                assignCount(data)
            })
    }


    function drawStart() {
        setTurn(turn => 0);
        setPile(([{ src: "", value: "", suit: "" }]));
        setHand(([{ src: "", value: "", suit: "" }]));
        setHand1(([{ src: "", value: "", suit: "" }]));
        setHand2(([{ src: "", value: "", suit: "" }]));
        setHand3(([{ src: "", value: "", suit: "" }]));
        fetch("https://www.deckofcardsapi.com/api/deck/" + id + "/return/");
        fetch("https://www.deckofcardsapi.com/api/deck/" + id + "/draw/?count=20")
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                assignStartingHand(data)
                assignCount(data)
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
        if (turn === player && count > 0) {
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
                setCount(count => count - 1);
                if (turn < 3) {
                    setTurn(turn => turn + 1);
                }
                else {
                    setTurn(turn => 0)
                }
                setPile([{ src: handSrc, value: handValue, suit: handSuit }]);
                if (player === 0) {
                    let placeholder = [...hand];
                    placeholder.splice(index, 1);
                    setHand(placeholder);
                    if (placeholder.length === 1) {
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
                    if (placeholder.length === 1) {
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
                    if (placeholder.length === 1) {
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
                    if (placeholder.length === 1) {
                        let win = document.getElementById("win3");
                        if (win != null) {
                            win.style.display = "inline-block";
                        }
                    }
                }
                return true;
            }
            else {
                return false;
            }
        }
    }

    function draw(player: number) {
        if (player === turn) {
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
        if (turn < 3) {
            setTurn(turn => turn + 1)
        }
        else {
            setTurn(turn => 0)
        }
    }


    function reShuffle() {
        fetch("https://www.deckofcardsapi.com/api/deck/" + id + "/return/");
    }

    useEffect(() => {
        reShuffle();
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
                            <img className='card' onClick={() => addPile(index, 2)} src={card.src} alt="" />
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
            <div className='label label3'>P3&nbsp;
                <div className='win3' id="win3">
                    wins!
                </div></div>
            <div className='items'>
                {hand.map((card, index) => {
                    return (
                        <div className="item">
                            <img className='card' onClick={() => addPile(index, 0)} src={card.src} alt="" />
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
                    <button className="start" onClick={() => drawStart()}>New Game <br /> (Click to Start)</button>
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
                </div>
            </div>
        </div>
    );
}

export default Mat;
