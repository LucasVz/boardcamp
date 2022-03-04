import db from '../database.js';

export async function postCategories(req, res){
    const {name} = req.body;

    try {

        const result = await db.query(`SELECT id FROM categories WHERE name=$1`, [name]);
        if (result.rows.length > 0) {
          return res.status(409).send('Livro já cadastrado')
        }

        await db.query(`
        INSERT INTO 
          categories (name)
          VALUES ($1)
      `, [name]);

        res.sendStatus(201);

      } catch (erro) {
        res.status(500).send(erro);
      }
}

export async function getCategories(req, res){
  try {
    const result = await db.query(`
      SELECT *
      FROM categories
    `);

    res.send(result.rows);
  } catch (erro) {
    res.status(500).send(erro);
  }
}
