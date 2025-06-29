/* 
  File: script.js
  GUI Assignment: HW5 – Scrabble Game with Drag-and-Drop
  Joseph Vandan Butti, UMass Lowell Computer Science, jbutti@cs.uml.edu
  Copyright (c) 2025 by Joseph Vandan Butti. All rights reserved. May be freely copied or
  excerpted for educational purposes with credit to the author.
  Created on May 28, 2025
  Description: This JavaScript file implements the logic for a browser-based Scrabble game.
  It handles tile generation, drag-and-drop interaction, bonus scoring, and word submission.
*/

let score = 0;
let currentTiles = [];

function drawTiles() {
  const letters = Object.keys(ScrabbleTiles);
  const tilesToDraw = 7 - $("#rack .tile").length;
  for (let i = 0; i < tilesToDraw; i++) {
    let letter;
    do {
      letter = letters[Math.floor(Math.random() * letters.length)];
    } while (ScrabbleTiles[letter].remaining <= 0);

    ScrabbleTiles[letter].remaining--;
    const tile = $("<div>").addClass("tile").text(letter).data("letter", letter);
    $("#rack").append(tile);
    currentTiles.push(tile);
  }
  makeDraggable();
}

function makeDraggable() {
  $(".tile").draggable({
    revert: "invalid",
    helper: "clone",
    start: function () {
      $(this).data("original", $(this));
      $(this).hide();
    },
    stop: function () {
      $(this).show();
    }
  });
}

function setupBoard() {
  $("#board").empty();
  for (let row = 0; row < 15; row++) {
    const rowDiv = $("<div>").addClass("board-row");
    for (let col = 0; col < 15; col++) {
      const square = $("<div>").addClass("square").data("bonus", null);

      if ((row === col) && (row % 7 === 0)) {
        square.addClass("triple-word").data("bonus", "TW");
      } else if ((row === 7 || col === 7) && (row + col) % 4 === 0) {
        square.addClass("double-word").data("bonus", "DW");
      } else if ((row + col) % 5 === 0) {
        square.addClass("double-letter").data("bonus", "DL");
      } else if ((row + col) % 8 === 0) {
        square.addClass("triple-letter").data("bonus", "TL");
      }

      rowDiv.append(square);
    }
    $("#board").append(rowDiv);
  }

  $(".square").droppable({
    accept: ".tile",
    drop: function (event, ui) {
      const letter = ui.draggable.data("letter");
      $(this).text(letter).addClass("filled").data("letter", letter);

      const original = ui.draggable.data("original");
      if (original) original.remove();
      else ui.draggable.remove();

      $(this).droppable("disable");
    }
  });
}

$("#submit-word").click(() => {
  let word = "";
  let wordScore = 0;
  let wordMultiplier = 1;

  $(".square").each(function () {
    const letter = $(this).data("letter");
    if (letter) {
      word += letter;
      let tileValue = ScrabbleTiles[letter].value;
      const bonus = $(this).data("bonus");

      if (bonus === "DL") tileValue *= 2;
      else if (bonus === "TL") tileValue *= 3;
      else if (bonus === "DW") wordMultiplier *= 2;
      else if (bonus === "TW") wordMultiplier *= 3;

      wordScore += tileValue;
    }
  });

  if (word.length > 0) {
    score += wordScore * wordMultiplier;
    $("#score").text("Score: " + score);
    drawTiles();
    alert("Word submitted: " + word);
  } else {
    alert("No word submitted. Try again.");
  }
});

$("#restart-game").click(() => {
  location.reload();
});

$(document).ready(function () {
  setupBoard();
  drawTiles();
});
