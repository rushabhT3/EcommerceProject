const bcrypt = require("bcrypt");
const User = require("../models/user");
const saltRounds = 10;

function generateVerificationCode() {
  return Math.floor(10000000 + Math.random() * 90000000);
}

const sendEmail = async (email, verificationCode) => {
  try {
    const options = {
      method: "POST",
      url: "https://api.sendinblue.com/v3/smtp/email",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      data: {
        sender: { name: "John Doe Robot", email: "ecommerce@turnover.com" },
        to: [{ email }],
        subject: "Verification Code",
        htmlContent: `Your verification code is: <strong style="font-size: 1.5em;">${verificationCode}</strong>. Please copy this code and paste it into the verification form.`,
      },
    };

    const response = await sib.request(options);
    console.log(`Email sent: ${response.data.messageId}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate a verification code
    const verificationCode = generateVerificationCode();

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationCode,
    });

    // Send the verification code to the user's email
    await sendEmail(newUser.email, verificationCode);

    res
      .status(201)
      .send(
        `Signup successful for ${newUser.name} with email ${newUser.email}!`
      );
  } catch (err) {
    res.status(500).send("An error occurred during signup.");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send("Invalid email or password.");
    }

    // Check the password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).send("Invalid email or password.");
    }

    // Generate a JWT
    const token = jwt.sign({ id: user.id }, "jwt_secret_key", {
      expiresIn: "1h",
    });

    res.send({ message: "Login successful!", token });
  } catch (err) {
    res.status(500).send("An error occurred during login.");
  }
};

const verify = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send("Invalid email or code.");
    }

    // Check the code
    if (user.verificationCode !== parseInt(code)) {
      return res.status(401).send("Invalid email or code.");
    }

    // If the code is correct, mark the user as verified
    user.verified = true;
    await user.save();

    res.send("Verification successful!");
  } catch (err) {
    res.status(500).send("An error occurred during verification.");
  }
};

module.exports = { signup, login, verify };
