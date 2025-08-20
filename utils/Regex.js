const textRegex = (text) =>{
    const pattern = /^[A-Za-z ]{2,50}$/
    return pattern.test(text)
}

const EmailRegex = (text) =>{
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    return pattern.test(text)
}

const passwordRegex = (text) =>{
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/
    return pattern.test(text)
}


const dateRegex = (date) =>{
    const Regex = /^\d{4}-\d{2}-\d{2}$/
    return Regex.test(date)
}
 

const timeRegex = (time) =>{
    const Regex = /^([01]\d|2[0-3]):([0-5]\d)$/
  return Regex.test(time)
}

module.exports = {
    textRegex,EmailRegex,passwordRegex,dateRegex,timeRegex
};
