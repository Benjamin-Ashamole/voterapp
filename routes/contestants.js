const express = require('express');
const router = express.Router();
const Contestant = require('../models/contestant');
const Session = require('../models/session');

router.get('/new', (req, res, next) => {
    res.render('contestants/new');
  });




  router.post('/', function(req, res, next) {
    Session.findOne({ hash: "f8c3573884ead99590d2d2e082b4dabb"  }, (err, session)  => {
        let contestant = new Contestant(req.body);
        session.contestants.push(contestant)
        let newContestant = session.contestants[session.contestants.length-1]
        newContestant.votes = 0;
        contestant.session = session;

        contestant.save(function(err, contestant) {
            if (err)
            { console.log(err) }
        });
        session.save(function(err, session) {
          if (err) {
            console.log(err)
          };
        });
    });
    return res.redirect('contestants/people');
  });

  router.get('/people', function(req, res, next) {
      Session.findOne({ hash: "f8c3573884ead99590d2d2e082b4dabb" }, (err, session) => {

        if (err) { console.log(err)}

          let sessionContestants = session.contestants;
          Contestant.find({_id: sessionContestants }, (err, contestants) => {

            if (err) {
              console.log(err)
            };
            res.render('contestants/people', { contestants: contestants })
          });
      });
  });

  module.exports = router;
