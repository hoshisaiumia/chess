import { useState } from "react";
import "./style.css";

import whiteBishop from "../../assets/bishop-w.svg";
import whiteKing from "../../assets/king-w.svg";
import whiteQueen from "../../assets/queen-w.svg";
import whiteRook from "../../assets/rook-w.svg";
import whiteKnight from "../../assets/knight-w.svg";
import whitePawn from "../../assets/pawn-w.svg";

import blackBishop from "../../assets/bishop-b.svg";
import blackKing from "../../assets/king-b.svg";
import blackQueen from "../../assets/queen-b.svg";
import blackRook from "../../assets/rook-b.svg";
import blackKnight from "../../assets/knight-b.svg";
import blackPawn from "../../assets/pawn-b.svg";

export type PieceType =
  | "BISHOP"
  | "ROOK"
  | "QUEEN"
  | "KING"
  | "KNIGHT"
  | "PAWN";
export type Team = "WHITE" | "BLACK";

export type Piece = {
  x: number;
  y: number;
  type: PieceType;
  team: Team;
};

export type Tile = Piece | null;

export type BoardState = Tile[][];

function createBoard() {
  return Array.from({ length: 8 }, () => Array<Tile>(8).fill(null));
}

function place(
  board: BoardState,
  x: number,
  y: number,
  type: PieceType,
  team: Team,
) {
  board[y][x] = { x, y, type, team };
}

function createInitialBoard() {
  const board = createBoard();
  for (let x = 0; x < 8; x++) {
    // Pawns
    place(board, x, 1, "PAWN", "BLACK");
    place(board, x, 6, "PAWN", "WHITE");
  }

  // Rook
  place(board, 0, 0, "ROOK", "BLACK");
  place(board, 7, 0, "ROOK", "BLACK");
  place(board, 0, 7, "ROOK", "WHITE");
  place(board, 7, 7, "ROOK", "WHITE");

  // Knight
  place(board, 1, 0, "KNIGHT", "BLACK");
  place(board, 1, 7, "KNIGHT", "WHITE");
  place(board, 6, 0, "KNIGHT", "BLACK");
  place(board, 6, 7, "KNIGHT", "WHITE");

  // Bishop
  place(board, 2, 0, "BISHOP", "BLACK");
  place(board, 2, 7, "BISHOP", "WHITE");
  place(board, 5, 0, "BISHOP", "BLACK");
  place(board, 5, 7, "BISHOP", "WHITE");

  // Queen
  place(board, 3, 0, "QUEEN", "BLACK");
  place(board, 3, 7, "QUEEN", "WHITE");

  // King
  place(board, 4, 0, "KING", "BLACK");
  place(board, 4, 7, "KING", "WHITE");

  return board;
}

const pieces: Record<Team, Record<PieceType, string>> = {
  WHITE: {
    BISHOP: whiteBishop,
    ROOK: whiteRook,
    QUEEN: whiteQueen,
    KING: whiteKing,
    KNIGHT: whiteKnight,
    PAWN: whitePawn,
  },
  BLACK: {
    BISHOP: blackBishop,
    ROOK: blackRook,
    QUEEN: blackQueen,
    KING: blackKing,
    KNIGHT: blackKnight,
    PAWN: blackPawn,
  },
};

export default function Board() {
  const [board, setBoard] = useState<BoardState>(createInitialBoard);

  return (
    <div className="chess-grid">
      {board.map((row, y) =>
        row.map((tile, x) => {
          const isLight = (x + y) % 2 === 0;
          return (
            <div
              style={{ backgroundColor: isLight ? "#e3c9a6" : "#75a94e" }}
              className="chess-tile"
            >
              <h1
                draggable={false}
                style={{ userSelect: "none", pointerEvents: "none" }}
              >
                {x}, {y}
              </h1>
              {tile && (
                <img
                  src={pieces[tile.team][tile.type]}
                  alt=""
                  draggable={false}
                  className="chess-piece"
                />
              )}
            </div>
          );
        }),
      )}
    </div>
  );
}
