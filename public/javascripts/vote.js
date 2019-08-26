$(document).ready(function() {

    $('body').on('submit', '.voted', function(e){
        e.preventDefault();
        console.log("**********");
      });

      $('.contestant-vote').submit(function (e) {
        e.preventDefault();

        let contestantId = $(this).data('id');
        let sessionId = $(this).data('id2');


        // $.get('/path', {a:12, b:23}, function(data){})
        // $.post('/path', {a:12}, function(data){})

        // console.log('sessions/' + contestantId + '/voted')
        // console.log($)
        // console.log($.ajax)
        $.ajax({
          type: 'PUT',
          url:  '/sessions/'+ contestantId + '/voted',
          data: { "id": sessionId },
          success: function(data) {
            console.log("New Vote count:", data);
          },
          error: function(err) {
            console.log(err);
          }
        });
      });

//       $('.user-vote-down').submit(function (e) {
//         e.preventDefault();
//
//         let userId = $(this).data('id'); // data-id
//         // $(this).attr('data-id')
//
//         $.ajax({
//           type: 'PUT',
//           url: userId + '/vote-down',
//           success: function(data) {
//             console.log("voted down!");
//             console.log("New Vote count:", data);
//           },
//           error: function(err) {
//             console.log(err.messsage);
//           }
//         });
//       });
 });
