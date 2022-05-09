const bcrypt = require('bcryptjs');
async function func(password){
    const saltRounds = 10;

    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    console.log(hash);
}

func('password')