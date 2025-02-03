const express = require('express')
const mysql = require('mysql')
const bcrypt = require('bcryptjs');
var cors = require('cors')
const app = express()
const port = 3000
app.use(express.json())
app.use(cors())

var connection;
function kapcsolat() {
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dartsmobil'
  })
  connection.connect()
}



app.get('/', (req, res) => {
  res.send('Hello World!')
})

//-----------------------------------------------------játékos lekérdezése
app.get('/jatekoslekerdez', (req, res) => {
  kapcsolat()
  connection.query('SELECT * from jatekos', (err, rows, fields) => {
    if (err) throw err

    console.log(rows)
    res.send(rows)
  })
  connection.end()
})
//-----------------------------------------------------játékos lekérdezése
app.post('/meccseredmenylekerdez', (req, res) => {
  kapcsolat()
  connection.query('SELECT * from meccseredmeny INNER JOIN meccs ON meccseredmeny_meccsid = meccs_id WHERE meccs_elsojatekos = ? ORDER BY meccs_id ASC',[req.body.bevitel1], (err, rows, fields) => {
    if (err) throw err

    console.log(rows)
    res.send(rows)
  })
  connection.end()
})

//-----------------------------------------------------MECCSENKÉNT LEKÉRDEZÉS
app.get('/elsomeccslekerdez', (req, res) => {
  kapcsolat()
  connection.query('SELECT * from meccseredmeny ', (err, rows, fields) => {
    if (err) throw err

    console.log(rows)
    res.send(rows)
  })
  connection.end()
})

// ------------------- Regisztráció
app.post('/regisztracio', (req, res) => {
  const { bevitel1, bevitel2 } = req.body;

  // Check if username already exists
  kapcsolat();
  connection.query(
    'SELECT felhasznalo_nev FROM felhasznalo WHERE felhasznalo_nev = ?',
    [bevitel1],
    (err, rows, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send('Hiba');
      } else {
        if (rows.length !== 0) {
          res.status(500).send('A felhasználónév már létezik!');
        } else {
          // Hash the password before inserting
          bcrypt.hash(bevitel2, 10, (err, hashedPassword) => {
            if (err) {
              console.log(err);
              res.status(500).send('Hiba a jelszó hash-elés során');
            } else {
              // Insert new user with hashed password
              kapcsolat();
              connection.query(
                'INSERT INTO felhasznalo (felhasznalo_nev, felhasznalo_jelszo) VALUES (?, ?)',
                [bevitel1, hashedPassword],
                (err, rows, fields) => {
                  if (err) {
                    console.log(err);
                    res.status(500).send('Hiba');
                  } else {
                    console.log(rows);
                    res.status(200).send('Sikeres regisztráció!');
                  }
                }
              );
            }
          });
        }
      }
    }
  );
  connection.end();
});

// ------------------- Bejelentkezés
app.post('/beleptetes', (req, res) => {
  const { bevitel1, bevitel2 } = req.body;

  kapcsolat();
  connection.query(
    'SELECT felhasznalo_id, felhasznalo_nev, felhasznalo_jelszo FROM felhasznalo WHERE felhasznalo_nev = ?',
    [bevitel1],
    (err, rows, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send([]);
      } else {
        if (rows.length === 0) {
          res.status(400).send('Felhasználó nem található!');
        } else {
          const hashedPassword = rows[0].felhasznalo_jelszo;
          
          // Compare the provided password with the hashed one
          bcrypt.compare(bevitel2, hashedPassword, (err, isMatch) => {
            if (err) {
              console.log(err);
              res.status(500).send('Hiba a jelszó összehasonlítás során');
            } else if (isMatch) {
              res.status(200).send(rows);
            } else {
              res.status(400).send('Hibás jelszó');
            }
          });
        }
      }
    }
  );
  connection.end();
});


app.post('/meccseredmenyFelvitel', (req, res) => {
  kapcsolat()
  connection.query(`
  INSERT INTO meccseredmeny  VALUES (NULL, '2',  ?, '2-1', ?, 'Boti', ?, '43', '34', '23', '32', ?, ?, '1', '10', ?);
    
    `, [req.body.date,req.body.winner,req.body.avgPoints,req.body.highestCheckout,req.body.setsWon,req.body.dartsThrown], (err, rows, fields) => {
    if (err) {
      console.log("Hiba")
      console.log(err)
      res.status(500).send("Hiba")
    }
    else {
      console.log("Sikeres felvitel!")
      res.status(200).send("Sikeres felvitel!")
    }
  })
  connection.end()
})











app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




























































































































































































































































































