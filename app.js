// same as importing in React
const express = require("express");
const morgan = require("morgan");

// express() comes from importing 'express' above, and creates our application
const app = express();

// syntax is: morgan(format, options) where `format` is a string or function and `options` is an object
app.use(morgan("dev"));

//res = the HTTP request object
// res.send will respond to a GET request with the text "Hello Express!"
// this is called a handler function
app.get("/", (req, res) => {
  // this callback function is executed IFF the path arg ('/') is matched
  res.send("Amy made a web server!");
});

// these functions are also called routes b/c they add a new option to the URL (localhost:8000/burgers)
app.get("/burgers", (req, res) => {
  res.send("We have juicy cheeseburgers!");
});

app.get("/pizza", (req, res) => {
  res.send("What pizza would you like?");
});

app.get("/pizza/pepperoni", (req, res) => {
  res.send("Your pizza is on the way!");
});

app.get("/pizza/pineapple", (req, res) => {
  res.send("We don't serve that here. Never call again!");
});

app.get("/echo", (req, res) => {
  const responseText = `Here are some details of your request:
      Base URL: ${req.baseUrl}
      Host: ${req.hostname}
      Path: ${req.path}
    `;
  res.send(responseText);
});

app.get("/queryViewer", (req, res) => {
  console.log(req.query);
  res.end(); //do not send any data back to the client
});

app.get("/hello", (req, res) => {
  res.status(204).end();
});

app.get("/video", (req, res) => {
  const video = {
    title: "Cats falling over",
    description: "15 minutes of hilarious fun as cats fall over",
    length: "15.40",
  };
  res.json(video);
});

app.get("/colors", (req, res) => {
  const colors = [
    {
      name: "red",
      rgb: "FF0000",
    },
    {
      name: "green",
      rgb: "00FF00",
    },
    {
      name: "blue",
      rgb: "0000FF",
    },
  ];
  res.json(colors);
});

app.get("/grade", (req, res) => {
  // get the mark from the query
  const { mark } = req.query;

  // do some validation
  if (!mark) {
    // mark is required
    return res.status(400).send("Please provide a mark");
  }

  const numericMark = parseFloat(mark);
  if (Number.isNaN(numericMark)) {
    // mark must be a number
    return res.status(400).send("Mark must be a numeric value");
  }

  if (numericMark < 0 || numericMark > 100) {
    // mark must be in range 0 to 100
    return res.status(400).send("Mark must be in range 0 to 100");
  }

  if (numericMark >= 90) {
    return res.send("A");
  }

  if (numericMark >= 80) {
    return res.send("B");
  }

  if (numericMark >= 70) {
    return res.send("C");
  }

  res.send("F");
});
/***********************************************************
 **********************Checkpoint 3 Drills******************
 ************************************************************/

app.get("/sum", (req, res) => {
  const a = req.query.a;
  const b = req.query.b;
  const c = function (a, b) {
    return Number(a) + Number(b);
  };

  if (!a || !b) {
    return res.status(400).send("Please provide 2 numbers");
  }

  const greeting = `The sum of ${a} and ${b} is ${c(a, b)}`;
  res.send(greeting);
});

app.get("/cipher", (req, res) => {
  const text = req.query.text;
  const shift = req.query.shift;

  if (!text) {
    return res.status(400).send("Please include a string of text");
  }

  if (!shift) {
    return res.status(400).send("Please specify a number");
  }
  const normalizedTextArr = text.toUpperCase().split("");

  const shiftedUtf16Codes = normalizedTextArr.map((str) => {
    const letterCode = str.charCodeAt(0);

    if (Number(letterCode) === 32) {
      return 32;
    } else if (Number(letterCode) + Number(shift) > 90) {
      let trickyCode = Number(letterCode) - (26 - Number(shift));
      return trickyCode;
    } else {
      return Number(letterCode) + Number(shift);
    }
  });

  const shiftedTextArr = shiftedUtf16Codes.map((codeStr) => {
    return String.fromCharCode(Number(codeStr));
  });
  const shiftedStr = shiftedTextArr.join("");
  const result = `Here is your encrypted text: ${shiftedStr}`;
  res.send(result);
});

app.get("/lotto", (req, res) => {
  const lottoArr = req.query.arr;

  // validation:

  // test that the lottoArr array exists
  if (!lottoArr) {
    return res.status(400).send("numbers are required");
  }

  // test that lottoArr is an array
  if (!Array.isArray(lottoArr)) {
    return res.status(400).send("numbers must be in an array");
  }

  // test that lottoArr is 6 numbers long and all numbers are between 1 and 20
  const guesses = lottoArr
    .map((n) => parseInt(n))
    .filter((n) => !Number.isNaN(n) && n >= 1 && n <= 20);

  if (guesses.length != 6) {
    return res
      .status(400)
      .send("numbers must contain 6 integers between 1 and 20");
  }

  // after validating lottoArr:

  // here are the 20 numbers to choose from
  const stockNumbers = Array(20)
    .fill(1)
    .map((_, i) => i + 1);

  //randomly choose 6
  const winningNumbers = [];

  for (let i = 0; i < 6; i++) {
    const randomNum = Math.floor(Math.random() * stockNumbers.length);
    winningNumbers.push(stockNumbers[randomNum]);
    stockNumbers.splice(randomNum, 1);
  }

  //compare the guesses to the winning number (guesses in an array from the results
  // of the validation of lottoArr)
  let diff = winningNumbers.filter((n) => !guesses.includes(n));

  // construct a response
  let responseText;

  switch (diff.length) {
    case 0:
      responseText = "Wow! Unbelievable! You could have won the mega millions!";
      break;
    case 1:
      responseText = "Congratulations! You win $100!";
      break;
    case 2:
      responseText = "Congratulations, you win a free ticket!";
      break;
    default:
      responseText = "Sorry, you lose";
  }

  // uncomment below to see how the results ran

  // res.json({
  //   guesses,
  //   winningNumbers,
  //   diff,
  //   responseText
  // });

  res.send(responseText);
});

/***********************************************************
 *****************************END****************************
 ************************************************************/

app.listen(8000, () => {
  console.log("Express server is listening on port 8000!");
});

