import React from 'react';
import ReactDOM from 'react-dom';
import arrayContains from 'array-contains';
import classNames from 'classnames';
import deepcopy from 'deepcopy';
import Modal from 'react-modal';
import 'mini.css/dist/mini-default.css';
import './index.css';
import Item from './components/Item';

function Square(props) {
  return (
    <button className={classNames("square", {[props.ind + 1]: props.ind + 1, highlight: props.cl})} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, cl) {
    return (
      <Square
        value={this.props.squares[i].sign}
        touched={this.props.touched}
        ind={i}
        cl={cl}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  setHighlight(indexes, source) {
    return indexes && indexes.indexOf(source) !== -1;
  }

  render() {
    return (
      <div class="row">
        <div className="board-row">
          {this.renderSquare(0, this.setHighlight(this.props.indexes, 0))}
          {this.renderSquare(1, this.setHighlight(this.props.indexes, 1))}
          {this.renderSquare(2, this.setHighlight(this.props.indexes, 2))}
        </div>
        <div className="board-row">
          {this.renderSquare(3, this.setHighlight(this.props.indexes, 3))}
          {this.renderSquare(4, this.setHighlight(this.props.indexes, 4))}
          {this.renderSquare(5, this.setHighlight(this.props.indexes, 5))}
        </div>
        <div className="board-row">
          {this.renderSquare(6, this.setHighlight(this.props.indexes, 6))}
          {this.renderSquare(7, this.setHighlight(this.props.indexes, 7))}
          {this.renderSquare(8, this.setHighlight(this.props.indexes, 8))}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    let items = [];
    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 3; j++) {
        items.push(new Item(i, j, '-'));
      }
    }
    this.state = {
      history: [{
        squares: deepcopy(items)
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares;
    if (calculateWinner(squares) || squares[i].isSet()) {
      return;
    }
    let newSquares = [];
    for(let j = 0; j < squares.length; j++) {
      newSquares.push(new Item(squares[j].x, squares[j].y, j === i ? this.state.xIsNext ? 'X' : 'O' : squares[j].sign));
    }
    this.setState({
      history: history.concat([{
        squares: newSquares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  reset() {
    let items = [];
    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 3; j++) {
        items.push(new Item(i, j, '-'));
      }
    }
    this.setState({
      history: [{
        squares: items.slice(0)
      }],
      stepNumber: 0,
      xIsNext: true,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
    if (step < 2) {
      console.log('a1', this.state.history[0].squares);
      console.log('a2', this.state.history[2].squares);
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    console.log('num', this.state.stepNumber);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Move #' + move :
        'Game start';
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.obj.sign;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    // this.props.reset && this.reset();

    return (
      <div className={classNames("game", {finished: winner})}>
        <div className="row">
          <div className="game-board">
            <Board
              indexes={winner && winner.indexes}
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
            <button onClick={this.reset.bind(this)}>Reset</button>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

class Workaround extends React.Component {
  constructor() {
    super();
    this.newGame = this.newGame.bind(this);
    this.state = {game: <Game />};
  }

  newGame() {
    this.setState({game: <Game reset={true} />});
  }

  render() {
    return (
      <div>
        <Game />
      </div>
    );
  }
}

class GameRound extends React.Component {
  constructor() {
    super();
    this.state = {round: 1, modalIsOpen: false};
    this.handleModalClose = this.handleModalClose.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
  }

  handleClick() {
    this.setState({round: this.state.round + 1});
  }

  afterOpenModal() {
    this.subtitle.style.color = '#f6e182';
  }

  handleModalClose() {
    this.setState({modalIsOpen: false});
  }

  render() {
    return (
      <div class="container">
        <div className="card error">
          <img src="https://i.ytimg.com/vi/Btqro3544p8/maxresdefault.jpg" alt="Btqro" />
          <p>Warning</p>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.handleModalClose}
          closeTimeout={250}
          style={{
            overlay: {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(120, 10, 30, .75)'
            },
            content: {
              position: 'absolute',
              top: '100px',
              left: '160px',
              right: '80px',
              bottom: '100px',
              border: '3px solid #e90192',
              background: '#9016ba',
              overflow: 'auto'
            }
          }}
          contentLabel="Modal"
        >
          <h1 ref={subtitle => this.subtitle = subtitle}>Modal Content</h1>
          <button onClick={this.handleModalClose}>close</button>
          <p>Etc.</p>
        </Modal>
        <Workaround round={this.state.round} />
        <button onClick={() => this.handleClick()}>New Round</button>
        <footer>
          <p>&copy; 2017 Vitakrya</p>
        </footer>
      </div>
    );
  }
}
// ========================================

ReactDOM.render(
  <GameRound />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [[0,0],[0,1],[0,2]],
    [[1,0],[1,1],[1,2]],
    [[2,0],[2,1],[2,2]],
    [[0,0],[1,1],[2,2]],
    [[2,0],[1,1],[0,2]]
  ];
  for (let i = 0, j = 0; i < squares.length && j < 3; i+=3, j++) {
    if (squares[i].isSet()) {
      if (i === 0) {
        if (squares[i].sign === squares[i + 4].sign && squares[i + 4].sign === squares[i + 8].sign) {
          return {obj: squares[i], indexes: [i, i + 4, i + 8]};
        }
      } else if (i === 6) {
        if (squares[i].sign === squares[i - 2].sign && squares[i].sign === squares[i - 4].sign) {
          return {obj: squares[i], indexes: [i, i - 2, i - 4]};
        }
      }

      if (squares[i].sign === squares[i + 1].sign && squares[i + 1].sign === squares[i + 2].sign) {
        const arr = [
          [squares[i].x, squares[i].y],
          [squares[i].x, squares[i + 1].y],
          [squares[i].x, squares[i + 2].y]
        ];
        if (arrayContains(lines, arr)) {
          return {obj: squares[i], indexes: [i, i + 1, i + 2]};
        }
      }

      else if (squares[j].isSet() && squares[j].sign === squares[j+3].sign && squares[j].sign === squares[j+6].sign) {
        return {obj: squares[j], indexes: [j, j+3, j+6]};
      }
    }

  }
  return null;
}
