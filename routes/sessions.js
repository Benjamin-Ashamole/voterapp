const express = require('express');
const router = express.Router();
const Session = require('../models/session');
const Contestant = require('../models/contestant');
const contestants = require('./contestants');
const crypto = require('crypto');


/* GET users listing. */
//Session new
router.get('/new', function(req, res, next) {
  res.render('sessions/new');
});

//Session show / contestant show
router.get('/:id', (req, res, next) => {
  Session.findById(req.params.id, (err, session) => {
    if (err) {
      console.log(err)
    };
    let sessionContestants = session.contestants
    Contestant.find({ _id: sessionContestants }, (err, contestants) => {

      if (err) {
        console.log(err)
      };
      res.render('sessions/show', { session: session, contestants: contestants })
    });
  });
});

//handle the hash submission

router.get('/', (req, res, next) => {
  if (req.query.hash) {
    Session.findOne({ hash: req.query.hash}, (err, session) => {
      if (err) {
        console.log(err)
        console.log(session)
      };
      res.render('sessions/index', { session: session });
    });
  };
});

// Create
router.post('/', (req, res, next) => {
  let session = new Session(req.body);
  let hash = crypto.randomBytes(16).toString('hex')

  session.hash = hash;

  session.save(function(err, session) {
    if (err) {
      console.log('>>>>>>',err,'<<<<<<<<<<<<')
    }
    return res.redirect( 'contestants/new' );
  });
});

// router.put('/:id/voted', (req, res) => {
//   const contestant = req.contestant;
//   if (contestant === null) {
//     return;
//   }
//   Contestant.findById(req.params.id).then((contestant) => {
//     user.downVotes.pull(req.session.userId);
//     user.upVotes.addToSet(req.session.userId);
//     user.voteTotal = user.upVotes.length - user.downVotes.length;
//     return user.save(); // FIXME: return promise
//   }).then((user) => {
//     res.status(200).json({ voteScore: user.voteTotal });
//     return location.reload();
//     //res.redirect('/:id/profile', { user });
//   }).catch((err) => {
//     console.log(err);
//   });
// });


router.put('/:id/voted', (req, res) => {
  Session.findOne( { _id: req.body.id } , (err, session) => {
    if (err) { console.log(err)}
    let sessionContestants = session.contestants
    console.log(sessionContestants);
    console.log(req.params.id);
    for (let contestant of sessionContestants) {
      if (contestant._id == req.params.id) {
        contestant.votes = contestant.votes + 1;
      }
    }
    session.save();
    // Contestant.findById(req.params.id, (err, contestant) => {
    //   console.log(contestant);
    //   contestant.votes = contestant.votes + 1;
    // })
  });
});

router.use('/:sessionId/contestants', contestants)


module.exports = router;
