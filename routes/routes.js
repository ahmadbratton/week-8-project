const express = require('express');
const router  = express.Router();
const models = require('../models');
const crypto = require('crypto');

let message;
let name;
let createError = "Error cannot create message";
let userId;
let userSnippets;
let userlang = [];
let snippets = [];
let userLangSnippets;
let snippetId;
let usertags = [];
let the_tags;
let onesnippet = [];

var config = {
    salt: function(length){
    return crypto.randomBytes(Math.ceil(32 * 3 / 4)).toString('base64').slice(0, length);
    },
    iterations: 20000,
    keylen: 512,
    digest: 'sha512'
};

function hashPassword(passwordinput){
    var salt = config.salt(32);
    var iterations = config.iterations;
    var hash = crypto.pbkdf2Sync(passwordinput, salt, iterations, config.keylen, config.digest);
    var hashedPassword = hash.toString('base64');

    console.log('Hashed password: ', hashedPassword);
    console.log('Salt: ', salt );

    return { salt: salt, hash: hashedPassword};
}

  // let passwordData = hashPassword("bratton");
  // passwordData.attempt = "bratton";

function isPasswordCorrect(passwordAttempt) {
    var attempt = passwordAttempt.attempt;
    var savedHash = passwordAttempt.hash;
    var savedSalt = passwordAttempt.salt;

    var hash = crypto.pbkdf2Sync(attempt, savedSalt, config.iterations, config.keylen, config.digest);

    var hashedPassword = hash.toString('base64');
    return savedHash === hashedPassword;
}

let yourSnippets = function (req, res , next) {
  snippets = []
  models.snippets.findAll({
    where:{
      userid:userId
    },
    include: [{
      model:models.users,
      as:"users"
    },
    {
    model:models.tags,
    as:"tags"
  }],
  order:[
    ["createdAt", "DESC"]
  ]
  }).then(function (userSnippet) {
    // console.log("THIS IS THE ENTIER SNIPPET OBJECT", userSnippet);
    userSnippet.forEach(function (snippet) {
      // console.log("THIS IS THE DATA VALUES",snippet.dataValues);
      // console.log("THIS IS THE tags",snippet.tags);

      userSnippets = {
        id:snippet.id,
        body: snippet.body,
        notes: snippet.notes,
        language: snippet.language,
        userid:snippet.userid,
        stars: snippet.stars,
        user: snippet.users.dataValues.username,
        tags:snippet.tags
      }
      snippets.push(userSnippets);
    })
    next();
  });
}

let yourLangSnippets = function (req, res , next) {
  userlang = [];
  models.snippets.findAll({
    where:{
      userid:userId,
      language: req.query.language
    }
  }).then(function (langSnippets) {

    console.log("these are the language joints",langSnippets);
    langSnippets.forEach(function (snippet) {
      userLangSnippets = {
        id:snippet.id,
        body: snippet.body,
        notes: snippet.notes,
        language: snippet.language,
        userid:snippet.userid,
        stars: snippet.stars,
        // user: snippet.users.dataValues.username,
        tags:snippet.tags
      }
      userlang.push(userLangSnippets)
    })
    next();
});
}

let yourtags = function (req, res, next) {
  usertags = [];
  models.tags.findAll({
    where:{
      userid:userId,
      tag:req.query.tag
    },
    include: [{
      model:models.users,
      as:"users"
    },
    {
    model:models.snippets,
    as:"snippets"
  }],
  order:[
    ["createdAt", "DESC"]
  ]
}).then(function (yourtags) {
    yourtags.forEach(function (tag) {


      usertags.push(tag.snippets.dataValues);
    })
    next();
  });
}

