const router=require("express").Router();
const User= require("../model/User");
const bcrypt=require("bcryptjs");

//REGISTER
router.post("/register", async(req,res)=>{
    try{
        const { username, email, password}=req.body;

        //hash password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=new User({
            username, email, password: hashedPassword
        });

        const user =await newUser.save();
        res.status(201).json(user);

    }
    catch(err){
        res.status(500).json(err);
    }
});

const jwt = require("jsonwebtoken");

//login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User not found");

    // compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json("Wrong password");

    // create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    // remove password from response
    const { password: pwd, ...others } = user._doc;

    res.status(200).json({ ...others, token });

  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports=router;