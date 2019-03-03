// Referenced Week 18, Activity 20

// Whenever someone clicks a h3 tag
$(document).on("click", "h3", function () {

  $(document).ready(function () {
    $('.modal').modal();
    $('.modal').modal('open');
  });

  // var instance = M.Modal.getInstance(elem);
  // instance.open(elem);

  //alert("hi");
  // Empty the modal-content from the note section
  $("#modal-content").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#modal-content").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#modal-content").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#modal-content").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#modal-content").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the modal-content section
      $("#modal-content").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});



// When you click the delete article button
$(document).on("click", "#deletebtn", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId

  })
    // With that done
    .then(function (data) {
      location.reload();


    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});



//  Clear all articles
$(document).on("click", "#delete-articles", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      location.reload();
    });
});

// On click to save article

$(document).on('click', '#saveArticle', function () {
  var thisId = $(this).attr('data-id');
  $.ajax({
    // method: "GET",
    url: '/save/' + thisId,
    type: 'GET',
    success: function (response) {
      window.location.href = '/';
    },
  });
});

// On click to clear all articles
$(document).on('click', '#allClear', function () {
  $.ajax({
    // method: "GET",
    url: '/articles',
    type: 'DELETE',
    success: function (response) {
      window.location.href = '/';
    },
  });
});


