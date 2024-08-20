$(document).ready(function () {
  // URL for fetching random dog images
  $("#myModal").fadeIn();
  const dogApiUrl = "https://dog.ceo/api/breeds/image/random";

  // Fetch a new dog image when the button is clicked
  $("#fetch-dog").click(function () {
    $.getJSON(dogApiUrl, function (data) {
      // Update the dog image with the new URL
      $("#dog-image").attr("src", data.message).fadeIn().css("opacity", 1);

      // Show the modal
    });
  });

  // Close the modal when the close button is clicked
  $(".close").click(function () {
    $("#myModal").fadeOut();
  });

  // Close the modal when clicking outside of the modal content
  $(window).click(function (event) {
    if ($(event.target).is("#myModal")) {
      $("#myModal").fadeOut();
    }
  });
});
