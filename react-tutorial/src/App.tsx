import { useState } from 'react';

interface SquareProps {
    square: string;
    onClickHandle: () => void;
}

function Square({ square, onClickHandle }: SquareProps): JSX.Element {
    return <button className="square" onClick={onClickHandle}>{square}</button>
}

function calculateWinner(squares: string[]): string | null {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6]
    ]

    for (const line of lines) {
        const [a, b, c] = line;
        if (!!!squares[a] || !!!squares[b] || !!!squares[c]) continue;

        if (squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

interface BoardProps {
    onClickHandle: (i: number) => void;
    currentsquares: string[];
}

function Board({ onClickHandle, currentsquares }: BoardProps): JSX.Element {
    let buttons: JSX.Element[] = [];
    for (let index = 0; index < 3; index++) {
        buttons.push(
            //3*3のボタンを作成
            <div className="board-row" key={index}>
                <Square square={currentsquares[0 + (index * 3)]} onClickHandle={() => onClickHandle(0 + (index * 3))} />
                <Square square={currentsquares[1 + (index * 3)]} onClickHandle={() => onClickHandle(1 + (index * 3))} />
                <Square square={currentsquares[2 + (index * 3)]} onClickHandle={() => onClickHandle(2 + (index * 3))} />
            </div>
        );
    }

    //<div className="status">{status}</div>
    return (
        <>
            {buttons}
        </>
    )
}

export default function Game() {
    const [histores, setHistores] = useState<string[]>([]);
    const [currentsquares, setCurrentSquares] = useState<string[]>(Array(9).fill(null));
    const [status, setStatus] = useState<string>("");
    const [player, setPlayer] = useState<string>('X');
    const [isGameEnd, setIsGameEnd] = useState<boolean>(false);

    const onClickHandle = (i: number) => {
        if (currentsquares[i] != null || isGameEnd) return;

        // 盤面更新
        const newSquares = currentsquares.slice();
        newSquares[i] = player;
        setCurrentSquares(newSquares);

        // 履歴更新
        const newHistores = histores.slice();
        newHistores.push(newSquares.join());
        setHistores(newHistores);

        // 勝敗判定
        if (calculateWinner(newSquares) !== null) {
            setStatus(player + " is winner");
            setIsGameEnd(true);
            return;
        }

        // プレイヤー交代
        const nextPlayer = (player === 'X') ? 'O' : 'X';
        setPlayer(nextPlayer);
        setStatus("Next player: " + nextPlayer);
    };

    const move = () => {
        const histryButtones: JSX.Element[] = [];
        histores.forEach((history, index) => {
            histryButtones.push(
                <>
                    <li key={index}>
                        <button onClick={() => { setCurrentSquares(history.split(",")); }}>{history}</button>
                    </li>
                </>
            )
        });

        return (
            <>
                {histryButtones}
            </>
        );
    };

    return (
        <div className="game">
            <div className="game-board" >
                <Board onClickHandle={onClickHandle} currentsquares={currentsquares} />
                <div className="status">{status}</div>
            </div>
            <div className="game-info">
                <ol>{move()}</ol>
            </div>
        </div>
    );
}