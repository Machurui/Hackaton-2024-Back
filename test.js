const bcrypt = require("bcryptjs");

const password = "admin";

async function test(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  bcrypt.compare(password, hashedPassword, (err, isMatch) => {
    if (err) throw err;
    if (isMatch) {
      console.log("ok");
      console.log(hashedPassword)
    } else {
        console.log("nok");
    }
  });
}

test(password);
