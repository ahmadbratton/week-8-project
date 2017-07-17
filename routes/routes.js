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
let the_users_snips = [];
let allSnippets = [];
let allLang = [];
let allTags = [];
let username;
let alltagsnips;
let tagArray = [];


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
      language: req.query.language.toLowerCase()
    }
  }).then(function (langSnippets) {

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
      tag:req.query.tag.toLowerCase()
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
  tagArray = [];
  onesnippet = [];
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
      snippet.tags.forEach(function (tags) {
        console.log("TAGS DATA VALUES",tags.dataValues);
        tagArray.push(tags.dataValues.tag);
      });

    })
    next();

    })



}


let viewUserSnips = function (req, res, next) {
  the_users_snips = []
  models.snippets.findAll({
    where:{
      userid:req.params.id
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
      the_users_snips.push(userSnippets);
    })
    next();
  });
}


let viewAllSnips = function (req, res, next) {
  allSnippets = []
  models.snippets.findAll({
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

    userSnippet.forEach(function (snippet) {


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
      allSnippets.push(userSnippets);
    })
    next();
  });
}


let viewAllLang = function (req, res, next) {
  allLang = [];
  models.snippets.findAll({
    where:{
      language: req.query.allLanguage.toLowerCase()
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
  }).then(function (langSnippets) {
    langSnippets.forEach(function (snippet) {
      userLangSnippets = {
        id:snippet.id,
        body: snippet.body,
        notes: snippet.notes,
        language: snippet.language,
        userid:snippet.userid,
        stars: snippet.stars,
        user: snippet.users.dataValues.username,
        tags:snippet.tags
      }
      allLang.push(userLangSnippets)
    })
    next();
});
}

let viewAllTags = function (req, res, next) {
  allTags = [];
  models.tags.findAll({
    where:{
      tag:req.query.tag.toLowerCase()
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
      allTags.push(tag.snippets.dataValues);
    })
    next();
  });
}

let favs = function (req, res, next) {
  models.snippets.findOne({where:{id:req.params.id}}).then(function (snippet) {
    snippet.increment("stars", {by:1}).then(function (star) {
      console.log(star);
  })
next();
})
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
    res.render('index', {user: name , userId,  snippets:snippets});
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
    res.render("userlanguage" , {user: name , userId, userlang: userlang});
  }else {
    res.redirect("/api/login");
  }

})

router.get("/api/usertags", yourtags , function (req, res) {
  if (name) {
    res.render("usertags" , {user: name, userId, usertag: usertags} );
  }else {
    res.redirect("/api/login");
  }

})

router.get("/api/view/snippet/:id", thisSnip,  function (req, res) {
  if (name) {
    res.render("view_snip" , {user: name, userId, snippet: onesnippet , tagArray} );
  }else {
    res.redirect("/api/login");
  }

})

router.get("/api/view/user/snippets/:id", viewUserSnips ,  function (req, res) {
  if (name) {
    res.render("view_users_snippets" , {user: name, userId, snippets: the_users_snips} );
  }else {
    res.redirect("/api/login");
  }

})


router.get("/api/view/all/snippets", viewAllSnips ,  function (req, res) {
  if (name) {
    res.render("view_all_snippets" , {user: name, userId, snippets: allSnippets} );
  }else {
    res.redirect("/api/login");
  }

})

router.get("/api/view/all/language", viewAllLang ,  function (req, res) {
  if (name) {
    res.render("view_all_lang" , {user: name, userId, snippets: allLang} );
  }else {
    res.redirect("/api/login");
  }

})

router.get("/api/view/all/tags", viewAllTags ,  function (req, res) {
  if (name) {
    // console.log("this is the tags snippets", allTags);
    res.render("view_all_tag" , {user: name, userId, snippets: allTags} );
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
      res.redirect("/api/login");
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


router.post("/api/star/:id", favs, function (req, res) {
res.redirect("/api/home")
})



module.exports = router;
