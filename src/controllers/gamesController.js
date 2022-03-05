import db from '../database.js';

export async function postGames(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  try {

    const result = await db.query(`SELECT id FROM games WHERE name=$1`, [name]);
    if (result.rows.length > 0) {
      return res.status(409).send('Jogo já cadastrado')
    }

    const resultId = await db.query(`SELECT id FROM categories WHERE id=$1`, [categoryId]);
    if (resultId.rows.length === 0) {
      return res.status(400).send('categoria invalida')
    }

    if ((stockTotal && pricePerDay) <= 0) {
      return res.status(400).send('O valor do estoque e preço precisam ser maior que 0')
    }

    await db.query(`
        INSERT INTO 
          games (name, image, "stockTotal", "categoryId", "pricePerDay")
          VALUES ($1, $2, $3, $4, $5)
      `, [name, image, stockTotal, categoryId, pricePerDay]);

    res.sendStatus(201);

  } catch (erro) {
    res.status(500).send(erro);
  }
}


export async function getGames(req, res) {
  const string = req.query.name;
  try {
    if (typeof string === "string") {
      const result = await db.query(`
      SELECT g.*,
      c.name AS "categoryName"
      FROM games g
      JOIN categories c ON c.id=g."categoryId" 
      WHERE g.name LIKE '${string}%'
    `,);
      res.send(result.rows);
    }
    else {
      const result = await db.query(`
      SELECT g.*,
      c.name AS "categoryName"
      FROM games g
      JOIN categories c ON c.id=g."categoryId" 
    `);
      res.send(result.rows);
    }
  } catch (erro) {
    res.status(500).send(erro);
  }
}
