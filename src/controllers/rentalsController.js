import db from '../database.js';
import dayjs from 'dayjs';

export async function getRentals(req, res) {
  const queryCustomer = req.query.customerId;
  const queryGame = req.query.gameId;
  let query = `
  SELECT r.*,
  cu.id AS "customer_id",
  cu.name AS "customer_name",
  g.id AS "game_id",
  g.name AS "game_name",
  ca.id AS "game_category_id",
  ca.name AS "game_category_name"
  from rentals r
  JOIN customers cu ON r."customerId"=cu.id
  JOIN games g ON r."gameId"=g.id
  JOIN categories ca ON g."categoryId"=ca.id
`;

const queryArray = [];
if(queryCustomer){
    queryArray.push(queryCustomer);
    query = `
    ${query} WHERE cu.id=$1
  `;
};
if(queryGame){
    queryArray.push(queryGame);
    query = `
    ${query} WHERE g.id=$2
  `;
};
  try {
    if(queryCustomer){

    }

    const result = await db.query(query, queryArray);

    res.send(result.rows.map(({
      id,
      customerId,
      gameId,
      rentDate,
      daysRented,
      returnDate,
      originalPrice,
      delayFee,
      customer_id,
      customer_name,
      game_id,
      game_name,
      game_category_id,
      game_category_name }) => {
      return {
        id,
        customerId,
        gameId,
        rentDate: dayjs(rentDate).format('YYYY-MM-DD'),
        daysRented,
        returnDate: returnDate ? dayjs(rentDate).format('YYYY-MM-DD') : null,
        originalPrice,
        delayFee,
        customer: {
          id: customer_id,
          name: customer_name
        },
        game: {
          id: game_id,
          name: game_name,
          categoryId: game_category_id,
          categoryName: game_category_name
        }
      };
    }));

  } catch (erro) {
    res.status(500).send(erro);
  }
}


export async function postRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  const rentDate = dayjs().format("YYYY-MM-DD");
  try {

    const validateCustomer = await db.query(`SELECT * FROM customers WHERE id=$1`, [customerId]);
    if (validateCustomer.rows.length === 0) {
      return res.sendStatus(400);
    }

    const validateGame = await db.query(`SELECT * FROM games WHERE id=$1`, [gameId]);
    if (validateGame.rows.length === 0) {
      return res.sendStatus(400);
    }

    if(daysRented <=0){
      return res.sendStatus(400);
    }

    const validateRentals = await db.query(`
    select * from rentals
    where "gameId" = $1 
    and "returnDate" is null`, [gameId]);
    if(validateGame.rows[0].stockTotal <= validateRentals.rows.length){
        res.sendStatus(400);
        return;
    };
    
    const pricePerDay = await db.query(`
      SELECT games."pricePerDay"
      FROM games WHERE id = $1`, [gameId]);

    const originalPrice = daysRented * pricePerDay.rows[0].pricePerDay;

    await db.query(`
      INSERT INTO rentals (
      "customerId",
      "gameId",
      "rentDate",
      "daysRented",
      "returnDate",
      "originalPrice",
      "delayFee")
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [customerId, gameId, rentDate, daysRented, null, originalPrice, null]);
    res.sendStatus(201);

  } catch (erro) {
    res.status(500).send(erro);
  }
}

export async function returnRentals(req, res) {
  const { id } = req.params;
  const returnDate = dayjs().format('YYYY-MM-DD');
  let delayFee = 0;
  const delayDates = dayjs(res.locals.rentDate).add(res.locals.daysRented, 'day').diff(returnDate, 'day');

  if (delayDates < 0) {
    delayFee = delayDates * -1 * (res.locals.originalPrice / res.locals.daysRented);
  };

  const validateRentals = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
  if (validateRentals.rows.length === 0) {
    return res.sendStatus(404);
  }
  if(validateRentals.rows[0].returnDate !== null){
    return res.sendStatus(400);
  }


  try {
    await db.query(`
    UPDATE rentals 
    SET "returnDate" = $2, "delayFee" = $3 
    WHERE id = $1`, [id, returnDate, delayFee]);
  }
  catch (erro) {
    console.log(erro);
    res.sendStatus(500);
  }
}

export async function deleteRentals(req, res) {
  const { id } = req.params;

  try {

    const validateRentals = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
    if (validateRentals.rows.length === 0) {
      return res.sendStatus(404);
    }

    if(validateRentals.rows[0].returnDate !== null){
      return res.sendStatus(400);
    }


    await db.query(`
      DELETE FROM rentals WHERE id=$1
    `, [id]);

    res.sendStatus(200);
  } catch (erro) {
    console.log(erro);
    res.sendStatus(500);
  }
}