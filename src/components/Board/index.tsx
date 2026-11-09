import { useState, useRef } from "react";
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
  const [piece, setPiece] = useState<Piece | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function handleMouseDown(e: React.MouseEvent<HTMLImageElement>, tile: Piece) {
    setPiece(tile);
    imgRef.current = e.currentTarget;
    moveImage(e.clientX, e.clientY);
  }

  function moveImage(clientX: number, clientY: number) {
    const el = imgRef.current;
    if (!el) return;
    el.style.position = "fixed";
    el.style.width = "80px";
    el.style.height = "80px";
    el.style.left = `${clientX - 40}px`;
    el.style.top = `${clientY - 40}px`;
    el.style.pointerEvents = "none";
    el.style.zIndex = "10";
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!piece) return;
    moveImage(e.clientX, e.clientY);
  }

  function handleMouseUp(e: React.MouseEvent<HTMLDivElement>) {
    if (!piece) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const toX = Math.floor((e.clientX - rect.left) / 100);
    const toY = Math.floor((e.clientY - rect.top) / 100);
    const inside = toX >= 0 && toX < 8 && toY >= 0 && toY < 8;

    if (imgRef.current) imgRef.current.removeAttribute("style");
    imgRef.current = null;

    if (inside) {
      setBoard((prev) => {
        const next = prev.map((row) => [...row]);
        next[piece.y][piece.x] = null;
        next[toY][toX] = { ...piece, x: toX, y: toY };
        return next;
      });
    }

    setPiece(null);
  }

  return (
    <div
      className="chess-grid"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {board.map((row, y) =>
        row.map((tile, x) => {
          const isLight = (x + y) % 2 === 0;
          return (
            <div
              style={{ backgroundColor: isLight ? "#e3c9a6" : "#75a94e" }}
              className="chess-tile"
              key={`${x}-${y}`}
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
                  onMouseDown={(e) => handleMouseDown(e, tile)}
                />
              )}
            </div>
          );
        }),
      )}
    </div>
  );
}
