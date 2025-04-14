const express = require('express')
const mysql = require('mysql')
var cors = require('cors')
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express()
const port = 5000
app.use(express.json())
app.use(cors())

app.use(bodyParser.json());

const SECRET_KEY = 'your_secret_key';

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
  connection.query('SELECT * from meccseredmeny INNER JOIN meccs ON meccseredmeny_meccsid = meccs_id WHERE meccs_elsojatekos = ?  ORDER BY meccs_id ASC',[req.body.bevitel1], (err, rows, fields) => {
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
//DIAGRAMHOZ WEBRE
app.get('/diagramLekerdez', (req, res) => {
  kapcsolat()
  connection.query(`SELECT 
  felhasznalo_nev,
  COUNT(felhasznalo.felhasznalo_nev) AS Belepesek,
  id
  from belepesek 
  INNER JOIN felhasznalo 
  ON felhasznalo.felhasznalo_id = belepesek.belepesek_felhasznalo
  GROUP BY felhasznalo.felhasznalo_nev;`, (err, rows, fields) => {
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

const bcrypt = require('bcryptjs');
/*
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

          // Jelszó ellenőrzése
          bcrypt.compare(bevitel2, hashedPassword, (err, isMatch) => {
            if (err) {
              console.log(err);
              res.status(500).send('Hiba a jelszó összehasonlítás során');
            } else if (isMatch) {
              const felhasznalo_id = rows[0].felhasznalo_id;

              // Megnézzük, van-e már belépési rekord
              connection.query(
                'SELECT * FROM belepesek WHERE belepesek_felhasznalo = ?',
                [felhasznalo_id],
                (err, result) => {
                  if (err) {
                    console.log(err);
                    res.status(500).send('Hiba történt a belépés rekord lekérdezésekor');
                  } else {
                    if (result.length > 0) {
                      // Létezik rekord, frissítjük a belépések számát
                      connection.query(
                        'UPDATE belepesek SET belepesek_darabszam = belepesek_darabszam + 1 WHERE belepesek_felhasznalo = ?',
                        [felhasznalo_id],
                        (err, updateResult) => {
                          if (err) {
                            console.log(err);
                            res.status(500).send('Hiba történt a belépés rekord frissítésekor');
                          } else {
                            res.status(200).send('Belépés sikeres, belépések száma növelve');
                          }
                        }
                      );
                    } else {
                      // Nincs még rekord, beszúrunk egy újat
                      connection.query(
                        'INSERT INTO belepesek (belepesek_felhasznalo, belepesek_darabszam) VALUES (?, ?)',
                        [felhasznalo_id, 1],
                        (err, insertResult) => {
                          if (err) {
                            console.log(err);
                            res.status(500).send('Hiba történt a belépés rekord beszúrásakor');
                          } else {
                            res.status(200).send('Belépés sikeres, új rekord létrehozva');
                          }
                        }
                      );
                    }
                  }
                }
              );
            } else {
              res.status(400).send('Hibás jelszó');
            }
          });
        }
      }
    }
  );
  connection.end();
});*/


//BEJELENTKEZÉS BIZTONSÁI MÁSOLAT
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
          
          bcrypt.compare(bevitel2, hashedPassword, (err, isMatch) => {
            if (err) {
              console.log(err);
              res.status(500).send('Hiba a jelszó összehasonlítás során');
            } else if (isMatch) {
              const felhasznalo_id = rows[0].felhasznalo_id;
              const datum = new Date().toISOString().slice(0, 19).replace('T', ' '); // Aktuális dátum formázása

              // FELVITEL a belépések táblába
              kapcsolat()
              connection.query(
                `INSERT INTO belepesek VALUES (NULL,? , ?)`,
                [felhasznalo_id, datum],
                (err, result) => {
                  if (err) {
                    console.log('Hiba a belépések táblába való beszúrás során:', err);
                    res.status(500).send('Hiba a belépési adatok rögzítésekor');
                  } else {
                    res.status(200).send(rows);
                  }
                }
              );
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
  INSERT INTO meccseredmeny  VALUES (NULL, '2',  ?, '2-1', ?, 'Boti', ?, '43', '34', '23', '32', ?, '10', ?, ?);
    
    `, [req.body.date,req.body.winner,req.body.avgPoints,req.body.highestCheckout,req.body.dartsThrown, req.body.id], (err, rows, fields) => {
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



//-------------- WEB Bejelentkezés végpont
app.post('/web/login', (req, res) => {
  const { username, password } = req.body;

  kapcsolat()

  const query = 'SELECT felhasznalo_nev, felhasznalo_jelszo FROM felhasznalo inner join rang on rang_felhasznalo=felhasznalo_id WHERE felhasznalo_nev = ? and rang_ertek=1';
  connection.query(query, [username], (err, rows) => {
    if (err) {
      console.error('Adatbázis hiba:', err);
      res.status(500).json({ message: 'Szerverhiba' });
    } else if (rows.length === 0) {
      res.status(404).json({ message: 'Felhasználó nem található' });
    } else {
      const hashedPassword = rows[0].felhasznalo_jelszo;

      // Jelszó ellenőrzése bcrypt-tel
      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          console.error('Hiba a jelszó ellenőrzésekor:', err);
          res.status(500).json({ message: 'Szerverhiba' });
        } else if (isMatch) {
          const token = jwt.sign({ username: rows[0].felhasznalo_nev }, SECRET_KEY, {
            expiresIn: '1h',
          });
          res.json({ token });
        } else {
          res.status(401).json({ message: 'Hibás jelszó' });
        }
      });
    }
  });

  connection.end();
});

app.post('/update-rank', (req, res) => {
  const { user_id, new_rank } = req.body;

  // Logoljuk, hogy mi érkezik a kérésben
  console.log(`Received - User ID: ${user_id}, New Rank: ${new_rank}`);

  // Ellenőrizzük a bemeneti adatokat
  if (typeof user_id === 'undefined' || ![0, 1].includes(new_rank)) {
    console.error('Hibás bemenet:', req.body);  // Logging the received data
    return res.status(400).json({ error: 'Invalid input' });
  }

  kapcsolat();  // MySQL kapcsolat létrehozása

  // SQL lekérdezés a rang frissítésére
  connection.query(
    'UPDATE rang SET rang_ertek = ?  WHERE rang_felhasznalo = ? ',
    [new_rank, user_id],  // Az új rang és a felhasználó azonosítója
    (err, result) => {
      if (err) {
        console.error('Database error:', err);  // Hibák naplózása
        return res.status(500).json({ error: 'Database error' });
      } else {
        console.log('Rank updated successfully:', result);  // Sikeres frissítés naplózása
        return res.status(200).json({ message: 'Rank updated successfully' });
      }
    }
  );

  connection.end();  // Kapcsolat lezárása
});







app.get('/felhasznalok-rangjai', (req, res) => {
  kapcsolat();
  connection.query(`
  SELECT * FROM felhasznalo LEFT JOIN rang ON rang_felhasznalo = felhasznalo_id
  `, (err, rows) => {
    if (err) {
      console.error('Hiba a lekérdezés során:', err);
      res.status(500).json({ message: 'Szerverhiba' });
    } else {
      res.json(rows);  // Visszaküldjük a felhasználókat és a rangjaikat
    }
  });
  connection.end();
});

app.get('/felhasznalokLekerdez', (req, res) => {
  kapcsolat();
  connection.query(`
  SELECT  felhasznalo_nev FROM felhasznalo 
  `, (err, rows) => {
    if (err) {
      console.error('Hiba a lekérdezés során:', err);
      res.status(500).json({ message: 'Szerverhiba' });
    } else {
      res.json(rows);  
    }
  });
  connection.end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




























































































































































































































































































