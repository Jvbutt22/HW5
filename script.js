let score = 0;
let currentTiles = [];

$(function () {
  function drawTiles() {
    currentTiles = [];
    $("#rack").empty();
    const letters = Object.keys(ScrabbleTiles);
    for (let i = 0; i < 7; i++) {
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
      start: function () { $(this).hide(); },
      stop: function () { $(this).show(); }
    });
  }

  function setupBoard() {
    $("#board").empty();
    for (let i = 0; i < 7; i++) {
      const square = $("<div>").addClass("square").data("bonus", null);
      if (i === 1) square.addClass("double-letter").data("bonus", "DL");
      if (i === 3) square.addClass("triple-word").data("bonus", "TW");
      if (i === 5) square.addClass("double-word").data("bonus", "DW");
      $("#board").append(square);
    }

    $(".square").droppable({
      accept: ".tile",
      drop: function (event, ui) {
        const letter = ui.draggable.data("letter");
        const bonus = $(this).data("bonus");
        const value = ScrabbleTiles[letter].value;
        let addedScore = value;

        if (bonus === "DL") addedScore *= 2;
        else if (bonus === "TW") addedScore *= 3;
        else if (bonus === "DW") score *= 2;

        score += addedScore;
        $("#score").text("Score: " + score);

        $(this).text(letter).addClass("filled");
        ui.draggable.remove();
        $(this).droppable("disable");
      }
    });
  }

  $("#submit-word").click(() => {
    setupBoard();
    drawTiles();
  });

  $("#restart-game").click(() => {
    location.reload();
  });

  setupBoard();
  drawTiles();
});
