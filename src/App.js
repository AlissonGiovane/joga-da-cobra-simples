import React, {Component} from "react";
import "./App.css"


const  ALTURA = 10;
const  LARGURA  = 10;

// setando as teclas
const ESQUERDA  = 37; 
const CIMA    = 38;
const DIREITA = 39; 
const BAIXO  = 40;
const PARAR  = 32; /* espaço para pausar */


const aleatorio = () => {
    return  { 
        x: Math.floor(Math.random() *LARGURA),
        y: Math.floor(Math.random() *ALTURA) 
    }
}


const camposVazios = () => [...Array(LARGURA)].map((_) => [...Array(ALTURA)].map((_)=> 'grid-item'));


const aumentaVelocidade = (Velocidade) => Velocidade - 10 *(Velocidade > 10)


const estadosIniciais = {
    campos: camposVazios(),
    cobra: [aleatorio()],
    fruta: aleatorio(),
    direcao: PARAR,
    Velocidade: 100,
}

class App extends Component {

    constructor() {
        super();
        this.state = estadosIniciais;
    }

    componentDidMount() {
        setInterval(this.moveCobra, this.state.Velocidade);
        document.onkeydown = this.mudaDirecao;
    }

    componentDidUpdate() {
        this.Colidiu();
        this.Comeu();
    }

    moveCobra = () => {
        let cobraCopia = [...this.state.cobra];
        let cabeca  =  {...cobraCopia[cobraCopia.length-1]};
        switch (this.state.direcao) {
            case ESQUERDA:  cabeca.y += -1; break;    
            case CIMA:    cabeca.x += -1; break;
            case DIREITA: cabeca.y += 1;  break;
            case BAIXO:  cabeca.x += 1;  break;
            default: return;
        }
        
        cabeca.x += ALTURA * ((cabeca.x<0)-(cabeca.x>=ALTURA));
        cabeca.y += LARGURA * ((cabeca.y<0)-(cabeca.y>=LARGURA));
        
        cobraCopia.push(cabeca); 
        cobraCopia.shift()
        this.setState({
            cobra: cobraCopia,
            cabeca: cabeca
        });
        this.Atualiza(); 
    }   
    
    Comeu() {
        let cobraCopia  = [...this.state.cobra];
        let cabeca  =  {...cobraCopia[cobraCopia.length-1]};
        let fruta = this.state.fruta;
        if ((cabeca.x === fruta.x) &&(cabeca.y === fruta.y)) {
            cobraCopia.push(cabeca);
            this.setState({
                cobra: cobraCopia,
                fruta: aleatorio(),
                Velocidade: aumentaVelocidade(this.state.Velocidade) 
            });
        } 
    }

    Atualiza() {
        let novosCampos = camposVazios(); 
        this.state.cobra.forEach(element => novosCampos[element.x][element.y] = 'Cobra')
        novosCampos[this.state.fruta.x][this.state.fruta.y] = 'Fruta';
        this.setState({campos: novosCampos});
    }

    Colidiu = () => {
        let cobra = this.state.cobra;
        let cabeca  = {...cobra[cobra.length-1]} 
        for (let i=0; i<cobra.length-3; i++) {
            if ((cabeca.x === cobra[i].x) &&(cabeca.y === cobra[i].y)) {
                this.setState(estadosIniciais);
                alert(`game over: ${cobra.length*10}`)
            }
        }
    }

    mudaDirecao = ({keyCode}) => { 
        let direcao = this.state.direcao;
        switch (keyCode) {
            case ESQUERDA:
                direcao = (direcao === DIREITA)? DIREITA: ESQUERDA;
                break;
            case DIREITA:
                direcao = (direcao === ESQUERDA)? ESQUERDA: DIREITA;
                break;
            case CIMA:
                direcao = (direcao === BAIXO)? BAIXO: CIMA;
                break;
            case BAIXO:
                direcao = (direcao === CIMA)? CIMA: BAIXO;
                break;
            case PARAR:
                direcao = PARAR;
                break;
            default:
                break;
        }
        this.setState({
            direcao: direcao
        });
    }    

   
    render() {
        const mostraCampos = this.state.campos.map((campo, i) => campo.map((value, j) =>  <div name={`${i}=${j}`} className={value} />))
        return (
            <div className="a">
                <h1>  Joga da Cobra Simples</h1>
                <ul>
                    <li>Aperta 'Espaço' Para pausar o jogo</li>
                    <li>Controle a cobra pelas setas</li>
                </ul>
                <div className="Cobra-container">
                    <div className="grid">{mostraCampos}</div>
                </div>
            </div>
        )    
    }
}










export default App;