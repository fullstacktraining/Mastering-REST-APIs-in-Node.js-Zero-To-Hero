const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const user = require('./user');

const port = 8080;
app.set('port', port);
app.set('view engine', 'pug');
app.set('views', `${__dirname}/view`);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  key: 'user_sid',
  secret: 's3cr3t',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
    res.clearCookie('jwt');
  }
  next();
});

const checkSession = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/profile');
  } else {
    next();
  }
};

app.get('/', (req, res) => res.render('index', {
  user: req.session.user ? req.session.user : null,
  intro: 'Welcome to ACME Inc., please login to view our employees. If you do not have an account, please register for one.'
}));

app.route('/register')
.get(checkSession, (req, res) => {
  res.render('register');
})
.post((req, res) => {
  user.insertUser(req.body.username, req.body.password)
  .then(user => {
    if (user) {
      req.session.user = user[0];
      return res.redirect('/profile');
    } else {
      return res.render('register', {
        error: 'User already registered.'
      });
    }
  }).catch(error => {
    console.log(error);
    return res.redirect('/register');
  });
});

app.route('/login')
.get(checkSession, (req, res) => {
  res.render('login')
})
.post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  user.checkUser(username, password)
  .then(response => {
    if (response) {
      req.session.user = response;
      const token = user.createToken(response.username);
      res.cookie('jwt', token);
      return res.redirect('/profile');
    } else {
      return res.render('login', {
        error: 'Incorrect login details. Maybe try to <a href="/register">Register</a>.'
      });
    }
  })
  .catch(error => {
    console.log(error);
    return res.redirect('/register');
  });
});

app.get('/profile', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
      res.render('profile', {
        user: req.session.user ? req.session.user : null
      });
  } else {
      res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    res.clearCookie('jwt');
    res.redirect('/');
  } else {
    res.redirect('/');
  }
});


app.use((req, res, next) => {
  res.set('Content-Type', 'text/plain');
  // courtesy of https://www.asciiart.eu/movies/star-wars
  res.status(404).send(`

  404 - This is not the page you are looking for
                    ____
                 _.' :  \`._
             .-.'\`.  ;   .'\`.-.
    __      / : ___\ ;  /___ ; \      __
  ,'_ ""--.:__;".-.";: :".-.":__;.--"" _\`,
  :' \`.t""--.. '<@.\`;_  ',@>\` ..--""j.' \`;
       \`:-.._J '-.-'L__ \`-- ' L_..-;'
         "-.__ ;  .-"  "-.  : __.-"
             L ' /.------.\ ' J
              "-.   "--"   .-"
             __.l"-:_JL_;-";.__
          .-j/'.;  ;""""  / .'\"-.
        .' /:\`. "-.:     .-" .';  \`.
     .-"  / ;  "-. "-..-" .-"  :    "-.
  .+"-.  : :      "-.__.-"      ;-._   \
  ; \  \`.; ;                    : : "+. ;
  :  ;   ; ;                    : ;  : \:
 : \`."-; ;  ;                  :  ;   ,/;
  ;    -: ;  :                ;  : .-"'  :
  :\     \  : ;             : \.-"      :
   ;\`.    \  ; :            ;.'_..--  / ;
   :  "-.  "-:  ;          :/."      .'  :
     \       .-\`.\        /t-""  ":-+.   :
      \`.  .-"    \`l    __/ /\`. :  ; ; \  ;
        \   .-" .-"-.-"  .' .'j \  /   ;/
         \ / .-"   /.     .'.' ;_:'    ;
          :-""-.\`./-.'     /    \`.___.'
                \ \`t  ._  / 
                 "-.t-._:'

  `)
});

app.listen(app.get('port'), () => console.log(`Server running on ${app.get('port')}`));