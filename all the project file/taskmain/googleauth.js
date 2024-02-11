
const passport=require("passport")
const {UserModel}=require("./model/user.model");
require("dotenv").config()
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
passport.serializeUser((user, done) => {
	// console.log(user);
	done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
	const user = await UserModel.findOne({ email: email });
	done(null, user);
});
passport.use(
	new GoogleStrategy(
		{
			clientID:"72168597279-mvvnbov8pv94s7o5j66npp9frt6j231r.apps.googleusercontent.com",
			clientSecret: "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",
			callbackURL: "http://localhost:1111/auth/google/callback",
			passReqToCallback: true,
		},
		

		async (request, accessToken, refreshToken, profile, done) => {
		
			done(null, profile);

			const cUser = await UserModel.findOne({ email: profile.email });
			// console.log("current user :", cUser);
			if (!cUser) {
				const newUser = {
					email: profile.email,
					name: `${profile.name.givenName} ${profile.name.familyName}`,
					password: profile.id,
				};

			

				const data = await UserModel.create(newUser);
				// console.log("New user created:", newUser);
				request.body = newUser;
				return done(null, newUser);
			} else {
				request.body = cUser;
			}
		}
	)
);

const googleAuthentication = async (req, res) => {

 

  const user = req.user



  const frontendURL = "http://127.0.0.1:5501/frontend/index.html"

  res.send(`
              <a href="${frontendURL}?userID=${user._id}" id="myid" style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #222222; margin: 0; padding: 0; overflow: scroll;">
                  <img style="width:100%;" src="https://cdn.dribbble.com/users/1787505/screenshots/7300251/media/a351d9e0236c03a539181b95faced9e0.gif" alt="https://i.pinimg.com/originals/c7/e1/b7/c7e1b7b5753737039e1bdbda578132b8.gif">
              </a>
              <script>
                  let a = document.getElementById('myid')
                  setTimeout(()=>{
                      a.click()
                  },2000)
                  console.log(a)
              </script>
      `)

}


  module.exports={passport,googleAuthentication}