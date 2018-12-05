//importar react
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

//declarar variaveis
let animationFrameStatus;
let jumpDuration = 1000;


class Game extends React.Component {
    
    //
    constructor(props) {
        super(props);

        this.state = {
            isPlaying: false,
            isJumping: false,
            gameSpeed: 100,
            distance: 0,
            score: 0,
            bgOffset: 0,
            floorOffset: 0,
            itemOffset: 0,
            lifes: 3,
            items: {
                item1: {bottom: 20, left: 500, touched: false},
                item2: {bottom: 20, left: 1000, touched: false},
                item3: {bottom: 40, left: 1500, touched: false},
                item4: {bottom: 20, left: 2000, touched: false},
                item5: {bottom: 50, left: 2500, touched: false},
                item6: {bottom: 30, left: 3000, touched: false}
            }
        };

        this.domRefs = {}; // to store dom refs    
        this.pauseGame = this.pauseGame.bind(this); 
        this.animateElements = this.animateElements.bind(this);
        this.refTest = this.refTest.bind(this);
    }

    getBounds(ref) {
        return ReactDOM.findDOMNode(ref).getBoundingClientRect();
    }

    pauseGame(){
        // if(e) e.preventDefault();
        if (this.state.isPlaying === false ) { 
            this.setState({isPlaying : true}) 
            animationFrameStatus = requestAnimationFrame(this.animateElements)
        } else {    
            this.setState({isPlaying : false}) 
            animationFrameStatus = cancelAnimationFrame(this.animateElements)
        }
    }


    //animação dos elementos
    animateElements() {

        //difine se o inimigos foram tocados
        let gameSpeed = this.state.gameSpeed;
        function detectCollision(a, b) {
            console.log()
            return !(
                ((a.y + a.height) < (b.y)) ||
                (a.y > (b.y + b.height)) ||
                ((a.x + a.width) < b.x) ||
                (a.x > (b.x + b.width))
            );
        }

        // Aumenta a velociade
        this.setState({gameSpeed: (this.state.distance / 25) + 9 });

        //se esta jogando
        if (this.state.isPlaying === true) {

            //se bgOffSet menor ou igual a 900
            if (this.state.bgOffset >= 900 ) {
                //retorna o fundo e chão para o inicio
                this.setState({ bgOffset: 0 })
                this.setState({ floorOffset: 0 })
            } else {
                //se não add 1 to Offset 
                this.setState({ bgOffset: this.state.bgOffset + (0.5 * gameSpeed) })
                this.setState({ floorOffset: this.state.floorOffset + (0.5 * gameSpeed) })
            }
            // velocidade de movimento do inimigo
            this.setState({ itemOffset: this.state.itemOffset + (0.6 * gameSpeed) })
            //distancia +1
            this.setState({ distance: this.state.distance + 0.1  })

            Object.keys(this.state.items).forEach((item) => {
                console.log(item + ' test')
                var isCollide = detectCollision(this.getBounds(this.refs.player), this.getBounds(this.domRefs[item]))
                if (isCollide === true) {
                    let newState = this.state;
                    
                    // increase score + update state of item as `touched`                    
                    if (this.state.items[item].touched === false) {
                        this.setState({ lifes: this.state.lifes - 1 })  
                        this.setState({ newState })
                    }
                    console.log('newState', newState)
                }
            })
        }

        animationFrameStatus = requestAnimationFrame(this.animateElements);
    }

    itemRender(key) {
        // console.log('this.state.items[item1]', this.state); 
        let test = key;
        let thisItem = this.state.items[key];
        let styles = {
            transform: 'translate3d(-' + this.state.itemOffset + 'px, 0, 0)', 
            bottom: thisItem.bottom,
            left: thisItem.left,
        }
        return ( 
            <div 
                className={'c-item ' + (this.state.items[key].touched === true ? 'is-touched' : '')} 
                key={key} 
                ref={(ref) => {this.domRefs[key] = ref}} 
                style={styles}>
            </div> )
    }

    refTest(passed) {
        let target = 'item' + passed;
        console.log('target', target)
        // console.log('this.domRrefs.item1', this.domRrefs.item1)
        console.log('refTest', this.domRefs[target]);
    }

    componentDidMount() {
        // To do speed based on distance loop or division
        // setInterval(() => {
        //     let currentGameSpeed = this.state.gameSpeed;
        //     this.setState({gameSpeed: currentGameSpeed + .5})
        // },500);

        document.addEventListener('keypress', (event) => {
            // se presionar espaço e pulando = false e jogando = verdade
            if(event.keyCode === 32 && this.state.isJumping === false && this.state.isPlaying === true) {
                console.log('1');
                (event).preventDefault();
                this.state.isJumping === false ? this.setState({ isJumping: true }) : this.setState({ isJumping: false }) ;
                setTimeout( ()=> {
                    this.state.isJumping === true ? this.setState({ isJumping: false }) : '' ;
                }, jumpDuration + 50);
            }
        });
    }

    render() {
        let bgStyles = {transform: 'translate3d(-' + this.state.bgOffset + 'px, 0, 0)'}
        let floorStyles = {transform: 'translate3d(-' + this.state.floorOffset + 'px, 0, 0)'} 
        let itemStyles = {transform: 'translate3d(-' + this.state.itemOffset + 'px, 0, 0)'} 

        return (
            <div className="l-game-wrapper">
                <div className="c-ui-buttons">
                    <button onClick={() => this.pauseGame()}>Iniciar / Parar</button>
                </div>

                <div className={'c-player ' + (this.state.isJumping === true ? 'is-jumping' : '') } ref="player"
                style={{animationDuration: (jumpDuration / 1000) + 's'}}></div>

                {Object.keys(this.state.items).map(key => this.itemRender(key))}

                <div className="c-floor" style={floorStyles}></div>
                <div className="c-bg" style={bgStyles}></div>

                <div className="c-data">
                    <p>Jogando: {this.state.isPlaying === true ? 'true' : 'false'}</p>
                    <p>Distancia: {this.state.distance}</p>
                    <p>Velocidade: {this.state.gameSpeed}</p>
                    <h4 style={{margin: '5px 0'}}>Pontuação: {this.state.score}</h4>
                    <p>BgOffset: {this.state.bgOffset}</p>
                    <p>floorOffset: {this.state.floorOffset}</p>
                    <p>Vida: {this.state.lifes}</p>
                </div>
            </div>
        );
    }
}

export default Game;
