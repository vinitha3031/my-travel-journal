import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "./mongoose/UserSchema.js";
import bcrypt from 'bcrypt';

passport.use(new Strategy(
  {
    usernameField: "email"
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        return done(null, false);
      }

      const match = await bcrypt.compare(password, user.password)

      if(!match) {
        return done(null, false);
      }

      return done(null, user);
    }
     catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user,done)=>{
    done(null,user._id)
})

passport.deserializeUser(async(_id,done)=>{
    try{
        const user=await User.findOne({_id})
        done(null,user)
    }
    catch(err){
        done(err)
    }
   
})