let thisSnip = function (req, res, next) {
  onesnippet = []
  models.snippets.findAll({
    where:{
      id:req.params.id
    },
    include: [{
      model:models.users,
      as:"users"
    },
    {
    model:models.tags,
    as:"tags"
  }],
  order:[
    ["createdAt", "DESC"]
  ]
  }).then(function (userSnippet) {
    // console.log("THIS IS THE ENTIER SNIPPET OBJECT", userSnippet);
    userSnippet.forEach(function (snippet) {
      // console.log("THIS IS THE DATA VALUES",snippet.dataValues);
      // console.log("THIS IS THE tags",snippet.tags);

      userSnippets = {
        id:snippet.id,
        body: snippet.body,
        notes: snippet.notes,
        language: snippet.language,
        userid:snippet.userid,
        stars: snippet.stars,
        user: snippet.users.dataValues.username,
        tags:snippet.tags
      }
      onesnippet.push(userSnippets);
    })
    next();
  });
}


// isPasswordCorrect(passwordData);
router.get("/",  function(req, res) {
  if (name) {
    res.redirect("/api/home")
  }else {
    res.redirect("/api/login")
  }

});


router.get("/api/home", yourSnippets,  function(req, res) {

  if (name) {
    res.render('index', {user: name , snippets:snippets});
  }else{
    res.redirect("/api/login")
  }

});

router.get("/api/login", function (req, res) {
  if (req.session.username) {
    res.redirect("/api/home");
  } else {
    res.render("login");
  }

})

router.get("/api/signup", function (req,res) {
  res.render("signup");
})

router.get("/api/create", function (req, res) {
  if (name) {
    res.render("create")
  }else {
    res.redirect("/api/login")
  }

})

router.get("/api/language", yourLangSnippets, function (req, res) {
  if (name) {
    // console.log("THIS IS USER LANG:", userlang);
    res.render("userlanguage" , {user: name, userlang: userlang});
  }else {
    res.redirect("/api/login");
  }

})

router.get("/api/usertags", yourtags , function (req, res) {
  if (name) {
    res.render("usertags" , {user: name, usertag: usertags} );
  }else {
    res.redirect("/api/login");
  }

})

router.get("/api/view/snippet/:id", thisSnip,  function (req, res) {
  if (name) {
    res.render("view_snip" , {user: name, snippet: onesnippet} );
  }else {
    res.redirect("/api/login");
  }

})






router.post("/api/signup", function (req, res) {
  let passwordData = hashPassword(req.body.newpassword);
  let newuser = {
    username: req.body.newusername,
    password: passwordData.hash,
    salt: passwordData.salt
  }
  models.users.create(newuser).then(function (user) {
    console.log(user);
    if (user) {
      res.redirect("/api/login")
    }

  })


})



router.post("/api/login", function (req, res) {
  messages = [];

  req.checkBody("username", "please enter a valid username").notEmpty();
  req.checkBody("password", "please enter a valid password").notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    errors.forEach(function(error) {
      messages.push(error.msg);
      res.redirect()
    });
    res.render("login", {
      errors: messages
    })
  } else {
    models.users.findOne({
      where: {
        username: req.body.username,
      }
    }).then(function(user) {
      let passwordObj = {attempt:req.body.password, salt:user.salt, hash:user.password}
      if (user) {

        if (isPasswordCorrect(passwordObj)) {


        userId = user.id;
        req.session.username = user.username;
        name = user.username;
        res.redirect("/api/home");
      }
    }else {
        messages.push("invalid username or password");
        // console.log(messages);
        res.redirect("/login");
      }


})
}
})

router.post("/api/create", function (req,res) {
  console.log("THIS IS THE user ID:",userId);
  let newsnippet = {
    title: req.body.title,
    body: req.body.body,
    notes: req.body.notes,
    language:req.body.language,
    userid:userId
  }

  models.snippets.create(newsnippet).then(function (snippet) {
    snippetId = snippet.id;
    if (snippet) {
      res.redirect("/api/home")
    }else{
      res.redirect("/api/create")
    }
  })

})

router.post("/api/signout", function (req, res) {
  req.session.destroy();
  res.redirect("/api/login");
})

router.post("/api/create/tag/:id", function (req, res) {
  let newTag = {
    userid:userId,
    tag: req.body.tag,
    snippetid:req.params.id
  }
  models.tags.create(newTag).then(function (tag) {
    if (tag) {
      res.redirect("/api/home")
    }else {
      res.redirect("/api/create")
    }
  })
})



module.exports = router;
