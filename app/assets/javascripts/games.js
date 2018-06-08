var currentGame = {};
var showForm = false;

function toggleForm() {
  showForm = !showForm
  $('#game-form').remove()

  if (showForm) {
    $.ajax({
      url: '/game_form',
      method: 'GET'
      data: { id: editingGame }
    }).done( function(html) {
      $('#toggle').after(html);
    });
  }
}

function getGame(id) {
  $.ajax({
    url: '/games/' + id,
    method: 'GET'
  }).done( function(game) {
    if (editingGame) {
      var li = $("[data-id='" + id + "'")
      li parent().prevObject[0].
      $(li).replaceWith(game)
      editingGame = null
    } else {
      $('#games-list').append(game);
    }
  });
}

$(document).ready( function() {
    $(document).on('click', '#delete-game', function() {
        var id = $(this).siblings('.game-item').data().id
        $.ajax({
          url: '/games/' + id,
          method: 'DELETE'
        }).done( function() {
          var row = $("[data-id='" + id + "'")
          row.parent().remove('li');
        });
    });
  
  $(document).on('click', '#edit-game', function() {
        editingGame = $(this).siblings('.game-item').data().id
        toggle();
  });

  $(document).on('submit', '#game-form form', function(e) {
     e.preventDefault();
     var data = $(this).serializeArray();
     var url = '/games';
     var method = 'POST'
     if (editingGame) {
     url = url + '/' + editingGame;
     method = 'PUT'
    }

    $.ajax({
      url: url,
      type: method,
      datatype: 'JSON',
      data: data
    }).done( function(game) {
      toggleForm()
      getGame(game.id)
    }).fail( function(err) {
      alert(err.responseJSON.errors)
    })
  })
  $('#toggle').on('click', function() {
    toggleForm()
  });
  $('.game-item').on('click', function() {
    currentGame.id = this.dataset.id
    currentGame.name = this.dataset.name
    $.ajax({
      url: '/games/' + currentGame.id + '/characters',
      method: 'GET',
      datatype: 'JSON'
    }).done( function(characters) {
      $('#game').text('Characters in ' + currentGame.name)
      var list = $('#characters');
      list.empty();
      characters.forEach( function(char) {
        var li = '<li data-character-id="' + char.id + '">' + char.name + '-' + char.power + '</li>'
        list.append(li)
      })
    })
  })
})